import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
// import { useSelectedChildProfile } from '@/hooks/useSelectedChildProfile';
import { useState, useCallback, useMemo } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-aria-components';
import dayjs from 'dayjs';
import { cn } from '@/utils/cn';
import { AllocationChart } from '@/components/children/treasury/AllocationChart';
import { CategorySlider } from '@/components/children/treasury/CategorySlider';
import { KidMissionCarouselSection } from '../../../../components/children/treasury/KidMissionCarouselSection';
import { SpendPreviewChart } from '../../../../components/children/treasury/SpendPreviewChart';
import { TichTichButton } from '@/components/common/TichTichButton';
import { TichTichTextArea } from '@/components/common/TichTichTextArea';
import { TichTichModal } from '@/components/common/TichTichModal';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useMeSettings } from '@/features/auth/hooks/useAuth';
import { useMissionsByProfileIdKid } from '@/features/missions/hooks/useMissions';
import { missionKeys } from '@/features/missions/api/mission.keys';
import { walletKeys } from '@/features/wallets/api/wallet.keys';
import {
    useBatchDeposit,
    useBatchWithdraw,
    useWalletsByProfileId,
} from '@/features/wallets/hooks/useWallets';
import type {
    BatchDepositPayload,
    BatchWithdrawPayload,
    Wallet,
} from '@/features/wallets/types/wallet.type';
import { queryClient } from '@/lib/queryClient';

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

function buildWithdrawPayload({
    selectedCategoryId,
    spendAmount,
    spendReason,
    wallets,
    spendCategories,
}: {
    selectedCategoryId: CategoryId;
    spendAmount: number;
    spendReason: string;
    wallets: Wallet[];
    spendCategories: CategoryItem[];
}): BatchWithdrawPayload | null {
    const walletType = CATEGORY_TO_WALLET_TYPE[selectedCategoryId];
    const selectedWallet = wallets.find(
        (wallet) => wallet.walletType === walletType
    );
    if (!selectedWallet) return null;

    const selectedCategory = spendCategories.find(
        (category) => category.id === selectedCategoryId
    );
    if (!selectedCategory) return null;

    const safeAmount = Math.max(0, toSafeNumber(spendAmount, 0));
    if (safeAmount <= 0) return null;

    return {
        walletUpdates: [{ walletId: selectedWallet.id, amount: safeAmount }],
        type: 'withdraw',
        title: `Rút tiền từ ví ${selectedCategory.label}`,
        description: spendReason.trim(),
    };
}

export const Route = createLazyFileRoute('/_app/children/_layout/treasury')({
    component: RouteComponent,
});

type TreasuryTabKey = 'add' | 'spend';

function RouteComponent() {
    useMeSettings();
    const navigate = useNavigate();
    const selectedProfile = useAuthStore((s) => s.selectedProfile);
    const managedKidProfileId = useAuthStore((s) => s.managedKidProfileId);
    const { data: wallets } = useWalletsByProfileId(managedKidProfileId ?? '');
    const batchDeposit = useBatchDeposit();
    const batchWithdraw = useBatchWithdraw();
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
    const [spendAmountInput, setSpendAmountInput] = useState('0');
    const [selectedSpendCategoryId, setSelectedSpendCategoryId] =
        useState<CategoryId | null>(null);
    const [spendReason, setSpendReason] = useState('');
    const [isTreasureOverviewOpen, setIsTreasureOverviewOpen] = useState(false);

    const allocated = useMemo(
        () =>
            categories.reduce(
                (s, c) => s + Math.max(0, toSafeNumber(c.amount)),
                0
            ),
        [categories]
    );

    const isFullyAllocated = total > 0 && allocated === total;
    const spendAmount = Math.max(0, toSafeNumber(spendAmountInput, 0));
    const spendCategories = useMemo(
        () =>
            DEFAULT_CATEGORIES.map((category) => {
                const walletType = CATEGORY_TO_WALLET_TYPE[category.id];
                const matchedWallet = (wallets ?? []).find(
                    (wallet) => wallet.walletType === walletType
                );
                return {
                    ...category,
                    amount: Math.max(
                        0,
                        toSafeNumber(matchedWallet?.balance, 0)
                    ),
                };
            }),
        [wallets]
    );
    const selectedSpendCategory = useMemo(
        () =>
            spendCategories.find(
                (category) => category.id === selectedSpendCategoryId
            ) ?? null,
        [selectedSpendCategoryId, spendCategories]
    );
    const selectedWalletBalance = Math.max(
        0,
        toSafeNumber(selectedSpendCategory?.amount, 0)
    );
    const isInsufficient =
        !!selectedSpendCategory &&
        spendAmount > 0 &&
        spendAmount > selectedWalletBalance;
    const canSubmitSpend =
        spendAmount > 0 &&
        !!selectedSpendCategory &&
        !isInsufficient &&
        spendReason.trim().length > 0;
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
                onSuccess: async () => {
                    setTotalInput('0');
                    setCategories(DEFAULT_CATEGORIES);
                    setSliderResetKey((k) => k + 1);
                    await queryClient.invalidateQueries({
                        queryKey:
                            walletKeys.listByProfileId(managedKidProfileId),
                    });
                    await queryClient.refetchQueries({
                        queryKey:
                            walletKeys.listByProfileId(managedKidProfileId),
                        type: 'active',
                    });
                    setIsTreasureOverviewOpen(true);
                },
            }
        );
    };
    const handleSpendSubmit = () => {
        if (!canSubmitSpend) return;
        if (!managedKidProfileId || !selectedSpendCategoryId) return;
        const walletList = wallets ?? [];
        if (walletList.length === 0) return;

        const payload = buildWithdrawPayload({
            selectedCategoryId: selectedSpendCategoryId,
            spendAmount,
            spendReason,
            wallets: walletList,
            spendCategories,
        });
        if (!payload) return;

        batchWithdraw.mutate(
            {
                profileId: managedKidProfileId,
                payload,
            },
            {
                onSuccess: () => {
                    setSpendAmountInput('0');
                    setSelectedSpendCategoryId(null);
                    setSpendReason('');
                    queryClient.invalidateQueries({
                        queryKey: missionKeys.listByProfileIdKid(
                            managedKidProfileId,
                            ['in_progress', 'completed']
                        ),
                    });
                },
            }
        );
    };

    const handleCloseTreasureOverview = () => {
        setIsTreasureOverviewOpen(false);
    };

    const handleGoToCharacter = () => {
        setIsTreasureOverviewOpen(false);
        navigate({ to: '/children/character' });
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

                    <TabPanel id="spend" className="flex flex-col gap-4">
                        <div className="bg-tichtich-primary-300 border border-tichtich-primary-200 rounded-2xl p-5 flex flex-col gap-2.5">
                            <label className="text-base font-bold text-tichtich-black">
                                Hôm nay mình chi{' '}
                                <span className="text-tichtich-red">*</span>
                            </label>
                            <div className="bg-white border border-tichtich-primary-200 rounded-xl h-13 flex items-center gap-2 p-3">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={formatMoney(spendAmount)}
                                    onChange={(e) => {
                                        const raw = e.target.value.replace(
                                            /\D/g,
                                            ''
                                        );
                                        setSpendAmountInput(raw || '0');
                                    }}
                                    className="flex-1 border-none outline-none text-base font-bold text-tichtich-black bg-transparent"
                                />
                                <span className="text-sm font-bold text-muted-foreground">
                                    đ
                                </span>
                            </div>
                            {isInsufficient && (
                                <p className="text-sm font-medium text-tichtich-red">
                                    số tiền hiện tại trong ví không đủ
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <div>
                                <p className="text-base font-bold text-tichtich-black mb-0">
                                    Chọn túi tiền đã tiêu{' '}
                                    <span className="text-tichtich-red">*</span>
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {spendCategories.map((category) => {
                                    const isSelected =
                                        selectedSpendCategoryId === category.id;

                                    return (
                                        <button
                                            key={category.id}
                                            type="button"
                                            onClick={() =>
                                                setSelectedSpendCategoryId(
                                                    category.id
                                                )
                                            }
                                            className={cn(
                                                'cursor-pointer border rounded-lg  py-4 transition-all duration-150 active:scale-95 border-tichtich-black',
                                                isSelected
                                                    ? 'bg-tichtich-primary-100'
                                                    : 'bg-tichtich-primary-300'
                                            )}
                                        >
                                            <div className="flex items-center justify-center gap-3">
                                                <img
                                                    src={category.icon}
                                                    alt={category.label}
                                                    className="size-8 object-contain"
                                                />
                                                <span className="text-base font-semibold text-tichtich-black">
                                                    {category.label}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="bg-tichtich-primary-300 border border-tichtich-primary-200 rounded-2xl p-5 flex flex-col gap-4">
                            <p className="text-base font-bold text-tichtich-black mb-0">
                                Xem trước
                            </p>
                            <SpendPreviewChart
                                categories={spendCategories}
                                selectedCategoryId={selectedSpendCategoryId}
                                spendAmount={spendAmount}
                            />
                        </div>

                        <TichTichTextArea
                            label="Bạn chi tiền để làm gì"
                            isRequired
                            value={spendReason}
                            onChange={setSpendReason}
                            placeholder="Mua một cuốn sách yêu thích"
                            maxLength={80}
                            className="flex flex-col gap-2"
                            textAreaClassName="h-24"
                        />

                        <KidMissionCarouselSection missions={displayMissions} />

                        <TichTichButton
                            variant="primary"
                            size="lg"
                            fullWidth
                            className={cn(
                                !canSubmitSpend || batchWithdraw.isPending
                                    ? 'bg-gray-400 hover:brightness-100'
                                    : ''
                            )}
                            isDisabled={
                                !canSubmitSpend || batchWithdraw.isPending
                            }
                            onClick={handleSpendSubmit}
                        >
                            Lưu chi tiêu
                        </TichTichButton>
                    </TabPanel>
                </Tabs>
            </div>
            <TichTichModal
                isOpen={isTreasureOverviewOpen}
                onClose={handleCloseTreasureOverview}
                title="Cập nhật thành công"
                size="xl"
                isDismissable={false}
                footer={
                    <>
                        <TichTichButton
                            variant="outline"
                            size="md"
                            fullWidth
                            onClick={handleCloseTreasureOverview}
                        >
                            Đóng
                        </TichTichButton>
                        <TichTichButton
                            variant="primary"
                            size="md"
                            fullWidth
                            onClick={handleGoToCharacter}
                        >
                            Nhân vật
                        </TichTichButton>
                    </>
                }
            >
                <div className="rounded-xl border border-[#C79244] p-3">
                    <p className="text-base font-semibold text-tichtich-black mb-2">
                        Tổng quan kho báu
                    </p>
                    <SpendPreviewChart
                        categories={spendCategories}
                        selectedCategoryId={null}
                        spendAmount={0}
                    />
                </div>
            </TichTichModal>
        </div>
    );
}
