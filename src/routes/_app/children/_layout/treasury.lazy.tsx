import { createLazyFileRoute } from '@tanstack/react-router';
// import { useSelectedChildProfile } from '@/hooks/useSelectedChildProfile';
import { useState, useCallback, useMemo } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-aria-components';
import dayjs from 'dayjs';
import { cn } from '@/utils/cn';
import { AllocationChart } from '@/components/children/treasury/AllocationChart';
import { CategorySlider } from '@/components/children/treasury/CategorySlider';
import { KidMissionCarouselSection } from '../../../../components/children/treasury/KidMissionCarouselSection';
import { TichTichButton } from '@/components/common/TichTichButton';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useMeSettings } from '@/features/auth/hooks/useAuth';
import { useMissionsByProfileIdKid } from '@/features/missions/hooks/useMissions';
import {
    useBatchDeposit,
    useWalletsByProfileId,
} from '@/features/wallets/hooks/useWallets';
import type {
    BatchDepositPayload,
    Wallet,
} from '@/features/wallets/types/wallet.type';

const formatMoney = (n: any) => n.toLocaleString('vi-VN');
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

function buildDepositPayload(
    categories: CategoryItem[],
    wallets: Wallet[]
): BatchDepositPayload {
    const walletMap = new Map(
        wallets.map((wallet) => [wallet.walletType, wallet.id])
    );

    const walletUpdates = categories
        .map((category) => {
            const walletType = CATEGORY_TO_WALLET_TYPE[category.id];
            const walletId = walletMap.get(walletType);
            const amount = Math.max(0, toSafeNumber(category.amount));
            if (!walletId || amount <= 0) return null;
            return { walletId, amount };
        })
        .filter((item): item is { walletId: string; amount: number } => !!item);

    return {
        walletUpdates,
        type: 'deposit',
        title: 'Thêm tiền vào ví',
        description: 'Thêm tiền vào các ví theo tỷ lệ đã chọn',
    };
}

export const Route = createLazyFileRoute('/_app/children/_layout/treasury')({
    component: RouteComponent,
});

type TreasuryTabKey = 'add' | 'spend';

function RouteComponent() {
    useMeSettings();
    const selectedProfile = useAuthStore((s) => s.selectedProfile);
    const managedKidProfileId = useAuthStore((s) => s.managedKidProfileId);
    const { data: wallets } = useWalletsByProfileId(managedKidProfileId ?? '');
    const batchDeposit = useBatchDeposit();
    const {
        data: missions,
        isLoading: isMissionsLoading,
        isError: isMissionsError,
    } = useMissionsByProfileIdKid(managedKidProfileId ?? '', [
        'in_progress',
        'completed',
    ]);
    const [totalInput, setTotalInput] = useState('0');
    const total = Math.max(0, toSafeNumber(totalInput, 0));
    const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
    const [treasuryTab, setTreasuryTab] = useState<TreasuryTabKey>('add');
    const [sliderResetKey, setSliderResetKey] = useState(0);

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
    }, [managedKidProfileId, isMissionsError, isMissionsLoading, missions]);

    const handleSliderChange = useCallback(
        (id: any, newValue: any) => {
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

    const applyPreset = (ratios: any) => {
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
        const walletList = wallets ?? [];
        if (walletList.length === 0) return;

        const payload = buildDepositPayload(categories, walletList);
        if (payload.walletUpdates.length === 0) return;

        batchDeposit.mutate(
            {
                profileId: managedKidProfileId,
                payload,
            },
            {
                onSuccess: () => {
                    setTotalInput('0');
                    setCategories(DEFAULT_CATEGORIES);
                    setSliderResetKey((k) => k + 1);
                },
            }
        );
    };

    return (
        <div className=" mx-auto  bg-background mb-20">
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

                <Tabs
                    selectedKey={treasuryTab}
                    onSelectionChange={(key) =>
                        setTreasuryTab(key as TreasuryTabKey)
                    }
                    className="flex flex-col gap-4"
                >
                    <TabList
                        aria-label="Chức năng"
                        className="flex min-w-0 gap-2"
                    >
                        {(
                            [
                                {
                                    key: 'add' as const,
                                    label: 'Thêm tiền',
                                    icon: '/icons/add-money.svg',
                                },
                                {
                                    key: 'spend' as const,
                                    label: 'Chi tiền',
                                    icon: '/icons/spend-money.svg',
                                },
                            ] as const
                        ).map(({ key, label, icon }) => {
                            const isSelected = treasuryTab === key;
                            return (
                                <Tab
                                    key={key}
                                    id={key}
                                    className={cn(
                                        'min-w-0 rounded-2xl px-2 py-3 flex flex-col items-center justify-center cursor-pointer outline-none transition-all duration-300 ease-out',
                                        'focus-visible:ring-2 focus-visible:ring-tichtich-primary-200 focus-visible:ring-offset-2',
                                        isSelected
                                            ? 'flex-[2.15] shrink-0 border border-tichtich-black bg-tichtich-primary-300 opacity-100 shadow-sm'
                                            : 'flex-1 shrink-0 border border-[#c9b896] bg-tichtich-primary-300 opacity-[0.7]'
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'relative w-11 h-11 shrink-0 transition-opacity duration-300',
                                            isSelected
                                                ? 'opacity-100'
                                                : 'opacity-50'
                                        )}
                                    >
                                        <img
                                            src={icon}
                                            alt={label}
                                            className="object-contain"
                                        />
                                    </div>
                                    <span
                                        className={cn(
                                            'text-base leading-tight text-center transition-colors duration-300',
                                            isSelected
                                                ? 'font-bold text-tichtich-black'
                                                : 'font-medium text-tichtich-black/45'
                                        )}
                                    >
                                        {label}
                                    </span>
                                </Tab>
                            );
                        })}
                    </TabList>

                    <TabPanel id="add" className="flex flex-col gap-4">
                        <div className="bg-tichtich-primary-300 border border-tichtich-primary-200 rounded-2xl p-5 flex flex-col gap-2.5">
                            <label className="text-sm font-bold text-tichtich-black">
                                Hôm nay mình nhận{' '}
                                <span className="text-tichtich-red">*</span>
                            </label>
                            <div className="bg-white border border-tichtich-primary-200 rounded-xl h-13 flex items-center gap-2 p-3">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={formatMoney(total)}
                                    onChange={(e) => {
                                        const raw = e.target.value.replace(
                                            /\D/g,
                                            ''
                                        );
                                        setTotalInput(raw || '0');
                                        setCategories(DEFAULT_CATEGORIES);
                                    }}
                                    className="flex-1 border-none outline-none text-base font-bold text-tichtich-black bg-transparent"
                                />
                                <span className="text-sm font-bold text-muted-foreground">
                                    đ
                                </span>
                            </div>
                        </div>

                        {/* Split section */}
                        <div className="bg-tichtich-primary-300 border border-tichtich-primary-200 rounded-2xl p-5 flex flex-col gap-4">
                            {/* Header */}
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

                            {/* Distribution visual */}
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
                                                handleSliderChange(c.id, val)
                                            }
                                        />
                                    );
                                })}
                            </div>

                            {/* Presets */}
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

                            {/* Remaining hint */}
                            {/* {!isFullyAllocated && total > 0 && (
                                <p
                                    style={{
                                        fontSize: 12,
                                        color: '#bbb',
                                        textAlign: 'center',
                                        margin: 0,
                                    }}
                                >
                                    Còn {formatMoney(total - allocated)}đ chưa
                                    phân bổ
                                </p>
                            )} */}
                        </div>
                        <KidMissionCarouselSection missions={displayMissions} />

                        <TichTichButton
                            variant="primary"
                            size="lg"
                            fullWidth
                            className={cn(
                                !isFullyAllocated || batchDeposit.isPending
                                    ? 'bg-gray-400 hover:brightness-100'
                                    : ''
                            )}
                            isDisabled={
                                !isFullyAllocated || batchDeposit.isPending
                            }
                            onClick={handleSubmit}
                        >
                            lưu kho báu
                        </TichTichButton>
                    </TabPanel>

                    <TabPanel id="spend">
                        <div
                            style={{
                                backgroundColor: '#FDEBC7',
                                border: '1px solid #EDD9A8',
                                borderRadius: 20,
                                padding: 24,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 12,
                                minHeight: 220,
                            }}
                        >
                            <span style={{ fontSize: 40 }}>🚧</span>
                            <p
                                style={{
                                    fontSize: 15,
                                    fontWeight: 800,
                                    color: '#1a1a1a',
                                    margin: 0,
                                }}
                            >
                                Chức năng chi tiền
                            </p>
                            <p
                                style={{
                                    fontSize: 13,
                                    color: '#aaa',
                                    textAlign: 'center',
                                    maxWidth: 220,
                                    margin: 0,
                                }}
                            >
                                Đang được phát triển, sẽ ra mắt sớm thôi!
                            </p>
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
        </div>
    );
}
