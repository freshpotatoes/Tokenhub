-- ============================================================
-- 真实 API 中转站数据 — 逐条 INSERT (每次复制一条执行)
-- 使用方法:在 Supabase SQL Editor 中先执行 DELETE,再逐条 INSERT
-- ============================================================

DELETE FROM providers;

-- 1. PackyAPI
INSERT INTO providers (id, name, slug, website_url, founded_at, status,
  categories, supported_models, openai_compatible, supports_streaming,
  supports_function_call, price_multiplier, billing_type, has_free_quota,
  rate_limit_note, concurrency_limit, payment_methods, signup_barrier,
  reputation_score, runaway_risk, community_links, description)
VALUES (
  '20000000-0000-0000-0000-000000000001', 'PackyAPI', 'packyapi',
  'https://www.packyapi.com', '2024-03-01', 'online',
  ARRAY['chat','coding','embedding'],
  ARRAY['openai','claude','gemini','qwen','deepseek','glm'], true, true, true,
  0.50, 'prepaid', true,
  '各分组倍率不同,CC分组专用不可接第三方', NULL,
  ARRAY['alipay','wechat','card','paypal'], 'low', 4.0, 'low',
  '[{"type":"tg","label":"官方频道","url":"https://t.me/Packycode"},{"type":"qq","label":"主站QQ群","url":"https://qm.qq.com/q/packyapi"}]'::jsonb,
  '国内最早做Claude Code中转的上游供应商,原名PackyCode。注册送$1余额,首次充值9折。');

-- 2. RightCode
INSERT INTO providers (id, name, slug, website_url, founded_at, status, categories, supported_models, openai_compatible, supports_streaming, supports_function_call, price_multiplier, billing_type, has_free_quota, rate_limit_note, concurrency_limit, payment_methods, signup_barrier, reputation_score, runaway_risk, community_links, description) VALUES ('20000000-0000-0000-0000-000000000002', 'RightCode', 'rightcode', 'https://www.right.codes', '2024-05-01', 'online', ARRAY['chat','coding'], ARRAY['openai','claude','gemini'], true, true, true, 0.35, 'prepaid', false, 'Sonnet极稳,Opus经常缺货;Codex包月 1499起', NULL, ARRAY['alipay','wechat'], 'medium', 3.5, 'medium', '[]'::jsonb, '企业级AI Agent中转平台。按量付费1RMB约3-5USD购买力,最低充值1元。Codex有包月方案。');

-- 3. 0011.ai
INSERT INTO providers (id, name, slug, website_url, founded_at, status, categories, supported_models, openai_compatible, supports_streaming, supports_function_call, price_multiplier, billing_type, has_free_quota, rate_limit_note, concurrency_limit, payment_methods, signup_barrier, reputation_score, runaway_risk, community_links, description) VALUES ('20000000-0000-0000-0000-000000000003', '0011.ai', '0011ai', 'https://0011.ai', '2024-06-01', 'online', ARRAY['chat','coding'], ARRAY['openai','claude'], true, true, true, 0.55, 'prepaid', true, '按量$5起充;Pro订阅约$14/月;Ultra每日$16额度', NULL, ARRAY['alipay','wechat'], 'low', 3.5, 'medium', '[]'::jsonb, 'Claude Code + OpenAI Codex通用积分平台。微信支付宝直充,邀请码注册送$1。费用比官方低40-60%。');

-- 4. OpenRouter
INSERT INTO providers (id, name, slug, website_url, founded_at, status, categories, supported_models, openai_compatible, supports_streaming, supports_function_call, price_multiplier, billing_type, has_free_quota, rate_limit_note, concurrency_limit, payment_methods, signup_barrier, reputation_score, runaway_risk, community_links, description) VALUES ('20000000-0000-0000-0000-000000000004', 'OpenRouter', 'openrouter', 'https://openrouter.ai', '2023-01-01', 'online', ARRAY['chat','coding','embedding','rerank','image_gen','image_understanding'], ARRAY['openai','claude','gemini','deepseek','mistral','llama','qwen'], true, true, true, 1.00, 'prepaid', false, '免费模型27个;国内需代理访问', NULL, ARRAY['card','crypto_other'], 'low', 4.5, 'low', '[{"type":"discord","label":"Discord社区","url":"https://discord.gg/openrouter"}]'::jsonb, '国际最大大模型API聚合平台。覆盖300+模型/60+供应商。绝大多数模型官方原价,27个免费模型。国内需代理访问。');

-- 5. aigocode
INSERT INTO providers (id, name, slug, website_url, founded_at, status, categories, supported_models, openai_compatible, supports_streaming, supports_function_call, price_multiplier, billing_type, has_free_quota, rate_limit_note, concurrency_limit, payment_methods, signup_barrier, reputation_score, runaway_risk, community_links, description) VALUES ('20000000-0000-0000-0000-000000000005', 'aigocode', 'aigocode', 'https://www.aigocode.com', '2024-07-01', 'online', ARRAY['chat','coding'], ARRAY['openai','claude','gemini'], true, true, true, 0.40, 'subscription', false, '月卡399/4周;不同方案价格不同', NULL, ARRAY['alipay','wechat'], 'low', 3.0, 'medium', '[]'::jsonb, '以月卡订阅为主的中转站。Opus 4.6按方案2-9/百万Token。社区口碑尚可。');

-- 6. ClaudeAPI
INSERT INTO providers (id, name, slug, website_url, founded_at, status, categories, supported_models, openai_compatible, supports_streaming, supports_function_call, price_multiplier, billing_type, has_free_quota, rate_limit_note, concurrency_limit, payment_methods, signup_barrier, reputation_score, runaway_risk, community_links, description) VALUES ('20000000-0000-0000-0000-000000000006', 'ClaudeAPI', 'claudeapi', 'https://www.claudeapi.com', '2024-04-01', 'online', ARRAY['chat','coding'], ARRAY['claude','openai'], true, true, true, 0.75, 'prepaid', false, '全球加速节点,延迟小于200ms,可用性99.8%', NULL, ARRAY['alipay','wechat'], 'low', 3.0, 'medium', '[]'::jsonb, '专注Claude模型的中转服务,全球加速,低延迟。完全兼容OpenAI SDK。');

-- 7. 硅基流动 SiliconFlow
INSERT INTO providers (id, name, slug, website_url, founded_at, status, categories, supported_models, openai_compatible, supports_streaming, supports_function_call, price_multiplier, billing_type, has_free_quota, rate_limit_note, concurrency_limit, payment_methods, signup_barrier, reputation_score, runaway_risk, community_links, description) VALUES ('20000000-0000-0000-0000-000000000007', '硅基流动', 'siliconflow', 'https://www.siliconflow.cn', '2023-06-01', 'online', ARRAY['chat','coding','embedding','rerank','image_gen','audio_tts'], ARRAY['deepseek','qwen','glm','yi','llama','mistral'], true, true, true, 0.60, 'prepaid', true, '免费额度有RPM限制;付费版可提并发', NULL, ARRAY['alipay','wechat'], 'low', 4.0, 'low', '[{"type":"discord","label":"Discord社区","url":"https://discord.gg/siliconflow"}]'::jsonb, '国内知名AI推理平台。托管DeepSeek/Qwen/GLM等开源模型,大量免费额度。企业级稳定性。');

-- 8. 302.AI
INSERT INTO providers (id, name, slug, website_url, founded_at, status, categories, supported_models, openai_compatible, supports_streaming, supports_function_call, price_multiplier, billing_type, has_free_quota, rate_limit_note, concurrency_limit, payment_methods, signup_barrier, reputation_score, runaway_risk, community_links, description) VALUES ('20000000-0000-0000-0000-000000000008', '302.AI', '302ai', 'https://302.ai', '2024-08-01', 'online', ARRAY['chat','coding','image_gen','audio_tts'], ARRAY['openai','claude','gemini','deepseek','qwen','glm','mistral','llama'], true, true, true, 0.65, 'prepaid', true, '按套餐等级限制', NULL, ARRAY['alipay','wechat','card'], 'low', 3.5, 'medium', '[]'::jsonb, 'AI应用平台,同时提供API中转功能。支持OpenAI/Claude/Gemini及国产主流模型。注册送体验额度。');

-- 9. API易
INSERT INTO providers (id, name, slug, website_url, founded_at, status, categories, supported_models, openai_compatible, supports_streaming, supports_function_call, price_multiplier, billing_type, has_free_quota, rate_limit_note, concurrency_limit, payment_methods, signup_barrier, reputation_score, runaway_risk, community_links, description) VALUES ('20000000-0000-0000-0000-000000000009', 'API易', 'apiyi', 'https://www.apiyi.com', '2023-09-01', 'online', ARRAY['chat','coding'], ARRAY['openai','claude','gemini','qwen','deepseek'], true, true, true, 0.55, 'prepaid', true, '未明确公开限制策略', NULL, ARRAY['alipay','wechat'], 'low', 3.0, 'medium', '[{"type":"qq","label":"QQ群","url":"https://qm.qq.com/q/apiyi"}]'::jsonb, '国内老牌API中转站,百度百科收录。运营时间较长,用户基数较大。注册送免费额度。');

-- 10. FoxCode
INSERT INTO providers (id, name, slug, website_url, founded_at, status, categories, supported_models, openai_compatible, supports_streaming, supports_function_call, price_multiplier, billing_type, has_free_quota, rate_limit_note, concurrency_limit, payment_methods, signup_barrier, reputation_score, runaway_risk, community_links, description) VALUES ('20000000-0000-0000-0000-000000000010', 'FoxCode', 'foxcode', 'https://foxcode.app', '2024-09-01', 'online', ARRAY['chat','coding'], ARRAY['openai','claude','gemini'], true, true, true, 0.25, 'prepaid', false, '每天有1-2小时不稳定期;性价比极高但波动大', NULL, ARRAY['alipay','wechat'], 'low', 2.5, 'high', '[]'::jsonb, '性价比极高的中转站,RMB:USD约1:11-17。每天有1-2小时波动期。小额使用,不建议大额。');

-- 验证
SELECT count(*) FROM providers;
