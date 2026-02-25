import { RiskLevel } from '@/types';

interface RiskBadgeProps {
    level: RiskLevel;
    size?: 'sm' | 'md' | 'lg';
}

const riskConfig: Record<RiskLevel, { label: string; emoji: string }> = {
    HIGH: { label: '고위험', emoji: '🔴' },
    MEDIUM: { label: '주의', emoji: '🟡' },
    LOW: { label: '저위험', emoji: '🔵' },
    SAFE: { label: '안전', emoji: '🟢' },
};

export default function RiskBadge({ level, size = 'md' }: RiskBadgeProps) {
    const config = riskConfig[level];

    return (
        <span className={`risk-badge ${level.toLowerCase()} ${size}`}>
            {config.emoji} {config.label}
        </span>
    );
}
