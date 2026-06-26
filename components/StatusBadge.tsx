import { ProviderStatus, STATUS_LABELS } from '@/lib/types';

interface StatusBadgeProps {
  status: ProviderStatus;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

/**
 * 在线状态徽标
 * 🟢 正常运营 | 🟡 状态可疑 | 🔴 已关站
 */
export default function StatusBadge({ status, showLabel = true, size = 'md' }: StatusBadgeProps) {
  const colorMap: Record<ProviderStatus, string> = {
    online:  'bg-status-online',
    suspect: 'bg-status-suspect',
    dead:    'bg-status-dead',
  };

  const pulseMap: Record<ProviderStatus, string> = {
    online:  'animate-pulse-slow',
    suspect: '',
    dead:    '',
  };

  const dotSize = size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5';

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`${dotSize} rounded-full ${colorMap[status]} ${pulseMap[status]}`}
        aria-hidden="true"
      />
      {showLabel && (
        <span className={`${size === 'sm' ? 'text-xs' : 'text-sm'} text-gray-600`}>
          {STATUS_LABELS[status]}
        </span>
      )}
    </span>
  );
}
