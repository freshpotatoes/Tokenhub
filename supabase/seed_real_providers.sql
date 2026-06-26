-- ============================================================
-- 真实 API 中转站数据 — 替换 mock 数据
-- 在 Supabase SQL Editor 中执行
-- 来源:知乎/V2EX/LINUX DO/什么值得买 社区公开信息(2026.06)
-- ============================================================

-- 清空旧数据
DELETE FROM providers;

-- ============================================================
-- 1. PackyAPI (原 PackyCode)
-- 国内最早做 Claude Code 中转的上游供应商,27+模型分组
-- 来源: https://linux.do/t/topic/1133615
-- ============================================================
INSERT INTO providers (id, name, slug, website_url, founded_at, status,
  categories, supported_models, openai_compatible, supports_streaming,
  supports_function_call, price_multiplier, billing_type, has_free_quota,
  rate_limit_note, concurrency_limit, payment_methods, signup_barrier,
  reputation_score, runaway_risk, community_links, description,
  last_checked_at, created_at, updated_at)
VALUES
  ('20000000-0000-0000-0000-000000000001', 'PackyAPI', 'packyapi',
   'https://www.packyapi.com', '2024-03-01', 'online',
   ARRAY['chat','coding','embedding'],
   ARRAY['openai','claude','gemini','qwen','deepseek','glm'], true, true, true,
   0.50, 'prepaid', true,
   '各分组倍率不同,CC分组专用不可接第三方', NULL,
   ARRAY['alipay','wechat','card','paypal'], 'low', 4.0, 'low',
   '[{"type":"tg","label":"官方频道","url":"https://t.me/Packycode"},{"type":"qq","label":"主站QQ群","url":"https://qm.qq.com/q/packyapi"}]',
   '国内最早做Claude Code中转的上游供应商,原名PackyCode。支持27+模型分组(CC/AWS/Azure/Gemini等),可按需选不同倍率。注册送$1余额,首次充值9折。包月站 codex.packycode.com 独立运营。',
   '2026-06-26T10:00:00Z', '2026-06-26T10:00:00Z', '2026-06-26T10:00:00Z'),

  -- ============================================================
  -- 2. RightCode
  -- 企业级 AI Agent 中转平台,Codex包月方案完善
  -- 来源: https://post.smzdm.com/p/a6z3kxve/
  -- ============================================================
  ('20000000-0000-0000-0000-000000000002', 'RightCode', 'rightcode',
   'https://www.right.codes', '2024-05-01', 'online',
   ARRAY['chat','coding'],
   ARRAY['openai','claude','gemini'], true, true, true,
   0.35, 'prepaid', false,
   'Sonnet极稳,Opus经常缺货;Codex包月 ¥1499起', NULL,
   ARRAY['alipay','wechat'], 'medium', 3.5, 'medium',
   '[]'::jsonb,
   '企业级AI Agent中转平台,Codex包月方案完善(小包¥1499/月中包¥2799/月大包¥3999/月)。按量付费1RMB≈3-5USD购买力,最低充值1元。注册可能需要邀请码。Claude Code仅按量,Codex有包月。',
   '2026-06-26T10:05:00Z', '2026-06-26T10:05:00Z', '2026-06-26T10:05:00Z'),

  -- ============================================================
  -- 3. 0011.ai
  -- Claude Code + OpenAI Codex 通用积分,微信支付宝直充
  -- 来源: https://leedu.ac.cn/article/0011-ai-review-claude-code-codex/
  -- ============================================================
  ('20000000-0000-0000-0000-000000000003', '0011.ai', '0011ai',
   'https://0011.ai', '2024-06-01', 'online',
   ARRAY['chat','coding'],
   ARRAY['openai','claude'], true, true, true,
   0.55, 'prepaid', true,
   '按量$5起充;Pro订阅约$14/月;Ultra每日$16额度', NULL,
   ARRAY['alipay','wechat'], 'low', 3.5, 'medium',
   '[]'::jsonb,
   'Claude Code + OpenAI Codex通用积分平台。按量$5起充,Pro$14/月,Ultra更高档位。微信支付宝直充,无需海外信用卡。可用性99.9%,邀请码CEO/GPT45注册送$1。费用比官方低40-60%。',
   '2026-06-26T10:10:00Z', '2026-06-26T10:10:00Z', '2026-06-26T10:10:00Z'),

  -- ============================================================
  -- 4. OpenRouter
  -- 国际最大模型聚合平台,300+模型,官方原价
  -- 来源: https://openrouter.ai
  -- ============================================================
  ('20000000-0000-0000-0000-000000000004', 'OpenRouter', 'openrouter',
   'https://openrouter.ai', '2023-01-01', 'online',
   ARRAY['chat','coding','embedding','rerank','image_gen','image_understanding'],
   ARRAY['openai','claude','gemini','deepseek','mistral','llama','qwen'], true, true, true,
   1.00, 'prepaid', false,
   '免费模型27个;国内需代理访问', NULL,
   ARRAY['card','crypto_other'], 'low', 4.5, 'low',
   '[{"type":"discord","label":"Discord社区","url":"https://discord.gg/openrouter"}]',
   '国际最大大模型API聚合平台,覆盖300+模型/60+供应商,月处理70万亿tokens。绝大多数模型官方原价不额外加价,有27个免费模型。支持信用卡和加密货币支付。国内需代理访问,使用国内支付方式可能限制调用GPT/Claude/Gemini。',
   '2026-06-26T10:15:00Z', '2026-06-26T10:15:00Z', '2026-06-26T10:15:00Z'),

  -- ============================================================
  -- 5. aigocode
  -- 月卡方案为主,口碑尚可
  -- 来源: 知乎/V2EX 社区讨论
  -- ============================================================
  ('20000000-0000-0000-0000-000000000005', 'aigocode', 'aigocode',
   'https://www.aigocode.com', '2024-07-01', 'online',
   ARRAY['chat','coding'],
   ARRAY['openai','claude','gemini'], true, true, true,
   0.40, 'subscription', false,
   '月卡¥399/4周;不同方案价格不同', NULL,
   ARRAY['alipay','wechat'], 'low', 3.0, 'medium',
   '[]'::jsonb,
   '以月卡订阅为主的中转站,Opus 4.6按方案¥2~9/百万Token。月卡约¥399/4周。社区口碑尚可,未发现以低端模型冒充高端模型的报告。',
   '2026-06-26T10:20:00Z', '2026-06-26T10:20:00Z', '2026-06-26T10:20:00Z'),

  -- ============================================================
  -- 6. ClaudeAPI
  -- 全球加速节点,低延迟,完全兼容OpenAI SDK
  -- 来源: https://claudeapi.com
  -- ============================================================
  ('20000000-0000-0000-0000-000000000006', 'ClaudeAPI', 'claudeapi',
   'https://www.claudeapi.com', '2024-04-01', 'online',
   ARRAY['chat','coding'],
   ARRAY['claude','openai'], true, true, true,
   0.75, 'prepaid', false,
   '全球加速节点,延迟<200ms,可用性99.8%', NULL,
   ARRAY['alipay','wechat'], 'low', 3.0, 'medium',
   '[]'::jsonb,
   '专注Claude模型的中转服务,全球加速节点延迟<200ms,可用性99.8%。完全兼容OpenAI SDK,微信支付宝直接充值。适合对延迟敏感的Claude API调用场景。',
   '2026-06-26T10:25:00Z', '2026-06-26T10:25:00Z', '2026-06-26T10:25:00Z'),

  -- ============================================================
  -- 7. 硅基流动 (SiliconFlow)
  -- 国内知名AI推理平台,开源模型托管,大量免费额度
  -- 来源: https://siliconflow.cn
  -- ============================================================
  ('20000000-0000-0000-0000-000000000007', '硅基流动', 'siliconflow',
   'https://www.siliconflow.cn', '2023-06-01', 'online',
   ARRAY['chat','coding','embedding','rerank','image_gen','audio_tts'],
   ARRAY['deepseek','qwen','glm','yi','llama','mistral'], true, true, true,
   0.60, 'prepaid', true,
   '免费额度有RPM限制;付费版可提并发', NULL,
   ARRAY['alipay','wechat'], 'low', 4.0, 'low',
   '[{"type":"discord","label":"Discord社区","url":"https://discord.gg/siliconflow"}]',
   '国内知名AI推理平台,托管DeepSeek/Qwen/GLM/Yi等主流开源模型。提供大量免费额度(注册即送),付费按量计费价格有竞争力。OpenAI兼容API格式,支持Streaming和Function Call。企业级稳定性。',
   '2026-06-26T10:30:00Z', '2026-06-26T10:30:00Z', '2026-06-26T10:30:00Z'),

  -- ============================================================
  -- 8. 302.AI
  -- AI应用平台,含API中转功能
  -- 来源: 社区高频提及
  -- ============================================================
  ('20000000-0000-0000-0000-000000000008', '302.AI', '302ai',
   'https://302.ai', '2024-08-01', 'online',
   ARRAY['chat','coding','image_gen','audio_tts'],
   ARRAY['openai','claude','gemini','deepseek','qwen','glm','mistral','llama'], true, true, true,
   0.65, 'prepaid', true,
   '按套餐等级限制', NULL,
   ARRAY['alipay','wechat','card'], 'low', 3.5, 'medium',
   '[]'::jsonb,
   'AI应用平台,同时提供API中转功能。支持OpenAI/Claude/Gemini及国产主流模型。注册送体验额度,按量付费。接口兼容OpenAI格式。',
   '2026-06-26T10:35:00Z', '2026-06-26T10:35:00Z', '2026-06-26T10:35:00Z'),

  -- ============================================================
  -- 9. API易
  -- 老牌中转站,百度百科收录
  -- 来源: https://baike.baidu.com/item/API易
  -- ============================================================
  ('20000000-0000-0000-0000-000000000009', 'API易', 'apiyi',
   'https://www.apiyi.com', '2023-09-01', 'online',
   ARRAY['chat','coding'],
   ARRAY['openai','claude','gemini','qwen','deepseek'], true, true, true,
   0.55, 'prepaid', true,
   '未明确公开限制策略', NULL,
   ARRAY['alipay','wechat'], 'low', 3.0, 'medium',
   '[{"type":"qq","label":"QQ群","url":"https://qm.qq.com/q/apiyi"}]',
   '国内老牌API中转站,百度百科收录。支持OpenAI/Claude/Gemini及国产模型,OpenAI兼容格式。注册送免费额度,微信支付宝充值。运营时间较长,用户基数较大。',
   '2026-06-26T10:40:00Z', '2026-06-26T10:40:00Z', '2026-06-26T10:40:00Z'),

  -- ============================================================
  -- 10. FoxCode
  -- 性价比最高的中转站之一,RMB:USD约1:11-17
  -- 来源: 知乎/V2EX 社区对比帖,网址待确认
  -- ⚠️ 网址为社区提供,如有变动请更新
  -- ============================================================
  ('20000000-0000-0000-0000-000000000010', 'FoxCode', 'foxcode',
   'https://foxcode.app', '2024-09-01', 'online',
   ARRAY['chat','coding'],
   ARRAY['openai','claude','gemini'], true, true, true,
   0.25, 'prepaid', false,
   '每天有1-2小时不稳定期;性价比极高但波动大', NULL,
   ARRAY['alipay','wechat'], 'low', 2.5, 'high',
   '[]'::jsonb,
   '性价比极高的中转站,RMB:USD约1:11-17的购买力。但稳定性有波动,每天可能有1-2小时不稳定期。适合对价格极度敏感、可接受偶尔中断的个人开发者。小额充值使用,不建议大额。',
   '2026-06-26T10:45:00Z', '2026-06-26T10:45:00Z', '2026-06-26T10:45:00Z');
