// ===== 枚举 / 联合类型 =====

/**
 * 支持的模型系列
 * 用于筛选和展示,覆盖主流国际 + 国产模型
 */
export type ModelFamily =
  | 'openai'        // GPT-4o, GPT-4, GPT-3.5 等
  | 'claude'        // Claude Opus, Sonnet, Haiku
  | 'gemini'        // Gemini 1.5/2.0 系列
  | 'qwen'          // 通义千问
  | 'deepseek'      // DeepSeek
  | 'ernie'         // 文心一言
  | 'glm'           // 智谱 ChatGLM
  | 'moonshot'      // Moonshot / Kimi
  | 'yi'            // 零一万物 Yi
  | 'mistral'       // Mistral 系列
  | 'llama'         // LLaMA 系列
  | 'other';

/**
 * 用途分类
 * 一个中转站可属于多个分类,用于按场景筛选
 */
export type CategoryType =
  | 'chat'                  // AI 对话/聊天
  | 'coding'                // 代码生成/辅助
  | 'image_gen'             // 文生图
  | 'video_gen'             // 文生视频
  | 'image_understanding'   // 图片理解/识别
  | 'audio_tts'             // 语音合成(TTS)
  | 'audio_asr'             // 语音识别(ASR)
  | 'embedding'             // 文本向量/Embedding
  | 'rerank';               // 重排序/Rerank

/** 用途分类中文映射,用于 UI 展示 */
export const CATEGORY_LABELS: Record<CategoryType, string> = {
  chat:                'AI 对话',
  coding:              '代码生成',
  image_gen:           '文生图',
  video_gen:           '文生视频',
  image_understanding: '图片理解',
  audio_tts:           '语音合成',
  audio_asr:           '语音识别',
  embedding:           '向量嵌入',
  rerank:              '重排序',
};

/** 用途分类颜色映射(浅底 + 深字),用于徽标渲染 */
export const CATEGORY_COLORS: Record<CategoryType, string> = {
  chat:                'bg-blue-100 text-blue-700',
  coding:              'bg-purple-100 text-purple-700',
  image_gen:           'bg-pink-100 text-pink-700',
  video_gen:           'bg-orange-100 text-orange-700',
  image_understanding: 'bg-cyan-100 text-cyan-700',
  audio_tts:           'bg-green-100 text-green-700',
  audio_asr:           'bg-lime-100 text-lime-700',
  embedding:           'bg-gray-100 text-gray-700',
  rerank:              'bg-amber-100 text-amber-700',
};

/** 模型中文映射,用于 UI 展示 */
export const MODEL_LABELS: Record<ModelFamily, string> = {
  openai:   'OpenAI (GPT)',
  claude:   'Anthropic (Claude)',
  gemini:   'Google (Gemini)',
  qwen:     '通义千问',
  deepseek: 'DeepSeek',
  ernie:    '文心一言',
  glm:      '智谱 GLM',
  moonshot: 'Moonshot / Kimi',
  yi:       '零一万物 Yi',
  mistral:  'Mistral',
  llama:    'LLaMA',
  other:    '其他模型',
};

export type ProviderStatus = 'online' | 'suspect' | 'dead';

/** 状态中文映射 */
export const STATUS_LABELS: Record<ProviderStatus, string> = {
  online:  '正常运营',
  suspect: '状态可疑',
  dead:    '已关站',
};

export type BillingType = 'prepaid' | 'postpaid' | 'subscription';

export const BILLING_LABELS: Record<BillingType, string> = {
  prepaid:      '预付费',
  postpaid:     '后付费',
  subscription: '订阅制',
};

export type SignupBarrier = 'low' | 'medium' | 'high';

export const SIGNUP_BARRIER_LABELS: Record<SignupBarrier, string> = {
  low:    '低门槛',
  medium: '中等门槛',
  high:   '高门槛',
};

export type RunawayRisk = 'low' | 'medium' | 'high';

export const RUNAWAY_RISK_LABELS: Record<RunawayRisk, string> = {
  low:    '低风险',
  medium: '中风险',
  high:   '高风险',
};

export type PaymentMethod =
  | 'alipay'
  | 'wechat'
  | 'usdt'
  | 'card'
  | 'paypal'
  | 'crypto_other';

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  alipay:       '支付宝',
  wechat:       '微信支付',
  usdt:         'USDT',
  card:         '银行卡',
  paypal:       'PayPal',
  crypto_other: '其他加密货币',
};

export type CommunityType = 'tg' | 'qq' | 'discord' | 'wechat_group' | 'other';

export const COMMUNITY_LABELS: Record<CommunityType, string> = {
  tg:           'Telegram',
  qq:           'QQ 群',
  discord:      'Discord',
  wechat_group: '微信群',
  other:        '其他社群',
};

// ===== 复合类型 =====

export interface CommunityLink {
  type: CommunityType;
  label: string;
  url: string;
}

export interface PriceHistoryRecord {
  id: string;
  provider_id: string;
  model: ModelFamily;
  price_multiplier: number;
  recorded_at: string; // ISO 8601
}

// ===== 核心数据行 =====

export interface Provider {
  id: string;
  name: string;
  slug: string;
  website_url: string;
  logo_url: string;
  founded_at: string;
  status: ProviderStatus;

  // 模型支持
  supported_models: ModelFamily[];
  /** 用途分类(可多个) */
  categories: CategoryType[];
  openai_compatible: boolean;
  supports_streaming: boolean;
  supports_function_call: boolean;

  // 价格
  price_multiplier: number;
  billing_type: BillingType;
  has_free_quota: boolean;

  // 限额
  rate_limit_note: string;
  concurrency_limit: number | null;

  // 支付
  payment_methods: PaymentMethod[];

  // 门槛 & 口碑
  signup_barrier: SignupBarrier;
  reputation_score: number; // 0–5,步长 0.5
  runaway_risk: RunawayRisk;

  // 社群
  community_links: CommunityLink[];

  // 描述
  description: string;

  // 时间戳
  last_checked_at: string | null;
  created_at: string;
  updated_at: string;
}

// ===== 用户提交草稿 =====

export interface ProviderDraft {
  id: string;
  name: string;
  website_url: string;
  submitter_note: string;
  suggested_models: ModelFamily[];
  suggested_price_multiplier?: number;
  contact_email?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

// ===== 筛选参数 =====

export interface FilterParams {
  status?: ProviderStatus | ProviderStatus[];
  models?: ModelFamily | ModelFamily[];
  categories?: CategoryType | CategoryType[];
  billing?: BillingType | BillingType[];
  payment?: PaymentMethod | PaymentMethod[];
  signupBarrier?: SignupBarrier;
  hasFreeQuota?: boolean;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'reputation_desc' | 'founded_desc' | 'name_asc';
}

// ===== 存活探测结果 =====

export interface ProbeResult {
  slug: string;
  url: string;
  oldStatus: ProviderStatus;
  newStatus: ProviderStatus;
  statusCode: number | null;
  latencyMs: number | null;
  error?: string;
}
