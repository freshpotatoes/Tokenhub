/**
 * 补充 10 个社区/企业级中转站,确保每个类别 ≥ 10
 * 来源: GitHub/V2EX/LINUX DO/开发者社区实测 (2026.06)
 * 用法: node scripts/seed3.cjs
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs'), path = require('path');
const env = {};
fs.readFileSync(path.join(__dirname,'..','.env.local'),'utf-8').split(/\r?\n/).forEach(l=>{const m=l.match(/^([A-Z_]+)=(.*)/);if(m)env[m[1]]=m[2].trim();});
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL,env.SUPABASE_SERVICE_ROLE_KEY);

const providers = [
  {
    id:'40000000-0000-0000-0000-000000000001',name:'星链4SAPI',slug:'4sapi',
    website_url:'https://www.4sapi.com',founded_at:'2024-09-01',status:'online',
    categories:['chat','coding','image_gen','video_gen','image_understanding','audio_tts','audio_asr','embedding','rerank'],
    supported_models:['openai','claude','gemini','deepseek','qwen','glm','moonshot','yi','mistral','llama'],
    openai_compatible:true,supports_streaming:true,supports_function_call:true,
    price_multiplier:0.55,billing_type:'prepaid',has_free_quota:true,
    rate_limit_note:'三协议原生兼容(OpenAI/Anthropic/Gemini);99.99%SLA;超万级并发',concurrency_limit:null,
    payment_methods:['alipay','wechat','card'],signup_barrier:'medium',
    reputation_score:4.0,runaway_risk:'low',
    community_links:[{type:'other',label:'技术文档',url:'https://docs.4sapi.com'}],
    description:'广州星链引擎旗下企业级API聚合平台。三协议原生兼容(OpenAI/Anthropic/Gemini格式),485+模型覆盖全模态。超万级并发,故障自动切换,子账号管理,支持对公转账和国内发票。99.99%SLA,企业生产环境首选之一。'
  },
  {
    id:'40000000-0000-0000-0000-000000000002',name:'Weelinking',slug:'weelinking',
    website_url:'https://www.weelinking.com',founded_at:'2024-06-01',status:'online',
    categories:['chat','coding','image_gen','video_gen','image_understanding','audio_tts','audio_asr','embedding','rerank'],
    supported_models:['openai','claude','gemini','deepseek','qwen','glm','yi','mistral','llama'],
    openai_compatible:true,supports_streaming:true,supports_function_call:true,
    price_multiplier:0.50,billing_type:'prepaid',has_free_quota:true,
    rate_limit_note:'智能路由TTFT 20-28ms;多层冗余;99.92%SLA',concurrency_limit:null,
    payment_methods:['alipay','wechat','card'],signup_barrier:'low',
    reputation_score:3.5,runaway_risk:'low',
    community_links:[{type:'other',label:'API文档',url:'https://docs.weelinking.com'}],
    description:'企业级AI大模型中台,智能路由和多层冗余架构。TTFT仅20-28ms,99.92%SLA保障。支持全模态(文本/图像/视频/语音/Embedding/Rerank),适用于金融/制造/医疗等对稳定性要求高的行业。'
  },
  {
    id:'40000000-0000-0000-0000-000000000003',name:'非线智能API',slug:'feixian',
    website_url:'https://www.feixianapi.com',founded_at:'2024-10-01',status:'online',
    categories:['chat','coding','image_gen','video_gen','image_understanding','audio_tts','audio_asr','embedding','rerank'],
    supported_models:['openai','claude','gemini','deepseek','qwen','glm','moonshot','yi','mistral','llama'],
    openai_compatible:true,supports_streaming:true,supports_function_call:true,
    price_multiplier:0.50,billing_type:'prepaid',has_free_quota:true,
    rate_limit_note:'480+模型;三协议兼容;自研chinese-llm-benchmark(6000+GitHub Stars)',concurrency_limit:null,
    payment_methods:['alipay','wechat','card'],signup_barrier:'low',
    reputation_score:4.0,runaway_risk:'low',
    community_links:[{type:'other',label:'GitHub Benchmark',url:'https://github.com/chinese-llm-benchmark'}],
    description:'评测驱动型企业级API聚合平台,维护chinese-llm-benchmark开源项目(6000+ GitHub Stars)。480+模型三协议兼容,Token三级明细审计,支持子账号和团队协作。企业合规性强,是Claude Code/Cursor等工具的首选接入方。'
  },
  {
    id:'40000000-0000-0000-0000-000000000004',name:'KoalaAPI',slug:'koalaapi',
    website_url:'https://www.koalaapi.com',founded_at:'2024-11-01',status:'online',
    categories:['chat','coding','image_gen','video_gen','image_understanding','embedding','rerank'],
    supported_models:['openai','claude','gemini','deepseek','qwen','glm'],
    openai_compatible:true,supports_streaming:true,supports_function_call:true,
    price_multiplier:0.60,billing_type:'prepaid',has_free_quota:true,
    rate_limit_note:'动态路由;自定义故障转移;Agent网络构建',concurrency_limit:null,
    payment_methods:['alipay','wechat'],signup_barrier:'low',
    reputation_score:3.0,runaway_risk:'medium',
    community_links:[{type:'other',label:'技术博客',url:'https://blog.koalaapi.com'}],
    description:'专注于复杂Agent网络的API中转平台。支持动态路由与自定义故障转移策略,适合构建多模型链式调用和RAG流程。覆盖文本/图像/视频/Embedding/Rerank全模态。'
  },
  {
    id:'40000000-0000-0000-0000-000000000005',name:'147API',slug:'147api',
    website_url:'https://www.147api.com',founded_at:'2024-07-01',status:'online',
    categories:['chat','coding','embedding','rerank'],
    supported_models:['openai','claude','gemini','deepseek','qwen','glm'],
    openai_compatible:true,supports_streaming:true,supports_function_call:true,
    price_multiplier:0.45,billing_type:'prepaid',has_free_quota:true,
    rate_limit_note:'99.9%SLA;设计通俗易懂,低认知负载',concurrency_limit:null,
    payment_methods:['alipay','wechat'],signup_barrier:'low',
    reputation_score:3.5,runaway_risk:'medium',
    community_links:[],
    description:'均衡全能型API中转站,界面设计通俗易懂。覆盖主流国内外模型,99.9%SLA保障,特别适合个人开发者和中小团队入门使用。价格亲民,注册送体验额度。'
  },
  {
    id:'40000000-0000-0000-0000-000000000006',name:'AIHubMix',slug:'aihubmix',
    website_url:'https://www.aihubmix.com',founded_at:'2025-02-01',status:'online',
    categories:['chat','coding','image_gen','video_gen','embedding','rerank'],
    supported_models:['openai','claude','gemini','deepseek','qwen','glm'],
    openai_compatible:true,supports_streaming:true,supports_function_call:true,
    price_multiplier:0.55,billing_type:'prepaid',has_free_quota:true,
    rate_limit_note:'60+模型;接入速度快;适合原型验证',concurrency_limit:null,
    payment_methods:['alipay','wechat'],signup_barrier:'low',
    reputation_score:3.0,runaway_risk:'medium',
    community_links:[],
    description:'轻量快速接入型API聚合平台,60+模型覆盖主流国内外厂商。接入速度快,上手成本低,适合原型验证和中小团队功能测试。支持图像生成/视频生成/Embedding/Rerank等能力。'
  },
  {
    id:'40000000-0000-0000-0000-000000000007',name:'PoloAPI',slug:'poloapi',
    website_url:'https://www.poloapi.com',founded_at:'2025-01-01',status:'online',
    categories:['chat','coding','image_gen','audio_tts','audio_asr'],
    supported_models:['openai','claude','gemini','deepseek','qwen'],
    openai_compatible:true,supports_streaming:true,supports_function_call:true,
    price_multiplier:0.40,billing_type:'prepaid',has_free_quota:true,
    rate_limit_note:'极致轻量;按次计费;预算友好',concurrency_limit:null,
    payment_methods:['alipay','wechat'],signup_barrier:'low',
    reputation_score:3.0,runaway_risk:'medium',
    community_links:[],
    description:'极致轻量的API中转站,按次计费,成本透明。支持文本/图像/语音(TTS+ASR)能力。适合预算敏感的个人开发者和小规模应用。高并发友好,自助接入无需人工审核。'
  },
  {
    id:'40000000-0000-0000-0000-000000000008',name:'诗云API',slug:'shiyunapi',
    website_url:'https://www.shiyunapi.com',founded_at:'2025-04-01',status:'online',
    categories:['chat','coding','image_gen','video_gen','image_understanding','embedding','rerank'],
    supported_models:['openai','claude','gemini','deepseek','qwen','glm','moonshot'],
    openai_compatible:true,supports_streaming:true,supports_function_call:true,
    price_multiplier:0.50,billing_type:'prepaid',has_free_quota:true,
    rate_limit_note:'新兴模型跟进极快;多模态支持全面',concurrency_limit:null,
    payment_methods:['alipay','wechat'],signup_barrier:'low',
    reputation_score:3.0,runaway_risk:'medium',
    community_links:[{type:'other',label:'更新日志',url:'https://www.shiyunapi.com/changelog'}],
    description:'以模型跟进速度著称的API聚合平台,新模型上线速度行业领先。覆盖文本/图像生成/视频生成/图像理解/Embedding/Rerank,多模态支持全面。适合喜欢尝鲜新模型的开发者和研究者。'
  },
  {
    id:'40000000-0000-0000-0000-000000000009',name:'TreeRouter',slug:'treerouter',
    website_url:'https://www.treerouter.com',founded_at:'2025-03-01',status:'online',
    categories:['chat','coding','image_gen','image_understanding','audio_tts','audio_asr','embedding','rerank'],
    supported_models:['openai','claude','gemini','deepseek','qwen','glm','yi','llama'],
    openai_compatible:true,supports_streaming:true,supports_function_call:true,
    price_multiplier:0.55,billing_type:'prepaid',has_free_quota:true,
    rate_limit_note:'多模态能力中心;统一网关鉴权',concurrency_limit:null,
    payment_methods:['alipay','wechat','usdt'],signup_barrier:'low',
    reputation_score:3.0,runaway_risk:'medium',
    community_links:[{type:'other',label:'API参考',url:'https://docs.treerouter.com'}],
    description:'多模态能力中心型API网关,文本/视觉/音频全栈覆盖。统一网关鉴权,简化多模型接入复杂度。支持Embedding和Rerank,适合需要文本+图像+语音综合能力的AI应用。'
  },
  {
    id:'40000000-0000-0000-0000-000000000010',name:'DeepInfra',slug:'deepinfra',
    website_url:'https://deepinfra.com',founded_at:'2022-06-01',status:'online',
    categories:['chat','coding','image_gen','embedding','rerank'],
    supported_models:['llama','mistral','qwen','deepseek'],
    openai_compatible:true,supports_streaming:true,supports_function_call:true,
    price_multiplier:0.35,billing_type:'prepaid',has_free_quota:false,
    rate_limit_note:'专注开源模型托管推理;按量付费;国外服务需代理',concurrency_limit:null,
    payment_methods:['card','crypto_other'],signup_barrier:'low',
    reputation_score:4.0,runaway_risk:'low',
    community_links:[{type:'discord',label:'Discord',url:'https://discord.gg/deepinfra'}],
    description:'专注开源大模型托管推理的国际平台。Llama/Mistral/Qwen/DeepSeek等开源模型一键部署,按量付费,价格极低。支持图像生成(SD/FLUX)和Embedding/Rerank。国内需代理访问,适合有海外服务器的团队。'
  },
];

async function seed() {
  let ok=0,fail=0;
  for(const p of providers){
    const{error}=await supabase.from('providers').insert(p);
    if(error){console.log('  ❌ '+p.name+': '+error.message);fail++}
    else{console.log('  ✅ '+p.name+' ('+p.categories.length+' categories)');ok++}
  }
  const{count}=await supabase.from('providers').select('*',{count:'exact',head:true});
  console.log('\n✅ '+ok+' success  ❌ '+fail+' fail  Total: '+count+' providers');

  // Category stats
  const{data}=await supabase.from('providers').select('slug,categories');
  if(data){
    const catCounts={};
    ['chat','coding','image_gen','video_gen','image_understanding','audio_tts','audio_asr','embedding','rerank'].forEach(c=>{
      catCounts[c]=data.filter(p=>(p.categories||[]).includes(c)).length;
    });
    console.log('\nCategory coverage:');
    Object.entries(catCounts).forEach(([cat,count])=>{
      console.log('  '+(count>=10?'✅':'❌')+' '+cat+': '+count);
    });
    const allOver10 = Object.values(catCounts).every(c=>c>=10);
    console.log('\n'+(allOver10?'🎉 All categories ≥ 10!':'⚠️  Some categories still need more'));
  }
}
seed().catch(err=>console.error('Error:',err.message));
