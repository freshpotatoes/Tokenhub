/**
 * 补充 10 个覆盖非对话类 API 的中转站
 * 用法: node scripts/seed2.cjs
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf-8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
  const m = line.match(/^([A-Z_]+)=(.*)/);
  if (m) env[m[1]] = m[2].trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// 10 个覆盖非对话类 API 的中转站/聚合平台
// 重点填补: video_gen, audio_asr, image_understanding, rerank
const providers = [
  {
    id:'30000000-0000-0000-0000-000000000001', name:'阿里云百炼', slug:'bailian',
    website_url:'https://bailian.aliyun.com', founded_at:'2023-10-01', status:'online',
    categories:['chat','coding','image_gen','video_gen','image_understanding','audio_tts','audio_asr','embedding','rerank'],
    supported_models:['qwen','deepseek','glm','moonshot','yi','llama'],
    openai_compatible:true, supports_streaming:true, supports_function_call:true,
    price_multiplier:0.70, billing_type:'postpaid', has_free_quota:true,
    rate_limit_note:'新用户送百万Token体验;企业级QPS保障', concurrency_limit:null,
    payment_methods:['alipay','wechat','card'], signup_barrier:'medium',
    reputation_score:4.5, runaway_risk:'low',
    community_links:[{type:'other',label:'官方文档',url:'https://help.aliyun.com/product/2719818.html'}],
    description:'阿里云官方AI大模型平台,通义千问全系列+第三方热门模型(DeepSeek/GLM/Kimi/Llama等)。覆盖文本/图像(Qwen-Image)/视频(Wan2.1)/语音(SenseVoice+CosyVoice)/Embedding/Rerank全模态。企业级SLA,后付费按量计费,新用户百万Token免费。'
  },
  {
    id:'30000000-0000-0000-0000-000000000002', name:'火山方舟', slug:'ark',
    website_url:'https://console.volcengine.com/ark', founded_at:'2024-02-01', status:'online',
    categories:['chat','coding','image_gen','video_gen','image_understanding','audio_tts','audio_asr'],
    supported_models:['deepseek','qwen','glm','moonshot','yi'],
    openai_compatible:true, supports_streaming:true, supports_function_call:true,
    price_multiplier:0.60, billing_type:'prepaid', has_free_quota:true,
    rate_limit_note:'豆包系列独有;Seedance视频/Seedream图像独家', concurrency_limit:null,
    payment_methods:['alipay','wechat','card'], signup_barrier:'medium',
    reputation_score:4.0, runaway_risk:'low',
    community_links:[{type:'other',label:'官方文档',url:'https://www.volcengine.com/docs/82379'}],
    description:'字节跳动旗下AI大模型平台,豆包(LLM)/Seedream(图像生成)/Seedance(视频生成)系列独家。同时分发DeepSeek/Qwen/GLM等第三方模型。OpenAI兼容API,注册送体验额度。视频生成和图像生成能力行业领先。'
  },
  {
    id:'30000000-0000-0000-0000-000000000003', name:'智谱AI开放平台', slug:'zhipu',
    website_url:'https://open.bigmodel.cn', founded_at:'2023-03-01', status:'online',
    categories:['chat','coding','image_gen','video_gen','image_understanding','audio_tts','audio_asr','embedding','rerank'],
    supported_models:['glm','qwen','deepseek','yi'],
    openai_compatible:true, supports_streaming:true, supports_function_call:true,
    price_multiplier:0.65, billing_type:'prepaid', has_free_quota:true,
    rate_limit_note:'GLM-4免费额度充足;视频生成按秒计费', concurrency_limit:null,
    payment_methods:['alipay','wechat','card'], signup_barrier:'low',
    reputation_score:4.5, runaway_risk:'low',
    community_links:[{type:'other',label:'官方文档',url:'https://open.bigmodel.cn/dev/api'}],
    description:'智谱AI官方开放平台,GLM-4/ChatGLM全系列+第三方模型。覆盖文本对话/图像生成(CogView)/视频生成(CogVideo)/视觉理解(GLM-4V)/语音/Embedding/Rerank全模态。OpenAI兼容,注册即送大量免费额度。A股上市公司,安全可靠。'
  },
  {
    id:'30000000-0000-0000-0000-000000000004', name:'SophNet', slug:'sophnet',
    website_url:'https://www.sophnet.com', founded_at:'2024-06-01', status:'online',
    categories:['chat','coding','image_gen','audio_asr','embedding','rerank'],
    supported_models:['deepseek','qwen','glm'],
    openai_compatible:true, supports_streaming:true, supports_function_call:true,
    price_multiplier:0.45, billing_type:'prepaid', has_free_quota:true,
    rate_limit_note:'DeepSeek推理速度100+TPS;SDXL图像生成', concurrency_limit:null,
    payment_methods:['alipay','wechat'], signup_barrier:'low',
    reputation_score:3.5, runaway_risk:'medium',
    community_links:[],
    description:'算能科技旗下AI推理平台,主打高性能推理(DeepSeek可达100+TPS)。支持文本对话/SDXL文生图/BGE和M3E向量化/Rerank重排序/语音识别。价格极具竞争力,OpenAI兼容API。适合高吞吐推理场景。'
  },
  {
    id:'30000000-0000-0000-0000-000000000005', name:'TokenMarket', slug:'tokenmarket',
    website_url:'https://www.tokenmarket.cn', founded_at:'2025-09-01', status:'online',
    categories:['chat','coding','image_gen','video_gen','image_understanding','audio_tts','audio_asr','embedding','rerank'],
    supported_models:['openai','claude','gemini','deepseek','qwen','glm','moonshot','yi','llama','mistral'],
    openai_compatible:true, supports_streaming:true, supports_function_call:true,
    price_multiplier:0.55, billing_type:'prepaid', has_free_quota:true,
    rate_limit_note:'聚合60+厂商300+模型;全模态覆盖', concurrency_limit:null,
    payment_methods:['alipay','wechat','usdt'], signup_barrier:'low',
    reputation_score:3.0, runaway_risk:'medium',
    community_links:[{type:'tg',label:'官方频道',url:'https://t.me/tokenmarket_cn'}],
    description:'2025年底上线的全模态API聚合平台,并购整合60+厂商300+模型。覆盖文本/图像/视频/语音/代码/Embedding全类型。OpenAI完全兼容,一个API Key调用所有模型。新站增长迅速,全模态覆盖最完整的新平台之一。'
  },
  {
    id:'30000000-0000-0000-0000-000000000006', name:'ChinaLLM', slug:'chinallm',
    website_url:'https://www.chinallmapi.com', founded_at:'2024-11-01', status:'online',
    categories:['chat','coding','image_gen','audio_tts','audio_asr','embedding','rerank'],
    supported_models:['openai','claude','gemini','deepseek','qwen','glm','moonshot'],
    openai_compatible:true, supports_streaming:true, supports_function_call:true,
    price_multiplier:0.50, billing_type:'prepaid', has_free_quota:true,
    rate_limit_note:'OpenAI完全兼容;ProductHunt收录', concurrency_limit:null,
    payment_methods:['alipay','wechat','card'], signup_barrier:'low',
    reputation_score:3.0, runaway_risk:'medium',
    community_links:[{type:'other',label:'GitHub',url:'https://github.com/Chinallmapi'}],
    description:'ProductHunt收录的OpenAI兼容API网关。一站式转发GPT/Claude/Gemini/DeepSeek/GLM/Qwen等模型。支持Chat/图像(gpt-image-2)/语音(TTS+转录)/Embedding/Rerank。注册送体验额度,社区活跃。'
  },
  {
    id:'30000000-0000-0000-0000-000000000007', name:'七牛云AI', slug:'qiniu-ai',
    website_url:'https://www.qiniu.com', founded_at:'2024-04-01', status:'online',
    categories:['chat','coding','image_gen','video_gen','image_understanding','audio_tts','audio_asr'],
    supported_models:['openai','claude','gemini','deepseek','qwen','glm'],
    openai_compatible:true, supports_streaming:true, supports_function_call:true,
    price_multiplier:0.70, billing_type:'postpaid', has_free_quota:true,
    rate_limit_note:'与存储/CDN/音视频原生集成;媒体链路无缝AI', concurrency_limit:null,
    payment_methods:['alipay','wechat','card'], signup_barrier:'medium',
    reputation_score:4.0, runaway_risk:'low',
    community_links:[{type:'other',label:'官方文档',url:'https://developer.qiniu.com/'}],
    description:'七牛云AI大模型广场,与七牛存储/CDN/音视频服务原生集成。支持Claude/GPT/Gemini/Doubao/DeepSeek/Qwen/GLM等国内外主流模型。媒体处理链路无缝接入AI,适合音视频场景。后付费按量计费。'
  },
  {
    id:'30000000-0000-0000-0000-000000000008', name:'百度千帆', slug:'qianfan',
    website_url:'https://console.bce.baidu.com/qianfan', founded_at:'2023-08-01', status:'online',
    categories:['chat','coding','image_gen','image_understanding','audio_tts','audio_asr','embedding','rerank'],
    supported_models:['ernie','qwen','deepseek','glm','yi'],
    openai_compatible:true, supports_streaming:true, supports_function_call:true,
    price_multiplier:0.75, billing_type:'postpaid', has_free_quota:true,
    rate_limit_note:'文心大模型中文能力最强;政企合规', concurrency_limit:null,
    payment_methods:['alipay','wechat','card'], signup_barrier:'medium',
    reputation_score:4.0, runaway_risk:'low',
    community_links:[{type:'other',label:'官方文档',url:'https://cloud.baidu.com/doc/qianfan.html'}],
    description:'百度智能云AI大模型平台,文心一言(ERNIE)全系列+第三方模型。覆盖文本/图像/语音/Embedding/Rerank,中文理解和生成能力业界领先。政企合规性强,后付费灵活计费。'
  },
  {
    id:'30000000-0000-0000-0000-000000000009', name:'DeepSeek官方API', slug:'deepseek-api',
    website_url:'https://platform.deepseek.com', founded_at:'2023-11-01', status:'online',
    categories:['chat','coding'],
    supported_models:['deepseek'],
    openai_compatible:true, supports_streaming:true, supports_function_call:true,
    price_multiplier:0.30, billing_type:'prepaid', has_free_quota:true,
    rate_limit_note:'官方API,极致低价;注册送500万Token', concurrency_limit:null,
    payment_methods:['alipay','wechat'], signup_barrier:'low',
    reputation_score:5.0, runaway_risk:'low',
    community_links:[{type:'discord',label:'DeepSeek Discord',url:'https://discord.gg/deepseek'}],
    description:'DeepSeek官方API平台,不是中转站但常被用作对比基准。DeepSeek-V3/R1系列推理能力极强,价格仅为GPT-4的1/10。OpenAI完全兼容,注册送500万Token。全球最快增长的AI API之一。'
  },
  {
    id:'30000000-0000-0000-0000-000000000010', name:'Replicate', slug:'replicate',
    website_url:'https://replicate.com', founded_at:'2021-01-01', status:'online',
    categories:['image_gen','video_gen','image_understanding','audio_tts','audio_asr'],
    supported_models:['llama','mistral','other'],
    openai_compatible:false, supports_streaming:false, supports_function_call:false,
    price_multiplier:1.00, billing_type:'prepaid', has_free_quota:false,
    rate_limit_note:'按模型按秒/按张计费;国内需代理访问', concurrency_limit:null,
    payment_methods:['card','paypal'], signup_barrier:'low',
    reputation_score:4.5, runaway_risk:'low',
    community_links:[{type:'discord',label:'Discord社区',url:'https://discord.gg/replicate'}],
    description:'全球最大的开源模型托管平台,数万个社区模型。专注图像生成(SD/FLUX/DALL-E等)/视频生成/图像理解/音频(TTS/ASR)/文本生成。按使用量计费(按秒/按张),冷启动有延迟但模型选择极广。国内需代理。'
  },
];

async function seed() {
  let ok = 0, fail = 0;
  for (const p of providers) {
    const { error } = await supabase.from('providers').insert(p);
    if (error) {
      console.log('  ❌ ' + p.name + ': ' + error.message);
      fail++;
    } else {
      console.log('  ✅ ' + p.name + ' (' + p.categories.length + ' categories)');
      ok++;
    }
  }

  const { count } = await supabase.from('providers').select('*', { count: 'exact', head: true });
  console.log('\n✅ ' + ok + ' 成功  ❌ ' + fail + ' 失败  总计: ' + count + ' 条');

  // 按类别统计
  const { data } = await supabase.from('providers').select('slug,categories');
  if (data) {
    const catCounts = {};
    const allCats = ['chat','coding','image_gen','video_gen','image_understanding','audio_tts','audio_asr','embedding','rerank'];
    allCats.forEach(c => { catCounts[c] = data.filter(p => (p.categories||[]).includes(c)).length; });
    console.log('\n各类别覆盖:');
    Object.entries(catCounts).forEach(([cat, count]) => {
      const emoji = count >= 5 ? '✅' : count >= 3 ? '⚠️' : '❌';
      console.log('  ' + emoji + ' ' + cat + ': ' + count + ' 个');
    });
  }
}

seed().catch(err => console.error('异常:', err.message));
