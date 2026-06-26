/**
 * 筛选与排序逻辑(纯函数)
 *
 * 设计原则:
 * - 跨类别筛选条件取交集(AND):用户选「在线 + 支付宝」→ 同时满足两个条件
 * - 同类筛选条件取并集(OR):用户选「OpenAI + Claude」→ 只要支持其中一种
 * - 排序叠加在筛选结果之上
 */

import {
  Provider, FilterParams, ModelFamily, ProviderStatus, BillingType,
  PaymentMethod, SignupBarrier, CategoryType,
  MODEL_LABELS, CATEGORY_LABELS, PAYMENT_LABELS,
  BILLING_LABELS, SIGNUP_BARRIER_LABELS, STATUS_LABELS,
} from './types';

/**
 * 对中转站列表执行筛选 + 排序
 * @param providers 全量数据
 * @param params   筛选/排序参数
 * @returns 筛选并排序后的结果
 */
export function filterProviders(
  providers: Provider[],
  params: FilterParams
): Provider[] {
  let result = [...providers];

  // ---- 状态筛选 (单选或多选) ----
  if (params.status) {
    const statuses = toArray(params.status);
    result = result.filter((p) => statuses.includes(p.status));
  }

  // ---- 模型筛选 (同类 OR:支持其中一种模型即命中) ----
  if (params.models) {
    const models = toArray(params.models);
    result = result.filter((p) =>
      models.some((m) => p.supported_models.includes(m))
    );
  }

  // ---- 用途分类筛选 (同类 OR:只要包含任一选中分类即命中) ----
  if (params.categories) {
    const cats = toArray(params.categories);
    result = result.filter((p) =>
      cats.some((c) => (p.categories || []).includes(c))
    );
  }

  // ---- 计费方式筛选 ----
  if (params.billing) {
    const billings = toArray(params.billing);
    result = result.filter((p) => billings.includes(p.billing_type));
  }

  // ---- 支付方式筛选 (同类 OR) ----
  if (params.payment) {
    const payments = toArray(params.payment);
    result = result.filter((p) =>
      payments.some((pm) => p.payment_methods.includes(pm))
    );
  }

  // ---- 注册门槛筛选 ----
  if (params.signupBarrier) {
    result = result.filter((p) => p.signup_barrier === params.signupBarrier);
  }

  // ---- 免费额度筛选 ----
  if (params.hasFreeQuota !== undefined) {
    result = result.filter((p) => p.has_free_quota === params.hasFreeQuota);
  }

  // ---- 关键词搜索(名称 + 描述 + 分类 + 模型 + 支付 + 计费 + 门槛 + 状态) ----
  // 用户输入中文(如"文生图")或英文(如"image_gen")都能命中
  if (params.search) {
    const q = params.search.toLowerCase().trim();
    if (q) {
      result = result.filter((p) => {
        // 名称 & 描述
        if (p.name.toLowerCase().includes(q)) return true;
        if (p.description.toLowerCase().includes(q)) return true;
        // 用途分类:同时匹配英文 key 和中文标签
        if ((p.categories || []).some(
          (c) => c.toLowerCase().includes(q) || (CATEGORY_LABELS[c] || '').includes(q)
        )) return true;
        // 支持模型:同时匹配英文 key 和中文标签
        if (p.supported_models.some(
          (m) => m.toLowerCase().includes(q) || (MODEL_LABELS[m] || '').includes(q)
        )) return true;
        // 支付方式
        if (p.payment_methods.some(
          (pm) => pm.toLowerCase().includes(q) || (PAYMENT_LABELS[pm] || '').includes(q)
        )) return true;
        // 计费方式
        if ((BILLING_LABELS[p.billing_type] || '').includes(q)) return true;
        if (p.billing_type.toLowerCase().includes(q)) return true;
        // 注册门槛
        if ((SIGNUP_BARRIER_LABELS[p.signup_barrier] || '').includes(q)) return true;
        if (p.signup_barrier.toLowerCase().includes(q)) return true;
        // 运营状态
        if ((STATUS_LABELS[p.status] || '').includes(q)) return true;
        if (p.status.toLowerCase().includes(q)) return true;
        return false;
      });
    }
  }

  // ---- 排序 ----
  if (params.sort) {
    result = applySort(result, params.sort);
  } else {
    // 默认排序:信誉分降序(高分在前)
    result.sort((a, b) => b.reputation_score - a.reputation_score);
  }

  return result;
}

/** 排序实现 */
function applySort(providers: Provider[], sort: FilterParams['sort']): Provider[] {
  switch (sort) {
    case 'price_asc':
      // 价格从低到高
      return providers.sort((a, b) => a.price_multiplier - b.price_multiplier);

    case 'price_desc':
      // 价格从高到低
      return providers.sort((a, b) => b.price_multiplier - a.price_multiplier);

    case 'reputation_desc':
      // 信誉从高到低
      return providers.sort((a, b) => b.reputation_score - a.reputation_score);

    case 'founded_desc':
      // 上线时间从新到旧
      return providers.sort(
        (a, b) =>
          new Date(b.founded_at).getTime() - new Date(a.founded_at).getTime()
      );

    case 'name_asc':
      // 名称 A→Z(支持中文排序)
      return providers.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));

    default:
      return providers;
  }
}

/** 辅助:将单值或数组统一为数组 */
function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

// ===== 从 URL SearchParams 解析筛选参数 =====

/**
 * 将 Next.js searchParams 解析为 FilterParams
 * 用于服务端组件读取 URL 参数并筛选
 */
export function parseSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): FilterParams {
  const params: FilterParams = {};

  // 状态
  if (searchParams.status) {
    const raw = Array.isArray(searchParams.status)
      ? searchParams.status
      : searchParams.status.split(',');
    params.status = raw.filter(isValidStatus) as ProviderStatus[];
  }

  // 模型
  if (searchParams.models) {
    const raw = Array.isArray(searchParams.models)
      ? searchParams.models
      : searchParams.models.split(',');
    params.models = raw.filter(isValidModel) as ModelFamily[];
  }

  // 用途分类
  if (searchParams.categories) {
    const raw = Array.isArray(searchParams.categories)
      ? searchParams.categories
      : searchParams.categories.split(',');
    params.categories = raw.filter(isValidCategory) as CategoryType[];
  }

  // 计费方式
  if (searchParams.billing) {
    const raw = Array.isArray(searchParams.billing)
      ? searchParams.billing
      : searchParams.billing.split(',');
    params.billing = raw.filter(isValidBilling) as BillingType[];
  }

  // 支付方式
  if (searchParams.payment) {
    const raw = Array.isArray(searchParams.payment)
      ? searchParams.payment
      : searchParams.payment.split(',');
    params.payment = raw.filter(isValidPayment) as PaymentMethod[];
  }

  // 注册门槛
  if (searchParams.signupBarrier && typeof searchParams.signupBarrier === 'string') {
    params.signupBarrier = searchParams.signupBarrier as SignupBarrier;
  }

  // 免费额度
  if (searchParams.hasFreeQuota === 'true') params.hasFreeQuota = true;
  if (searchParams.hasFreeQuota === 'false') params.hasFreeQuota = false;

  // 搜索
  if (typeof searchParams.search === 'string') {
    params.search = searchParams.search;
  }

  // 排序
  if (typeof searchParams.sort === 'string') {
    params.sort = searchParams.sort as FilterParams['sort'];
  }

  return params;
}

// ---- 类型守卫 ----

const VALID_STATUSES: ProviderStatus[] = ['online', 'suspect', 'dead'];
function isValidStatus(v: string): v is ProviderStatus {
  return VALID_STATUSES.includes(v as ProviderStatus);
}

const VALID_MODELS: ModelFamily[] = [
  'openai', 'claude', 'gemini', 'qwen', 'deepseek',
  'ernie', 'glm', 'moonshot', 'yi', 'mistral', 'llama', 'other',
];
function isValidModel(v: string): v is ModelFamily {
  return VALID_MODELS.includes(v as ModelFamily);
}

const VALID_BILLINGS: BillingType[] = ['prepaid', 'postpaid', 'subscription'];
function isValidBilling(v: string): v is BillingType {
  return VALID_BILLINGS.includes(v as BillingType);
}

const VALID_PAYMENTS: PaymentMethod[] = [
  'alipay', 'wechat', 'usdt', 'card', 'paypal', 'crypto_other',
];
function isValidPayment(v: string): v is PaymentMethod {
  return VALID_PAYMENTS.includes(v as PaymentMethod);
}

const VALID_CATEGORIES: CategoryType[] = [
  'chat', 'coding', 'image_gen', 'video_gen',
  'image_understanding', 'audio_tts', 'audio_asr', 'embedding', 'rerank',
];
function isValidCategory(v: string): v is CategoryType {
  return VALID_CATEGORIES.includes(v as CategoryType);
}
