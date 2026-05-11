import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Tab, TabList, TabPanel, Tabs } from 'react-aria-components';
import { ArrowLeft } from 'lucide-react';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';
import { AppBar } from '@/components/layout/AppBar';
import { TichTichButton } from '@/components/common/TichTichButton';
import { MoneyAmountField } from '@/components/common/MoneyAmountField';
import { AllocationChart } from '@/components/children/treasury/AllocationChart';
import { CategorySlider } from '@/components/children/treasury/CategorySlider';
import { KidMissionCarouselSection } from '@/components/children/treasury/KidMissionCarouselSection';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useMeSettings } from '@/features/auth/hooks/useAuth';
import { useMissionsByProfileIdKid } from '@/features/missions/hooks/useMissions';
import { useWalletsByProfileId } from '@/features/wallets/hooks/useWallets';
import type { Wallet } from '@/features/wallets/types/wallet.type';
import {
    useGetReceivedTransactions,
    useProcessProfileTransaction,
} from '@/features/profile-transactions/hooks/useProfileTransactions';
import { profileTransactionKeys } from '@/features/profile-transactions/api/profileTransaction.keys';
import { walletKeys } from '@/features/wallets/api/wallet.keys';
import { queryClient } from '@/lib/queryClient';

type SharingNowSearch = {
    share: string;
    index?: string;
};

export const Route = createFileRoute(
    '/_app/children/treasury/_layout/sharing-now'
)({
    validateSearch: (search: Record<string, unknown>): SharingNowSearch => ({
        share: typeof search.share === 'string' ? search.share : '',
        index: typeof search.index === 'string' ? search.index : undefined,
    }),
    component: RouteComponent,
});

const formatMoney = (n: number) => n.toLocaleString('vi-VN');
const toSafeNumber = (value: unknown, fallback = 0) => {
    const parsed =
        typeof value === 'number'
            ? value
            : Number(String(value ?? '').replace(/,/g, ''));
    return Number.isFinite(parsed) ? parsed : fallback;
};

const CATEGORY_TO_WALLET_TYPE = {
    savings: 'saving',
    learning: 'education',
    charity: 'charity',
    spending: 'spending',
} as const;

type CategoryId = keyof typeof CATEGORY_TO_WALLET_TYPE;
type CategoryItem = {
    id: CategoryId;
    label: string;
    icon: string;
    amount: number;
};

const DEFAULT_CATEGORIES = [
    { id: 'savings', label: 'Tiết kiệm', icon: '/icons/save.svg', amount: 0 },
    { id: 'learning', label: 'Học tập', icon: '/icons/study.svg', amount: 0 },
    {
        id: 'charity',
        label: 'Từ thiện',
        icon: '/icons/charity-heart.svg',
        amount: 0,
    },
    {
        id: 'spending',
        label: 'Tiêu vặt',
        icon: '/icons/candy.svg',
        amount: 0,
    },
] as CategoryItem[];

function buildWalletUpdates(
    categories: CategoryItem[],
    wallets: Wallet[]
): { walletId: string; amount: number }[] {
    const walletMap = new Map(
        wallets.map((wallet) => [wallet.walletType, wallet.id])
    );
    return categories
        .map((category) => {
            const walletType = CATEGORY_TO_WALLET_TYPE[category.id];
            const walletId = walletMap.get(walletType);
            const amount = Math.max(0, toSafeNumber(category.amount));
            if (!walletId || amount <= 0) return null;
            return { walletId, amount };
        })
        .filter((item): item is { walletId: string; amount: number } => !!item);
}

function RouteComponent() {
    useMeSettings();
    const navigate = useNavigate();
    const { share } = Route.useSearch();
    const selectedProfile = useAuthStore((s) => s.selectedProfile);
    const managedKidProfileId = useAuthStore((s) => s.managedKidProfileId);

    const { data: wallets } = useWalletsByProfileId(managedKidProfileId ?? '');
    const processTransaction = useProcessProfileTransaction();
    const {
        data: missions,
        isLoading: isMissionsLoading,
        isError: isMissionsError,
    } = useMissionsByProfileIdKid(managedKidProfileId ?? '', [
        'in_progress',
        'completed',
    ]);
    const { data: transactions } = useGetReceivedTransactions(
        managedKidProfileId ?? ''
    );

    const transaction = useMemo(
        () => (transactions ?? []).find((t) => t.id === share) ?? null,
        [transactions, share]
    );
    const lockedAmount = Math.max(0, toSafeNumber(transaction?.amount, 0));

    useEffect(() => {
        if (!share) {
            navigate({ to: '/children', replace: true });
            return;
        }
        if (transactions !== undefined && !transaction) {
            navigate({ to: '/children', replace: true });
        }
    }, [share, transaction, transactions, navigate]);

    const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
    const [sliderResetKey, setSliderResetKey] = useState(0);

    const total = lockedAmount;

    const allocated = useMemo(
        () =>
            categories.reduce(
                (s, c) => s + Math.max(0, toSafeNumber(c.amount)),
                0
            ),
        [categories]
    );
    const isFullyAllocated = total > 0 && allocated === total;

    const displayMissions = useMemo(() => {
        if (!managedKidProfileId || isMissionsLoading || isMissionsError) {
            return [];
        }
        return missions ?? [];
    }, [managedKidProfileId, isMissionsLoading, isMissionsError, missions]);

    const handleSliderChange = useCallback(
        (id: CategoryId, newValue: number) => {
            setCategories((prev) => {
                const otherSum = prev.reduce(
                    (s, c) =>
                        c.id === id
                            ? s
                            : s + Math.max(0, toSafeNumber(c.amount)),
                    0
                );
                const maxAllowed = Math.max(0, total - otherSum);
                const clamped = Math.max(
                    0,
                    Math.min(toSafeNumber(newValue, 0), maxAllowed)
                );
                return prev.map((c) =>
                    c.id === id ? { ...c, amount: clamped } : c
                );
            });
        },
        [total]
    );

    const applyPreset = (ratios: number[]) => {
        if (total <= 0) return;
        setCategories((prev) =>
            prev.map((c, i) => ({
                ...c,
                amount: Math.floor(total * (ratios[i] / 100)),
            }))
        );
    };

    const handleSubmit = () => {
        if (!isFullyAllocated) return;
        if (!managedKidProfileId) return;
        if (lockedAmount <= 0) return;
        if (!share) return;
        const walletList = wallets ?? [];
        if (walletList.length === 0) return;

        const walletUpdates = buildWalletUpdates(categories, walletList);
        if (walletUpdates.length === 0) return;

        processTransaction.mutate(
            {
                profileId: managedKidProfileId,
                payload: { transactionId: share, walletUpdates },
            },
            {
                onSuccess: () => {
                    toast.success('Thêm tiền thành công');
                    setCategories(DEFAULT_CATEGORIES);
                    setSliderResetKey((k) => k + 1);
                    queryClient.invalidateQueries({
                        queryKey:
                            walletKeys.listByProfileId(managedKidProfileId),
                    });
                    queryClient.invalidateQueries({
                        queryKey:
                            profileTransactionKeys.received(
                                managedKidProfileId
                            ),
                    });
                    navigate({ to: '/children' });
                },
            }
        );
    };

    return (
        <>
            <AppBar
                title="Thêm tiền vào ví"
                leftAction={
                    <Button
                        onPress={() => navigate({ to: '/children' })}
                        className="-ml-2 cursor-pointer p-2 outline-none"
                    >
                        <ArrowLeft className="size-6 text-tichtich-black" />
                    </Button>
                }
                className="bg-tichtich-primary-300 border-b border-gray-200"
            />
            <div className="mx-auto bg-background mb-8">
                <div className="p-4">
                    {/* ── Top bar ── */}
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-base text-muted-foreground">
                            {dayjs().format('DD/MM/YYYY')}
                        </span>
                        <span className="text-base font-bold text-foreground">
                            Hôm nay {selectedProfile?.fullName} làm gì ?
                        </span>
                    </div>

                    <Tabs selectedKey="add" className="flex flex-col gap-4">
                        <TabList
                            aria-label="Chức năng"
                            className="flex min-w-0 gap-2"
                        >
                            <Tab
                                id="add"
                                className={cn(
                                    'min-w-0 rounded-2xl px-2 py-3 flex flex-col items-center justify-center outline-none transition-all duration-300 ease-out cursor-pointer',
                                    'focus-visible:ring-2 focus-visible:ring-tichtich-primary-200 focus-visible:ring-offset-2',
                                    'flex-[2.15] shrink-0 border border-tichtich-black bg-tichtich-primary-300 opacity-100 shadow-sm'
                                )}
                            >
                                <div className="relative w-11 h-11 shrink-0 opacity-100">
                                    <img
                                        src="/icons/add-money.svg"
                                        alt="Thêm tiền"
                                        className="object-contain"
                                    />
                                </div>
                                <span className="text-base leading-tight text-center font-bold text-tichtich-black">
                                    Thêm tiền
                                </span>
                            </Tab>
                            <Tab
                                id="spend"
                                isDisabled
                                className={cn(
                                    'min-w-0 rounded-2xl px-2 py-3 flex flex-col items-center justify-center outline-none transition-all duration-300 ease-out cursor-not-allowed',
                                    'focus-visible:ring-2 focus-visible:ring-tichtich-primary-200 focus-visible:ring-offset-2',
                                    'flex-1 shrink-0 border border-[#c9b896] bg-tichtich-primary-300 opacity-50'
                                )}
                            >
                                <div className="relative w-11 h-11 shrink-0 opacity-50">
                                    <img
                                        src="/icons/spend-money.svg"
                                        alt="Chi tiền"
                                        className="object-contain"
                                    />
                                </div>
                                <span className="text-base leading-tight text-center font-medium text-tichtich-black/45">
                                    Chi tiền
                                </span>
                            </Tab>
                        </TabList>

                        <TabPanel id="add" className="flex flex-col gap-4">
                            <div className="bg-tichtich-primary-300 rounded-lg p-4 flex flex-col gap-2.5">
                                <MoneyAmountField
                                    label="Hôm nay mình nhận"
                                    isRequired
                                    isDisabled
                                    value={formatMoney(lockedAmount)}
                                    onChange={() => {}}
                                    suggestions={[]}
                                />
                            </div>

                            {/* Split section */}
                            <div className="bg-tichtich-primary-300 rounded-lg p-4 flex flex-col gap-4">
                                <div>
                                    <p className="text-base font-bold text-tichtich-black mb-0">
                                        Cùng chia tiền nào
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1 mb-0">
                                        Đã chia:{' '}
                                        <span
                                            className={cn(
                                                'text-tichtich-red font-bold',
                                                allocated === total &&
                                                    'text-green-500'
                                            )}
                                        >
                                            {formatMoney(allocated)}
                                        </span>
                                        /{formatMoney(total)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-tichtich-black mb-0">
                                        Danh mục đang phân bổ
                                    </p>
                                    <AllocationChart
                                        categories={categories}
                                        total={total}
                                    />
                                </div>

                                <div
                                    key={sliderResetKey}
                                    className="flex flex-col gap-4"
                                >
                                    {categories.map((c) => {
                                        const safeAmount = Math.max(
                                            0,
                                            toSafeNumber(c.amount)
                                        );
                                        const safeMaxValue = Math.max(
                                            0,
                                            toSafeNumber(
                                                total - allocated + safeAmount
                                            )
                                        );

                                        return (
                                            <CategorySlider
                                                key={c.id}
                                                category={{
                                                    id: c.id,
                                                    name: c.label,
                                                    icon: c.icon,
                                                }}
                                                value={Math.min(
                                                    safeAmount,
                                                    safeMaxValue
                                                )}
                                                maxValue={safeMaxValue}
                                                totalAmount={total}
                                                onChange={(val) =>
                                                    handleSliderChange(
                                                        c.id,
                                                        val
                                                    )
                                                }
                                            />
                                        );
                                    })}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        {
                                            label: '40-30-20-10',
                                            sub: 'T.Kiệm · H.Tập · T.Thiện · T.Vặt',
                                            ratios: [40, 30, 20, 10],
                                        },
                                        {
                                            label: 'Chia đều',
                                            sub: 'Mỗi túi một phần bằng nhau',
                                            ratios: [25, 25, 25, 25],
                                        },
                                    ].map(({ label, sub, ratios }) => (
                                        <button
                                            key={label}
                                            type="button"
                                            onClick={() => applyPreset(ratios)}
                                            className="preset-btn cursor-pointer bg-tichtich-primary-300 border border-tichtich-black rounded-[18px] px-3 py-4 text-center transition-all duration-150 active:scale-95 active:bg-tichtich-primary-400"
                                        >
                                            <p className="text-base font-semibold text-tichtich-black">
                                                {label}
                                            </p>
                                            <p className="text-xs text-muted-foreground font-medium mt-1 whitespace-nowrap">
                                                {sub}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <KidMissionCarouselSection
                                missions={displayMissions}
                            />

                            <TichTichButton
                                variant="primary"
                                size="lg"
                                fullWidth
                                className={cn(
                                    !isFullyAllocated ||
                                        processTransaction.isPending
                                        ? 'bg-gray-400 hover:brightness-100'
                                        : ''
                                )}
                                isDisabled={
                                    !isFullyAllocated ||
                                    processTransaction.isPending ||
                                    lockedAmount <= 0
                                }
                                onClick={handleSubmit}
                            >
                                Lưu kho báu
                            </TichTichButton>
                        </TabPanel>

                        <TabPanel id="spend" />
                    </Tabs>
                </div>
            </div>
        </>
    );
}
