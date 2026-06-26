/**
 * Supabase 数据填充脚本 (CommonJS)
 * 用法: node scripts/seed.cjs
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 解析 .env.local
const envContent = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf-8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
  const m = line.match(/^([A-Z_]+)=(.*)/);
  if (m) env[m[1]] = m[2].trim();
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.TOKENHUB_SERVICE_KEY;

console.log('URL:', url ? url.slice(0, 40) + '...' : 'MISSING');
console.log('Key:', key ? key.slice(0, 20) + '...' : 'MISSING');

if (!url || !key) {
  console.error('请在 .env.local 中设置 NEXT_PUBLIC_SUPABASE_URL 和 TOKENHUB_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(url, key);

const providers = [
  {id:'20000000-0000-0000-0000-000000000001',name:'PackyAPI',slug:'packyapi',website_url:'https://www.packyapi.com',founded_at:'2024-03-01',status:'online',categories:['chat','coding','embedding'],supported_models:['openai','claude','gemini','qwen','deepseek','glm'],openai_compatible:true,supports_streaming:true,supports_function_call:true,price_multiplier:0.50,billing_type:'prepaid',has_free_quota:true,rate_limit_note:'各分组倍率不同,CC分组专用不可接第三方',concurrency_limit:null,payment_methods:['alipay','wechat','card','paypal'],signup_barrier:'low',reputation_score:4.0,runaway_risk:'low',community_links:[{type:'tg',label:'官方频道',url:'https://t.me/Packycode'},{type:'qq',label:'主站QQ群',url:'https://qm.qq.com/q/packyapi'}],description:'国内最早做Claude Code中转的上游供应商,原名PackyCode。支持27+模型分组(CC/AWS/Azure/Gemini等),可按需选不同倍率。注册送$1余额,首次充值9折。包月站 codex.packycode.com 独立运营。'},
  {id:'20000000-0000-0000-0000-000000000002',name:'RightCode',slug:'rightcode',website_url:'https://www.right.codes',founded_at:'2024-05-01',status:'online',categories:['chat','coding'],supported_models:['openai','claude','gemini'],openai_compatible:true,supports_streaming:true,supports_function_call:true,price_multiplier:0.35,billing_type:'prepaid',has_free_quota:false,rate_limit_note:'Sonnet极稳,Opus经常缺货;Codex包月 ¥1499起',concurrency_limit:null,payment_methods:['alipay','wechat'],signup_barrier:'medium',reputation_score:3.5,runaway_risk:'medium',community_links:[],description:'企业级AI Agent中转平台,Codex包月方案完善(小包¥1499/月中包¥2799/月大包¥3999/月)。按量付费1RMB≈3-5USD购买力,最低充值1元。注册可能需要邀请码。'},
  {id:'20000000-0000-0000-0000-000000000003',name:'0011.ai',slug:'0011ai',website_url:'https://0011.ai',founded_at:'2024-06-01',status:'online',categories:['chat','coding'],supported_models:['openai','claude'],openai_compatible:true,supports_streaming:true,supports_function_call:true,price_multiplier:0.55,billing_type:'prepaid',has_free_quota:true,rate_limit_note:'按量$5起充;Pro订阅约$14/月;Ultra每日$16额度',concurrency_limit:null,payment_methods:['alipay','wechat'],signup_barrier:'low',reputation_score:3.5,runaway_risk:'medium',community_links:[],description:'Claude Code + OpenAI Codex通用积分平台。按量$5起充,Pro$14/月,Ultra更高档位。微信支付宝直充,无需海外信用卡。可用性99.9%,邀请码注册送$1。费用比官方低40-60%。'},
  {id:'20000000-0000-0000-0000-000000000004',name:'OpenRouter',slug:'openrouter',website_url:'https://openrouter.ai',founded_at:'2023-01-01',status:'online',categories:['chat','coding','embedding','rerank','image_gen','image_understanding'],supported_models:['openai','claude','gemini','deepseek','mistral','llama','qwen'],openai_compatible:true,supports_streaming:true,supports_function_call:true,price_multiplier:1.00,billing_type:'prepaid',has_free_quota:false,rate_limit_note:'免费模型27个;国内需代理访问',concurrency_limit:null,payment_methods:['card','crypto_other'],signup_barrier:'low',reputation_score:4.5,runaway_risk:'low',community_links:[{type:'discord',label:'Discord社区',url:'https://discord.gg/openrouter'}],description:'国际最大大模型API聚合平台,覆盖300+模型/60+供应商,月处理70万亿tokens。绝大多数模型官方原价不额外加价,有27个免费模型。支持信用卡和加密货币支付。国内需代理访问。'},
  {id:'20000000-0000-0000-0000-000000000005',name:'aigocode',slug:'aigocode',website_url:'https://www.aigocode.com',founded_at:'2024-07-01',status:'online',categories:['chat','coding'],supported_models:['openai','claude','gemini'],openai_compatible:true,supports_streaming:true,supports_function_call:true,price_multiplier:0.40,billing_type:'subscription',has_free_quota:false,rate_limit_note:'月卡¥399/4周;不同方案价格不同',concurrency_limit:null,payment_methods:['alipay','wechat'],signup_barrier:'low',reputation_score:3.0,runaway_risk:'medium',community_links:[],description:'以月卡订阅为主的中转站,Opus 4.6按方案¥2~9/百万Token。月卡约¥399/4周。社区口碑尚可,未发现以低端模型冒充高端模型的报告。'},
  {id:'20000000-0000-0000-0000-000000000006',name:'ClaudeAPI',slug:'claudeapi',website_url:'https://www.claudeapi.com',founded_at:'2024-04-01',status:'online',categories:['chat','coding'],supported_models:['claude','openai'],openai_compatible:true,supports_streaming:true,supports_function_call:true,price_multiplier:0.75,billing_type:'prepaid',has_free_quota:false,rate_limit_note:'全球加速节点,延迟<200ms,可用性99.8%',concurrency_limit:null,payment_methods:['alipay','wechat'],signup_barrier:'low',reputation_score:3.0,runaway_risk:'medium',community_links:[],description:'专注Claude模型的中转服务,全球加速节点延迟<200ms,可用性99.8%。完全兼容OpenAI SDK,微信支付宝直接充值。适合对延迟敏感的Claude API调用场景。'},
  {id:'20000000-0000-0000-0000-000000000007',name:'硅基流动',slug:'siliconflow',website_url:'https://www.siliconflow.cn',founded_at:'2023-06-01',status:'online',categories:['chat','coding','embedding','rerank','image_gen','audio_tts'],supported_models:['deepseek','qwen','glm','yi','llama','mistral'],openai_compatible:true,supports_streaming:true,supports_function_call:true,price_multiplier:0.60,billing_type:'prepaid',has_free_quota:true,rate_limit_note:'免费额度有RPM限制;付费版可提并发',concurrency_limit:null,payment_methods:['alipay','wechat'],signup_barrier:'low',reputation_score:4.0,runaway_risk:'low',community_links:[{type:'discord',label:'Discord社区',url:'https://discord.gg/siliconflow'}],description:'国内知名AI推理平台,托管DeepSeek/Qwen/GLM/Yi等主流开源模型。提供大量免费额度(注册即送),付费按量计费价格有竞争力。OpenAI兼容API格式,支持Streaming和Function Call。企业级稳定性。'},
  {id:'20000000-0000-0000-0000-000000000008',name:'302.AI',slug:'302ai',website_url:'https://302.ai',founded_at:'2024-08-01',status:'online',categories:['chat','coding','image_gen','audio_tts'],supported_models:['openai','claude','gemini','deepseek','qwen','glm','mistral','llama'],openai_compatible:true,supports_streaming:true,supports_function_call:true,price_multiplier:0.65,billing_type:'prepaid',has_free_quota:true,rate_limit_note:'按套餐等级限制',concurrency_limit:null,payment_methods:['alipay','wechat','card'],signup_barrier:'low',reputation_score:3.5,runaway_risk:'medium',community_links:[],description:'AI应用平台,同时提供API中转功能。支持OpenAI/Claude/Gemini及国产主流模型。注册送体验额度,按量付费。接口兼容OpenAI格式。'},
  {id:'20000000-0000-0000-0000-000000000009',name:'API易',slug:'apiyi',website_url:'https://www.apiyi.com',founded_at:'2023-09-01',status:'online',categories:['chat','coding'],supported_models:['openai','claude','gemini','qwen','deepseek'],openai_compatible:true,supports_streaming:true,supports_function_call:true,price_multiplier:0.55,billing_type:'prepaid',has_free_quota:true,rate_limit_note:'未明确公开限制策略',concurrency_limit:null,payment_methods:['alipay','wechat'],signup_barrier:'low',reputation_score:3.0,runaway_risk:'medium',community_links:[{type:'qq',label:'QQ群',url:'https://qm.qq.com/q/apiyi'}],description:'国内老牌API中转站,百度百科收录。支持OpenAI/Claude/Gemini及国产模型,OpenAI兼容格式。注册送免费额度,微信支付宝充值。运营时间较长,用户基数较大。'},
  {id:'20000000-0000-0000-0000-000000000010',name:'FoxCode',slug:'foxcode',website_url:'https://foxcode.app',founded_at:'2024-09-01',status:'online',categories:['chat','coding'],supported_models:['openai','claude','gemini'],openai_compatible:true,supports_streaming:true,supports_function_call:true,price_multiplier:0.25,billing_type:'prepaid',has_free_quota:false,rate_limit_note:'每天有1-2小时不稳定期;性价比极高但波动大',concurrency_limit:null,payment_methods:['alipay','wechat'],signup_barrier:'low',reputation_score:2.5,runaway_risk:'high',community_links:[],description:'性价比极高的中转站,RMB:USD约1:11-17的购买力。但稳定性有波动,每天可能有1-2小时不稳定期。适合对价格极度敏感、可接受偶尔中断的个人开发者。小额充值使用,不建议大额。'},
];

async function seed() {
  console.log('清空现有数据...');
  const { error: delErr } = await supabase.from('providers').delete().neq('id', '____');
  if (delErr) console.log('  (清空提示:', delErr.message, ')');

  let ok = 0, fail = 0;
  for (const p of providers) {
    const { error } = await supabase.from('providers').insert(p);
    if (error) {
      console.log(`  ❌ ${p.name}: ${error.message}`);
      fail++;
    } else {
      console.log(`  ✅ ${p.name}`);
      ok++;
    }
  }

  const { data, error, count } = await supabase.from('providers').select('*', { count: 'exact' });
  console.log(`\n✅ ${ok} 成功  ❌ ${fail} 失败  总计: ${count ?? data?.length ?? 0} 条`);
  if (data) {
    console.log('\n当前数据:');
    data.forEach(p => console.log(`  ${p.slug} → ${p.name} | ${p.status} | ${p.price_multiplier}x | 信誉${p.reputation_score}`));
  }
}

seed().catch(err => console.error('脚本异常:', err.message));
