#!/bin/bash
# 批量检测中转站官网可访问性
urls=(
"https://0011.ai|0011.ai"
"https://www.147api.com|147API"
"https://302.ai|302.AI"
"https://www.aigocode.com|aigocode"
"https://www.aihubmix.com|AIHubMix"
"https://www.apiyi.com|API易"
"https://sub.bulita.net|Bulita"
"https://www.chinallmapi.com|ChinaLLM"
"https://www.claudeapi.com|ClaudeAPI"
"https://co.yes.vg|co.yes.vg"
"https://www.dawcode.cn|DawCode"
"https://deepinfra.com|DeepInfra"
"https://platform.deepseek.com|DeepSeek官方"
"https://foxcode.app|FoxCode"
"https://www.ikuncode.com|IKunCode"
"https://www.koalaapi.com|KoalaAPI"
"https://ai.levolink.com|Levolink"
"https://www.luminai.cn|LuminAI"
"https://www.nekocode.cn|NekoCode"
"https://www.nicecode.cc|nicecode"
"https://openrouter.ai|OpenRouter"
"https://www.packyapi.com|PackyAPI"
"https://www.poixe.com|Poixe"
"https://www.poloapi.com|PoloAPI"
"https://replicate.com|Replicate"
"https://www.right.codes|RightCode"
"https://www.sophnet.com|SophNet"
"https://www.tokenmarket.cn|TokenMarket"
"https://www.treerouter.com|TreeRouter"
"https://www.unity2.ai|Unity2.ai"
"https://www.uuapi.cn|UUAPI"
"https://www.weelinking.com|Weelinking"
"https://www.wintoken.cn|WinToken"
"https://www.qiniu.com|七牛云AI"
"https://www.xycai.cn|星道智能"
"https://www.4sapi.com|星链4SAPI"
"https://www.zhihuiapi.cn|智惠API"
"https://open.bigmodel.cn|智谱AI"
"https://console.volcengine.com/ark|火山方舟"
"https://console.bce.baidu.com/qianfan|百度千帆"
"https://www.siliconflow.cn|硅基流动"
"https://www.openclaudecode.cn|米醋API"
"https://www.shiyunapi.com|诗云API"
"https://bailian.aliyun.com|阿里云百炼"
"https://www.feixianapi.com|非线智能API"
)

echo "=== 站点可访问性检测 ==="
online=0; dead=0; redirect=0
for entry in "${urls[@]}"; do
  url="${entry%%|*}"; name="${entry##*|}"
  code=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 --max-time 15 -L "$url" 2>/dev/null)
  if [ "$code" = "200" ] || [ "$code" = "301" ] || [ "$code" = "302" ] || [ "$code" = "307" ] || [ "$code" = "308" ]; then
    echo "  ✅ $name ($url) → $code"
    ((online++))
  elif [ "$code" = "000" ]; then
    echo "  ❌ $name ($url) → 无法连接"
    ((dead++))
  else
    echo "  ⚠️  $name ($url) → $code"
    ((redirect++))
  fi
done
echo "---"
echo "✅ 在线: $online  ❌ 无法连接: $dead  ⚠️ 其他: $redirect  总计: ${#urls[@]}"
