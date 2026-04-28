import { useState, useMemo } from 'react';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import dayjs from 'dayjs';
import { AppBar } from '@/components/layout/AppBar';
import { SectionDetailModal } from '@/components/adult/journey/SectionDetailModal';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useCheckFinanceReport } from '@/features/finance-reports/hooks/useFinanceReport';
import type { ReportSections } from '@/features/finance-reports/types/financeReport.type';
import roadImage from '@/assets/images/adult/finance-reports/road.png';
import finalRoadImage from '@/assets/images/adult/finance-reports/final-road.png';
import financeManagementIcon from '@/assets/images/adult/finance-reports/finance-management.png';
import spendingTrendsIcon from '@/assets/images/adult/finance-reports/spending-trends.png';
import achieveGoalsIcon from '@/assets/images/adult/finance-reports/achieve-goals.png';
import sharingAndCharityIcon from '@/assets/images/adult/finance-reports/sharing-and-charity.png';
import progressAndImprovementIcon from '@/assets/images/adult/finance-reports/progress-and-improvement.png';
import parentInteractionIcon from '@/assets/images/adult/finance-reports/parent-interaction.png';

export const Route = createLazyFileRoute(
    '/_app/adult/journey/_layout/finance-report'
)({
    component: FinanceReportPage,
});

function getLastWeekRange(): { fromDate: string; toDate: string } {
    const today = dayjs();
    const day = today.day();
    const daysToLastSat = day === 6 ? 0 : day + 1;
    const end = today.subtract(daysToLastSat, 'day');
    const start = end.subtract(7, 'day');
    return {
        fromDate: start.format('YYYY-MM-DD'),
        toDate: end.format('YYYY-MM-DD'),
    };
}

type SectionKey = keyof ReportSections;

type RoadMilestone = {
    id: string;
    label: string;
    src: string;
    top: string;
    left?: string;
    right?: string;
    sectionKey: SectionKey;
};

const ROAD_MILESTONES: RoadMilestone[] = [
    {
        id: 'personal-finance-management',
        label: 'personal-finance-management',
        src: financeManagementIcon,
        top: '1%',
        left: '-5%',
        sectionKey: 'self_finance_management',
    },
    {
        id: 'spending-trends',
        label: 'spending-trends',
        src: spendingTrendsIcon,
        top: '10%',
        right: '-5%',
        sectionKey: 'spending_trend',
    },
    {
        id: 'perseverance-to-achieve-goals',
        label: 'perseverance-to-achieve-goals',
        src: achieveGoalsIcon,
        top: '27%',
        left: '-5%',
        sectionKey: 'goal_persistence',
    },
    {
        id: 'sharing-and-charity',
        label: 'sharing-and-charity',
        src: sharingAndCharityIcon,
        top: '44%',
        right: '-5%',
        sectionKey: 'charity_sharing',
    },
    {
        id: 'progress-and-improvement',
        label: 'progress-and-improvement',
        src: progressAndImprovementIcon,
        top: '60%',
        left: '-5%',
        sectionKey: 'progress_improvement',
    },
    {
        id: 'parent-interaction',
        label: 'parent-interaction',
        src: parentInteractionIcon,
        top: '75%',
        right: '-5%',
        sectionKey: 'parental_engagement',
    },
];

function FinanceReportPage() {
    const navigate = useNavigate();
    const managedKidProfileId = useAuthStore((s) => s.managedKidProfileId);

    const { fromDate, toDate } = useMemo(() => getLastWeekRange(), []);

    const { data: checkData, isPending: isCheckPending } =
        useCheckFinanceReport(
            {
                profileId: managedKidProfileId ?? '',
                fromDate,
                toDate,
                granularity: 'weekly',
            },
            { enabled: Boolean(managedKidProfileId) }
        );

    const sections = checkData?.dataReport?.payload.sections ?? null;

    const [selectedKey, setSelectedKey] = useState<SectionKey | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const handleMilestoneClick = (sectionKey: SectionKey) => {
        setSelectedKey(sectionKey);
        setIsSheetOpen(true);
    };

    const handleSheetClose = () => {
        setIsSheetOpen(false);
    };

    const selectedSection =
        selectedKey && sections ? sections[selectedKey] : null;

    const selectedIcon = useMemo(
        () =>
            ROAD_MILESTONES.find((m) => m.sectionKey === selectedKey)?.src ??
            '',
        [selectedKey]
    );

    return (
        <>
            <AppBar
                title="Hành trình tiến bộ của con"
                leftAction={
                    <button
                        type="button"
                        onClick={() =>
                            navigate({ to: '/adult/journey/progress' })
                        }
                        className="flex items-center justify-center cursor-pointer hover:bg-orange-50 rounded-full p-1"
                        aria-label="Quay lại"
                    >
                        <ArrowLeft className="size-6 text-tichtich-black" />
                    </button>
                }
                rightAction={null}
                className="bg-tichtich-primary-300"
            />

            <div className="w-full max-w-[720px] mx-auto bg-tichtich-primary-300 h-[calc(100dvh-56px)] overflow-hidden px-2">
                <div className="h-full w-full flex items-center justify-center">
                    <div className="relative w-full max-w-[390px] h-full max-h-[820px] origin-top scale-[0.88] sm:scale-[0.95] md:scale-100">
                        <img
                            src={roadImage}
                            alt="Finance report road"
                            className="absolute inset-0 h-[85%] w-full object-contain select-none pointer-events-none"
                        />

                        {ROAD_MILESTONES.map((milestone) => (
                            <button
                                key={milestone.id}
                                type="button"
                                onClick={() =>
                                    handleMilestoneClick(milestone.sectionKey)
                                }
                                aria-label={milestone.label}
                                className="absolute -translate-y-1/2 rounded-full transition-transform cursor-pointer active:scale-95"
                                style={{
                                    top: milestone.top,
                                    left: milestone.left,
                                    right: milestone.right,
                                }}
                            >
                                <img
                                    src={milestone.src}
                                    alt={milestone.label}
                                    className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
                                />
                            </button>
                        ))}

                        <div className="absolute bottom-[3%] left-1/2 -translate-x-1/2">
                            <img
                                src={finalRoadImage}
                                alt="Finance report finish"
                                className="h-auto w-[180px] sm:w-[210px] object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <SectionDetailModal
                isOpen={isSheetOpen}
                onClose={handleSheetClose}
                section={selectedSection}
                iconSrc={selectedIcon}
                isPending={isCheckPending}
            />
        </>
    );
}
