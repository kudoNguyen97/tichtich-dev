import { X } from 'lucide-react';
import { TichTichModal } from '@/components/common/TichTichModal';
import { TichTichButton } from '@/components/common/TichTichButton';
import { cn } from '@/utils/cn';
import type {
    ReportSection,
    MetricUnit,
} from '@/features/finance-reports/types/financeReport.type';
import saveIcon from '@/assets/icons/save.svg';
import candyIcon from '@/assets/icons/candy.svg';
import studyIcon from '@/assets/icons/study.svg';
import charityHeartIcon from '@/assets/icons/charity-heart.svg';

const WALLET_ITEM_CONFIG: Record<string, { bg: string; iconSrc: string }> = {
    saving: { bg: 'bg-tichtich-green/40', iconSrc: saveIcon },
    spending: { bg: 'bg-tichtich-yellow/40', iconSrc: candyIcon },
    education: { bg: 'bg-tichtich-blue/40', iconSrc: studyIcon },
    charity: { bg: 'bg-tichtich-pink/40', iconSrc: charityHeartIcon },
};

function formatMetricValue(value: number, unit: MetricUnit): string {
    if (unit === 'currency') {
        return new Intl.NumberFormat('vi-VN').format(value) + ' đ';
    }
    if (unit === 'percent') {
        return `${value}%`;
    }
    return String(value);
}

export interface SectionDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    section: ReportSection | null;
    iconSrc: string;
    isPending?: boolean;
}

export function SectionDetailModal({
    isOpen,
    onClose,
    section,
    iconSrc,
    isPending = false,
}: SectionDetailModalProps) {
    const hasSecondary = Boolean(section?.metrics.secondaryLabel);

    return (
        <TichTichModal
            isOpen={isOpen}
            onClose={onClose}
            isDismissable
            size="lg"
            title={
                <div className="flex items-center gap-3">
                    <img
                        src={iconSrc}
                        alt=""
                        className="h-10 w-10 object-contain shrink-0"
                    />
                    <span className="flex-1 text-left text-base font-semibold text-tichtich-black">
                        {section?.title ?? ''}
                    </span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-tichtich-black/60 cursor-pointer hover:bg-black/5 transition-colors"
                        aria-label="Đóng"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            }
            footer={
                <TichTichButton
                    variant="primary"
                    size="lg"
                    fullWidth
                    onPress={onClose}
                >
                    Đóng
                </TichTichButton>
            }
        >
            {isPending ? (
                <div className="flex flex-col gap-3">
                    <div className="h-4 w-3/4 rounded bg-black/10 animate-pulse" />
                    <div className="h-4 w-full rounded bg-black/10 animate-pulse" />
                    <div className="h-4 w-2/3 rounded bg-black/10 animate-pulse" />
                </div>
            ) : !section ? (
                <p className="text-sm text-tichtich-black/60 text-center py-2">
                    Không có dữ liệu cho tuần này.
                </p>
            ) : (
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-tichtich-black leading-relaxed">
                        {section.narrative}
                    </p>

                    <div
                        className={cn(
                            'grid gap-3',
                            hasSecondary ? 'grid-cols-2' : 'grid-cols-1'
                        )}
                    >
                        <div className="rounded-lg border border-black/10 bg-profile-boy/40 px-4 py-3">
                            <p className="text-xs text-tichtich-black/60 mb-1">
                                {section.metrics.primaryLabel}
                            </p>
                            <p className="text-base font-semibold text-tichtich-black">
                                {String(section.metrics.primaryValue)}
                            </p>
                        </div>

                        {hasSecondary && (
                            <div className="rounded-lg border border-black/10 bg-profile-boy/40 px-4 py-3">
                                <p className="text-xs text-tichtich-black/60 mb-1">
                                    {section.metrics.secondaryLabel}
                                </p>
                                <p className="text-base font-semibold text-tichtich-black">
                                    {String(section.metrics.secondaryValue)}
                                </p>
                            </div>
                        )}
                    </div>

                    {section.metrics.items.length > 0 && (
                        <ul className="flex flex-col gap-2">
                            {section.metrics.items.map((item) => {
                                const walletConfig =
                                    item.type === 'wallet'
                                        ? WALLET_ITEM_CONFIG[item.tag]
                                        : undefined;

                                if (walletConfig) {
                                    return (
                                        <li
                                            key={item.tag}
                                            className={cn(
                                                'flex items-center gap-3 rounded-lg px-4 py-2',
                                                walletConfig.bg
                                            )}
                                        >
                                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/10">
                                                <img
                                                    src={walletConfig.iconSrc}
                                                    alt=""
                                                    className="h-4 w-4 object-contain"
                                                />
                                            </div>
                                            <span className="flex-1 text-sm text-tichtich-black">
                                                {item.label}
                                            </span>
                                            <span className="text-sm font-semibold text-tichtich-black">
                                                {formatMetricValue(
                                                    item.value,
                                                    item.unit
                                                )}
                                            </span>
                                        </li>
                                    );
                                }

                                return (
                                    <li
                                        key={item.tag}
                                        className="flex items-center justify-between rounded-lg bg-profile-boy/40 px-4 py-2"
                                    >
                                        <span className="text-sm text-tichtich-black/70">
                                            {item.label}
                                        </span>
                                        <span className="text-sm font-semibold text-tichtich-black">
                                            {formatMetricValue(
                                                item.value,
                                                item.unit
                                            )}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}
        </TichTichModal>
    );
}
