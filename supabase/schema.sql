-- ============================================================
-- TokenHub 数据库 Schema
-- 目标数据库: Supabase (PostgreSQL)
-- 使用方法:
--   1. 在 Supabase Dashboard 中打开 SQL Editor
--   2. 粘贴本文件全部内容并执行
--   3. 执行后可看到 providers / price_history / drafts 三张表
-- ============================================================

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. 中转站主表
-- ============================================================
CREATE TABLE IF NOT EXISTS providers (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  website_url TEXT NOT NULL,
  logo_url    TEXT NOT NULL DEFAULT '',
  founded_at  DATE,
  status      TEXT NOT NULL DEFAULT 'online'
              CHECK (status IN ('online', 'suspect', 'dead')),

  -- 模型支持
  supported_models       TEXT[] NOT NULL DEFAULT '{}',
  openai_compatible      BOOLEAN NOT NULL DEFAULT false,
  supports_streaming     BOOLEAN NOT NULL DEFAULT true,
  supports_function_call BOOLEAN NOT NULL DEFAULT false,

  -- 价格
  price_multiplier NUMERIC(4,2) NOT NULL DEFAULT 1.00,
  billing_type     TEXT NOT NULL DEFAULT 'prepaid'
                   CHECK (billing_type IN ('prepaid', 'postpaid', 'subscription')),
  has_free_quota   BOOLEAN NOT NULL DEFAULT false,

  -- 限额
  rate_limit_note   TEXT NOT NULL DEFAULT '',
  concurrency_limit INTEGER,

  -- 支付
  payment_methods TEXT[] NOT NULL DEFAULT '{}',

  -- 门槛 & 口碑
  signup_barrier   TEXT NOT NULL DEFAULT 'medium'
                   CHECK (signup_barrier IN ('low', 'medium', 'high')),
  reputation_score NUMERIC(2,1) NOT NULL DEFAULT 3.0
                   CHECK (reputation_score >= 0 AND reputation_score <= 5),
  runaway_risk     TEXT NOT NULL DEFAULT 'medium'
                   CHECK (runaway_risk IN ('low', 'medium', 'high')),

  -- 社群 (JSONB 数组: [{type, label, url}])
  community_links JSONB NOT NULL DEFAULT '[]',

  -- 描述
  description TEXT NOT NULL DEFAULT '',

  -- 时间戳
  last_checked_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_providers_status ON providers(status);
CREATE INDEX IF NOT EXISTS idx_providers_slug  ON providers(slug);
CREATE INDEX IF NOT EXISTS idx_providers_reputation ON providers(reputation_score DESC);

-- ============================================================
-- 2. 价格历史表
-- ============================================================
CREATE TABLE IF NOT EXISTS price_history (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id      UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  model            TEXT NOT NULL,
  price_multiplier NUMERIC(4,2) NOT NULL,
  recorded_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_price_history_provider
  ON price_history(provider_id, recorded_at DESC);

-- ============================================================
-- 3. 用户提交草稿表
-- ============================================================
CREATE TABLE IF NOT EXISTS drafts (
  id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                     TEXT NOT NULL,
  website_url              TEXT NOT NULL,
  submitter_note           TEXT NOT NULL DEFAULT '',
  suggested_models         TEXT[] NOT NULL DEFAULT '{}',
  suggested_price_multiplier NUMERIC(4,2),
  contact_email            TEXT,
  status                   TEXT NOT NULL DEFAULT 'pending'
                           CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_drafts_status ON drafts(status, created_at DESC);

-- ============================================================
-- 4. 自动更新 updated_at 触发器
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_providers_updated_at ON providers;
CREATE TRIGGER trg_providers_updated_at
  BEFORE UPDATE ON providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 5. Row Level Security (RLS)
-- 公开读取,仅管理员可写
-- ============================================================
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;

-- 所有人可读 providers
CREATE POLICY "Allow public read on providers"
  ON providers FOR SELECT USING (true);

-- 所有人可读 price_history
CREATE POLICY "Allow public read on price_history"
  ON price_history FOR SELECT USING (true);

-- 所有人可插入 drafts(用户提交)
CREATE POLICY "Allow public insert on drafts"
  ON drafts FOR INSERT WITH CHECK (true);

-- 仅 service_role 可修改 providers(通过后端 API)
CREATE POLICY "Allow service write on providers"
  ON providers FOR ALL
  USING (true)
  WITH CHECK (true);
-- 注: 上面的 open policy 仅用于 MVP。生产环境建议:
-- CREATE POLICY "Allow service write on providers"
--   ON providers FOR ALL
--   USING (auth.role() = 'service_role')
--   WITH CHECK (auth.role() = 'service_role');

-- ============================================================
-- 6. 插入示例数据(从 mock JSON 迁移)
-- ============================================================
-- 取消下面的注释,执行后将 mock 数据写入 Supabase:
/*
INSERT INTO providers (id, name, slug, website_url, founded_at, status,
  supported_models, openai_compatible, supports_streaming, supports_function_call,
  price_multiplier, billing_type, has_free_quota, rate_limit_note, concurrency_limit,
  payment_methods, signup_barrier, reputation_score, runaway_risk, community_links, description)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'OpenRouter China', 'openrouter-china',
   'https://openrouter-china.example.com', '2023-06-01', 'online',
   ARRAY['openai','claude','gemini','deepseek','mistral','llama'], true, true, true,
   1.05, 'prepaid', true, '无公开限制,高并发可能限速', NULL,
   ARRAY['alipay','wechat','usdt','card'], 'low', 4.5, 'low',
   '[{"type":"tg","label":"官方公告频道","url":"https://t.me/openrouter_china"},{"type":"discord","label":"用户社区","url":"https://discord.gg/openrouter-china"}]',
   '老牌中转站,上线超过2年,支持模型最全。API 格式完全兼容 OpenAI,一行代码切换。免费额度每日 50 次请求。'),
  ...
*/

-- ============================================================
-- 7. 用途分类字段迁移 (ALTER TABLE)
-- ============================================================
-- 在已有 providers 表上新增 categories 字段。
-- 如果表尚未创建,请将下面的 ALTER 改为在 CREATE TABLE 中直接加入:
--   categories TEXT[] NOT NULL DEFAULT '{}',
--
-- 执行方式:
--   在 Supabase SQL Editor 中单独执行以下 ALTER 语句

ALTER TABLE providers
  ADD COLUMN IF NOT EXISTS categories TEXT[] NOT NULL DEFAULT '{}';

-- 为 categories 创建 GIN 索引以加速筛选查询
CREATE INDEX IF NOT EXISTS idx_providers_categories
  ON providers USING GIN (categories);

-- 更新已有数据的 categories(按站点用途手动回填)
-- 取消注释并修改为实际数据:
/*
UPDATE providers SET categories = ARRAY['chat','coding','embedding'] WHERE slug = 'openrouter-china';
UPDATE providers SET categories = ARRAY['chat','coding','image_gen','audio_tts'] WHERE slug = 'apihub';
UPDATE providers SET categories = ARRAY['chat','coding'] WHERE slug = 'oneapi-cloud';
UPDATE providers SET categories = ARRAY['chat','coding','embedding','rerank'] WHERE slug = 'aigateway-pro';
UPDATE providers SET categories = ARRAY['chat'] WHERE slug = 'tokenpool';
UPDATE providers SET categories = ARRAY['chat','coding','image_gen','video_gen','audio_tts','audio_asr'] WHERE slug = 'modelhub-cn';
UPDATE providers SET categories = ARRAY['chat','coding','embedding'] WHERE slug = 'llmproxy-global';
UPDATE providers SET categories = ARRAY['chat','coding','image_gen','image_understanding'] WHERE slug = 'aistudio-china';
UPDATE providers SET categories = ARRAY['chat','coding'] WHERE slug = 'gpthub';
UPDATE providers SET categories = ARRAY['chat','coding','image_gen','audio_tts','embedding'] WHERE slug = 'uniapi';
*/
