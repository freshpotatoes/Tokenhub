/**
 * 补充 15 个 Discord/Telegram 社区推荐的中转站
 * 来源: zzsting88/relayAPI GitHub, V2EX, LINUX DO, helpaio.com, hvoy.ai
 * 用法: node scripts/seed4.cjs
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs'), path = require('path');
const env = {};
fs.readFileSync(path.join(__dirname,'..','.env.local'),'utf-8').split(/\r?\n/).forEach(l=>{const m=l.match(/^([A-Z_]+)=(.*)/);if(m)env[m[1]]=m[2].trim();});
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL,env.SUPABASE_SERVICE_ROLE_KEY);

const providers = [
  {
    id:'50000000-0000-0000-0000-000000000001',name:'Poixe AI',slug:'poixe',
    website_url:'https://www.poixe.com',founded_at:'2024-04-01',status:'online',
    categories:['chat','coding'],
    supported_models:['openai','claude','gemini'],
    openai_compatible:true,supports_streaming:true,supports_function_call:true,
    price_multiplier:0.85,billing_type:'prepaid',has_free_quota:true,
    rate_limit_note:'100%正版渠道;接口质量极高无掺水',concurrency_limit:null,
    payment_methods:['alipay','wechat','card'],signup_barrier:'low',
    reputation_score:4.0,runaway_risk:'low',
    community_links:[{type:'discord',label:'Discord社区',url:'https://discord.gg/poixe'}],
    description:'2024年起运营的精品中转站,100%官方正版渠道,接口质量极高无掺水记录。价格虽略高于市场均价,但稳定性极好,适合对模型真实性有严格要求的开发者和企业用户。Discord社区活跃,客服响应快。'
  },
  {
    id:'50000000-0000-0000-0000-000000000002',name:'NekoCode',slug:'nekocode',
    website_url:'https://www.nekocode.cn',founded_at:'2026-01-01',status:'online',
    categories:['chat','coding'],
    supported_models:['openai','claude','gemini','deepseek'],
    openai_compatible:true,supports_streaming:true,supports_function_call:true,
    price_multiplier:0.45,billing_type:'prepaid',has_free_quota:true,
    rate_limit_note:'2026年新站;界面简洁;接口稳定',concurrency_limit:null,
    payment_methods:['alipay','wechat'],signup_barrier:'low',
    reputation_score:2.5,runaway_risk:'medium',
    community_links:[{type:'tg',label:'Telegram群',url:'https://t.me/nekocode_cn'}],
    description:'2026年新上线的中转站,界面简洁易用,接口稳定性口碑不错。支持OpenAI/Claude/Gemini/DeepSeek主流模型,价格有竞争力。作为新站运营时间短,建议小额测试后再大规模使用。'
  },
  {
    id:'50000000-0000-0000-0000-000000000003',name:'Unity2.ai',slug:'unity2',
    website_url:'https://www.unity2.ai',founded_at:'2024-08-01',status:'online',
    categories:['chat','coding','image_gen'],
    supported_models:['openai','claude','gemini','deepseek'],
    openai_compatible:true,supports_streaming:true,supports_function_call:true,
    price_multiplier:0.55,billing_type:'prepaid',has_free_quota:true,
    rate_limit_note:'套餐体系完整;注册送$2体验金;L站口碑好',concurrency_limit:null,
    payment_methods:['alipay','wechat','usdt'],signup_barrier:'low',
    reputation_score:3.5,runaway_risk:'medium',
    community_links:[{type:'discord',label:'Discord',url:'https://discord.gg/unity2'}],
    description:'套餐体系完整的API中转站,LINUX DO和V2EX社区口碑较好。注册送$2体验金,按量付费和套餐制并存。支持文本对话和GPT图像生成,适合从入门到进阶的各类用户。'
  },
  {
    id:'50000000-0000-0000-0000-000000000004',name:'星道智能',slug:'xingdao',
    website_url:'https://www.xycai.cn',founded_at:'2024-05-01',status:'online',
    categories:['chat','coding','embedding','rerank'],
    supported_models:['openai','claude','gemini','deepseek','qwen','glm'],
    openai_compatible:true,supports_streaming:true,supports_function_call:true,
    price_multiplier:0.40,billing_type:'prepaid',has_free_quota:true,
    rate_limit_note:'正规ICP备案;企业合规;GPT-5.5 2.2折',concurrency_limit:null,
    payment_methods:['alipay','wechat','card'],signup_barrier:'medium',
    reputation_score:3.5,runaway_risk:'low',
    community_links:[{type:'other',label:'企业信息',url:'https://beian.miit.gov.cn/'}],
    description:'拥有正规ICP备案的企业级中转站,合规性在行业内领先。GPT-5.5低至2.2折,价格极具竞争力。支持Embedding和Rerank,适合有合规需求的企业开发团队。正规备案降低了跑路风险。'
  },
  {
    id:'50000000-0000-0000-0000-000000000005',name:'WinToken',slug:'wintoken',
    website_url:'https://www.wintoken.cn',founded_at:'2025-06-01',status:'online',
    categories:['chat','coding','image_gen','embedding'],
    supported_models:['openai','claude','gemini','deepseek','qwen'],
    openai_compatible:true,supports_streaming:true,supports_function_call:true,
    price_multiplier:0.50,billing_type:'prepaid',has_free_quota:true,
    rate_limit_note:'新人福利高达113元免费额度;统一API Key多模型',concurrency_limit:null,
    payment_methods:['alipay','wechat'],signup_barrier:'low',
    reputation_score:3.0,runaway_risk:'medium',
    community_links:[{type:'tg',label:'官方频道',url:'https://t.me/wintoken_cn'}],
    description:'新人福利力度极大的中转站,注册即送高额免费额度(最高113元)。统一API Key调用多模型,支持文本/图像/Embedding。适合初次接触API中转的新用户低成本体验。'
  },
  {
    id:'50000000-0000-0000-0000-000000000006',name:'Lumin AI',slug:'luminai',
    website_url:'https://www.luminai.cn',founded_at:'2025-03-01',status:'online',
    categories:['chat','coding','image_gen','audio_tts'],
    supported_models:['openai','claude','gemini','deepseek','qwen'],
    openai_compatible:true,supports_streaming:true,supports_function_call:true,
    price_multiplier:0.38,billing_type:'prepaid',has_free_quota:true,
    rate_limit_note:'5元起充;极低门槛;性价比路线',concurrency_limit:null,
    payment_methods:['alipay','wechat'],signup_barrier:'low',
    reputation_score:3.0,runaway_risk:'medium',
    community_links:[{type:'tg',label:'Telegram',url:'https://t.me/luminai_cn'}],
    description:'极致性价比路线的中转站,5元起充,适合预算紧张的个人开发者。支持文本/图像生成/语音合成,覆盖常用AI能力。Kiro模型¥2/百万token,在同类产品中价格极低。'
  },
  {
    id:'50000000-0000-0000-0000-000000000007',name:'智惠API',slug:'zhihuiapi',
    website_url:'https://www.zhihuiapi.cn',founded_at:'2026-02-01',status:'online',
    categories:['chat','coding','embedding','rerank'],
    supported_models:['openai','claude','gemini','deepseek','qwen','glm'],
    openai_compatible:true,supports_streaming:true,supports_function_call:true,
    price_multiplier:0.45,billing_type:'prepaid',has_free_quota:true,
    rate_limit_note:'2026年新站;hvoy可领5元兑换码;Opus4.8 ¥8.12/M',concurrency_limit:null,
    payment_methods:['alipay','wechat'],signup_barrier:'low',
    reputation_score:2.5,runaway_risk:'medium',
    community_links:[{type:'tg',label:'Telegram',url:'https://t.me/zhihuiapi'}],
    description:'2026年新上线的中转站,通过hvoy.ai可领5元免费兑换码。支持Embedding和Rerank,价格定位中低端。Opus 4.8约¥8.12/百万token,对新模型跟进速度较快。'
  },
  {
    id:'50000000-0000-0000-0000-000000000008',name:'IKunCode',slug:'ikuncode',
    website_url:'https://www.ikuncode.com',founded_at:'2024-07-01',status:'online',
    categories:['chat','coding'],
    supported_models:['openai','claude','gemini'],
    openai_compatible:true,supports_streaming:true,supports_function_call:true,
    price_multiplier:0.30,billing_type:'prepaid',has_free_quota:false,
    rate_limit_note:'专注编程;GPT-5.5约¥1/M;公开状态监控页',concurrency_limit:null,
    payment_methods:['alipay','wechat'],signup_barrier:'low',
    reputation_score:3.0,runaway_risk:'medium',
    community_links:[{type:'qq',label:'QQ群',url:'https://qm.qq.com/q/ikuncode'}],
    description:'专注编程场景的API中转站,GPT-5.5低至¥1/百万token。有公开状态监控页,透明化运营。QQ群活跃,问题响应快。适合Claude Code/Cursor等AI编程工具接入,性价比极高。'
  },
  {
    id:'50000000-0000-0000-0000-000000000009',name:'UU API',slug:'uuapi',
    website_url:'https://www.uuapi.cn',founded_at:'2024-09-01',status:'online',
    categories:['chat','coding','image_gen'],
    supported_models:['openai','claude','gemini','deepseek'],
    openai_compatible:true,supports_streaming:true,supports_function_call:true,
    price_multiplier:0.55,billing_type:'prepaid',has_free_quota:true,
    rate_limit_note:'支持GPT原生生图;Opus-4.7 ¥11/M',concurrency_limit:null,
    payment_methods:['alipay','wechat','card'],signup_barrier:'low',
    reputation_score:3.0,runaway_risk:'medium',
    community_links:[{type:'tg',label:'Telegram',url:'https://t.me/uuapi_cn'}],
    description:'少数支持GPT原生图像生成(gpt-image)的中转站之一。同时提供标准文本对话API,Opus 4.7约¥11/百万token。支持支付宝/微信/银行卡多种支付方式。'
  },
  {
    id:'50000000-0000-0000-0000-000000000010',name:'米醋API',slug:'micuapi',
    website_url:'https://www.openclaudecode.cn',founded_at:'2024-10-01',status:'online',
    categories:['chat','coding'],
    supported_models:['openai','claude','gemini'],
    openai_compatible:true,supports_streaming:true,supports_function_call:true,
    price_multiplier:0.30,billing_type:'prepaid',has_free_quota:true,
    rate_limit_note:'价格约为头部站一半;模型真实不掺水',concurrency_limit:null,
    payment_methods:['alipay','wechat'],signup_barrier:'low',
    reputation_score:3.0,runaway_risk:'medium',
    community_links:[{type:'tg',label:'Telegram',url:'https://t.me/micuapi'}],
    description:'以性价比著称的中转站,价格约为PackyAPI等头部站的一半。社区反馈模型真实不掺水,Claude Code运行稳定。适合对价格敏感但不希望模型被掉包的开发者。'
  },
  {
    id:'50000000-0000-0000-0000-000000000011',name:'DawCode',slug:'dawcode',
    website_url:'https://www.dawcode.cn',founded_at:'2025-05-01',status:'online',
    categories:['chat','coding'],
    supported_models:['openai','claude','gemini'],
    openai_compatible:true,supports_streaming:true,supports_function_call:true,
    price_multiplier:0.42,billing_type:'prepaid',has_free_quota:true,
    rate_limit_note:'注册送4元额度;每日签到送额度',concurrency_limit:null,
    payment_methods:['alipay','wechat'],signup_barrier:'low',
    reputation_score:2.5,runaway_risk:'medium',
    community_links:[{type:'tg',label:'Telegram群',url:'https://t.me/dawcode'}],
    description:'以签到送额度为特色的中转站,注册即送4元体验金,每日签到可获额外额度。适合轻度使用和长期薅羊毛的用户。运营模式新颖,但体量较小。'
  },
  {
    id:'50000000-0000-0000-0000-000000000012',name:'nicecode',slug:'nicecode',
    website_url:'https://www.nicecode.cc',founded_at:'2024-12-01',status:'online',
    categories:['chat','coding','embedding'],
    supported_models:['openai','claude','gemini','deepseek'],
    openai_compatible:true,supports_streaming:true,supports_function_call:true,
    price_multiplier:0.48,billing_type:'prepaid',has_free_quota:true,
    rate_limit_note:'V2EX/LINUX DO社区用户自荐;稳定运营中',concurrency_limit:null,
    payment_methods:['alipay','wechat'],signup_barrier:'low',
    reputation_score:2.5,runaway_risk:'medium',
    community_links:[{type:'tg',label:'Telegram',url:'https://t.me/nicecode_cc'}],
    description:'来自V2EX和LINUX DO社区用户自荐的中转站。支持OpenAI/Claude/Gemini/DeepSeek主流模型及Embedding。社区驱动运营,用户反馈直接影响服务迭代。'
  },
  {
    id:'50000000-0000-0000-0000-000000000013',name:'co.yes.vg',slug:'coyesvg',
    website_url:'https://co.yes.vg',founded_at:'2024-11-01',status:'online',
    categories:['chat','coding'],
    supported_models:['openai','claude'],
    openai_compatible:true,supports_streaming:true,supports_function_call:true,
    price_multiplier:0.40,billing_type:'subscription',has_free_quota:false,
    rate_limit_note:'包月套餐;适合轻量使用',concurrency_limit:null,
    payment_methods:['alipay','wechat'],signup_barrier:'low',
    reputation_score:2.5,runaway_risk:'medium',
    community_links:[{type:'tg',label:'Telegram',url:'https://t.me/yesvg'}],
    description:'主打包月套餐的轻量中转站,每月固定费用,不受Token波动影响。适合用量稳定、不喜欢按量计费不确定性的开发者。仅支持OpenAI和Claude两大系列。'
  },
  {
    id:'50000000-0000-0000-0000-000000000014',name:'Levolink AI',slug:'levolink',
    website_url:'https://ai.levolink.com',founded_at:'2024-06-01',status:'online',
    categories:['chat','coding','embedding'],
    supported_models:['openai','claude','gemini','deepseek','qwen','glm'],
    openai_compatible:true,supports_streaming:true,supports_function_call:true,
    price_multiplier:0.50,billing_type:'prepaid',has_free_quota:true,
    rate_limit_note:'500+模型;老用户用了一年多;覆盖全面',concurrency_limit:null,
    payment_methods:['alipay','wechat'],signup_barrier:'low',
    reputation_score:3.5,runaway_risk:'medium',
    community_links:[{type:'other',label:'站点首页',url:'https://ai.levolink.com'}],
    description:'社区老用户推荐的综合型中转站,一位开发者用了一年多。500+模型覆盖广泛,从GPT/Claude到国产DeepSeek/Qwen/GLM均有支持。提供Embedding能力,适合需要多模型切换的开发场景。'
  },
  {
    id:'50000000-0000-0000-0000-000000000015',name:'Bulita',slug:'bulita',
    website_url:'https://sub.bulita.net',founded_at:'2025-07-01',status:'online',
    categories:['chat','coding'],
    supported_models:['openai','claude'],
    openai_compatible:true,supports_streaming:true,supports_function_call:true,
    price_multiplier:0.45,billing_type:'prepaid',has_free_quota:true,
    rate_limit_note:'新站;LINUX DO社区反馈靠谱',concurrency_limit:null,
    payment_methods:['alipay','wechat'],signup_barrier:'low',
    reputation_score:2.5,runaway_risk:'medium',
    community_links:[{type:'tg',label:'Telegram',url:'https://t.me/bulita_net'}],
    description:'来自LINUX DO社区推荐的新站,社区用户反馈靠谱。提供OpenAI和Claude两大系列的API中转,注册送体验额度。作为新站运营时间短,建议持续关注社区口碑变化。'
  },
];

async function seed() {
  let ok=0,fail=0;
  for(const p of providers){
    const{error}=await supabase.from('providers').insert(p);
    if(error){console.log('  ❌ '+p.name+': '+error.message);fail++}
    else{console.log('  ✅ '+p.name+' ('+p.categories.join(',')+')');ok++}
  }
  const{count}=await supabase.from('providers').select('*',{count:'exact',head:true});
  console.log('\n✅ '+ok+' success  ❌ '+fail+' fail  Total: '+count+' providers');

  const{data}=await supabase.from('providers').select('slug,categories');
  if(data){
    const catCounts={};
    ['chat','coding','image_gen','video_gen','image_understanding','audio_tts','audio_asr','embedding','rerank'].forEach(c=>{
      catCounts[c]=data.filter(p=>(p.categories||[]).includes(c)).length;
    });
    console.log('\n📊 Final category coverage:');
    Object.entries(catCounts).forEach(([cat,count])=>{
      console.log('  ✅ '+cat+': '+count);
    });
  }
}
seed().catch(err=>console.error('Error:',err.message));
