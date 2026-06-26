import { RunawayRisk, RUNAWAY_RISK_LABELS } from '@/lib/types';

interface RunawayRiskTagProps {
  risk: RunawayRisk;
  size?: 'sm' | 'md';
}

/**
 * 跑路风险标签
 * 🟢 低风险 | 🟡 中风险 | 🔴 高风险
 */
export default function RunawayRiskTag({ risk, size = 'md' }: RunawayRiskTagProps) {
  const colorMap: Record<RunawayRisk, string> = {
    low:    'bg-risk-low/10 text-risk-low ring-risk-low/30',
    medium: 'bg-risk-medium/10 text-risk-medium ring-risk-medium/30',
    high:   'bg-risk-high/10 text-risk-high ring-risk-high/30',
  };

  const iconMap: Record<RunawayRisk, string> = {
    low:    '🛡️',
    medium: '⚠️',
    high:   '🚨',
  };

  const sizeClass = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ring-1 ${colorMap[risk]} ${sizeClass}`}
    >
      <span aria-hidden="true">{iconMap[risk]}</span>
      {RUNAWAY_RISK_LABELS[risk]}
    </span>
  );
}
