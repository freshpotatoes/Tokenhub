/**
 * 免责声明组件
 * 用于 Footer 和详情页底部,内容一致
 */

interface DisclaimerProps {
  /** 是否为紧凑模式(详情页内嵌) */
  compact?: boolean;
}

export default function Disclaimer({ compact = false }: DisclaimerProps) {
  const text =
    '本站仅聚合公开信息,不提供任何 API 销售或代理服务,不对各中转站的真实性、稳定性、合规性负责。信息可能过时,请用户自行判断风险。';

  if (compact) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="text-xs leading-relaxed text-amber-800">
          <span className="font-semibold">⚠ 免责声明:</span> {text}
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 bg-gray-50 px-4 py-6 text-center">
      <p className="mx-auto max-w-2xl text-xs leading-relaxed text-gray-500">
        {text}
      </p>
    </div>
  );
}
