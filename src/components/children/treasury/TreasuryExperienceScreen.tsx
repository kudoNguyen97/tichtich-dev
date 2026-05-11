import { useCallback, useMemo, useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-aria-components';
import dayjs from 'dayjs';
import { cn } from '@/utils/cn';
import { AllocationChart } from '@/components/children/treasury/AllocationChart';
import { CategorySlider } from '@/components/children/treasury/CategorySlider';
import { KidMissionCarouselSection } from '@/components/children/treasury/KidMissionCarouselSection';
import { SpendPreviewChart } from '@/components/children/treasury/SpendPreviewChart';
import { TichTichButton } from '@/components/common/TichTichButton';
import { TichTichTextArea } from '@/components/common/TichTichTextArea';
import { MoneyAmountField } from '@/components/common/MoneyAmountField';
import type { Mission } from '@/features/missions/types/mission.type';
import type {
    BatchDepositPayload,
    BatchWithdrawPayload,
    Wallet,
} from '@/features/wallets/types/wallet.type';

const formatMoney = (n: number) => n.toLocaleString('vi-VN');

const toSafeNumber = (value: unknown, fallback = 0) => {
    const parsed =
        typeof value === 'number'
            ? value
            : Number(String(value ?? '').replace(/,/g, ''));

    return Number.isFinite(parsed) ? parsed : fallback;
};

const TREASURY_MIN_AMOUNT = 1_000;
const TREASURY_MAX_AMOUNT = 100_000_000;

function getTreasuryAmountSuggestions(
    typedDigits: string,
    maxAmount: number = TREASURY_MAX_AMOUNT
): number[] {
    const n = parseInt(typedDigits, 10);
    if (!n || Number.isNaN(n)) return [];
    return [n * 1_000, n * 10_000].filter(
        (v) => v >= TREASURY_MIN_AMOUNT && v <= maxAmount
    );
}

const CATEGORY_TO_WALLET_TYPE = {
    savings: 'saving',
    learning: 'education',
    charity: 'charity',
    spending: 'spending',
} as const;

export type CategoryId = keyof typeof CATEGORY_TO_WALLET_TYPE;

export type CategoryItem = {
    id: CategoryId;
    label: string;
    icon: string;
    amount: number;
};

export const DEFAULT_CATEGORIES: CategoryItem[] = [
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
];

export function buildDepositPayload(
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

export function mapWalletsToSpendCategories(wallets: Wallet[]): CategoryItem[] {
    return DEFAULT_CATEGORIES.map((category) => {
        const walletType = CATEGORY_TO_WALLET_TYPE[category.id];
        const matchedWallet = wallets.find(
            (wallet) => wallet.walletType === walletType
        );
        return {
            ...category,
            amount: Math.max(0, toSafeNumber(matchedWallet?.balance, 0)),
        };
    });
}

export function buildWithdrawPayload({
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

type TreasuryTabKey = 'add' | 'spend';

type DepositSubmitContext = {
    categories: CategoryItem[];
    walletList: Wallet[];
    resetAddForm: () => void;
};

type SpendSubmitContext = {
    selectedCategoryId: CategoryId;
    spendAmount: number;
    spendReason: string;
    spendCategories: CategoryItem[];
    walletList: Wallet[];
    resetSpendForm: () => void;
};

interface TreasuryExperienceScreenProps {
    profileName?: string;
    wallets?: Wallet[];
    missions?: Mission[];
    isDepositPending?: boolean;
    isSpendPending?: boolean;
    onDepositSubmit: (context: DepositSubmitContext) => void;
    onSpendSubmit: (context: SpendSubmitContext) => void;
}

export function TreasuryExperienceScreen({
    profileName,
    wallets = [],
    missions = [],
    isDepositPending = false,
    isSpendPending = false,
    onDepositSubmit,
    onSpendSubmit,
}: TreasuryExperienceScreenProps) {
    const [totalInput, setTotalInput] = useState('0');
    const total = Math.max(0, toSafeNumber(totalInput, 0));
    const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
    const [treasuryTab, setTreasuryTab] = useState<TreasuryTabKey>('add');
    const [sliderResetKey, setSliderResetKey] = useState(0);
    const [spendAmountInput, setSpendAmountInput] = useState('0');
    const [addSuggestionsDismissed, setAddSuggestionsDismissed] =
        useState(false);
    const [spendSuggestionsDismissed, setSpendSuggestionsDismissed] =
        useState(false);
    const [selectedSpendCategoryId, setSelectedSpendCategoryId] =
        useState<CategoryId | null>(null);
    const [spendReason, setSpendReason] = useState('');

    const spendCategories = useMemo(
        () => mapWalletsToSpendCategories(wallets),
        [wallets]
    );
    const allocated = useMemo(
        () =>
            categories.reduce(
                (sum, category) =>
                    sum + Math.max(0, toSafeNumber(category.amount)),
                0
            ),
        [categories]
    );

    const isFullyAllocated = total > 0 && allocated === total;
    const spendAmount = Math.max(0, toSafeNumber(spendAmountInput, 0));
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

    const resetAddForm = useCallback(() => {
        setTotalInput('0');
        setCategories(DEFAULT_CATEGORIES);
        setSliderResetKey((key) => key + 1);
        setAddSuggestionsDismissed(false);
    }, []);

    const resetSpendForm = useCallback(() => {
        setSpendAmountInput('0');
        setSelectedSpendCategoryId(null);
        setSpendReason('');
        setSpendSuggestionsDismissed(false);
    }, []);

    const handleSliderChange = useCallback(
        (id: CategoryId, newValue: number) => {
            setCategories((prev) => {
                const otherSum = prev.reduce(
                    (sum, category) =>
                        category.id === id
                            ? sum
                            : sum + Math.max(0, toSafeNumber(category.amount)),
                    0
                );
                const maxAllowed = Math.max(0, total - otherSum);
                const clamped = Math.max(
                    0,
                    Math.min(toSafeNumber(newValue, 0), maxAllowed)
                );
                return prev.map((category) =>
                    category.id === id
                        ? { ...category, amount: clamped }
                        : category
                );
            });
        },
        [total]
    );

    const applyPreset = (ratios: number[]) => {
        if (total <= 0) return;
        setCategories((prev) =>
            prev.map((category, index) => ({
                ...category,
                amount: Math.floor(total * (ratios[index] / 100)),
            }))
        );
    };

    const handleSubmit = () => {
        if (!isFullyAllocated || wallets.length === 0) return;
        onDepositSubmit({ categories, walletList: wallets, resetAddForm });
    };

    const handleSpendSubmit = () => {
        if (!canSubmitSpend || !selectedSpendCategoryId || wallets.length === 0)
            return;

        onSpendSubmit({
            selectedCategoryId: selectedSpendCategoryId,
            spendAmount,
            spendReason,
            spendCategories,
            walletList: wallets,
            resetSpendForm,
        });
    };

    return (
        <div className="mx-auto bg-background mb-20">
            <div className="p-4">
                <Tabs
                    selectedKey={treasuryTab}
                    onSelectionChange={(key) =>
                        setTreasuryTab(key as TreasuryTabKey)
                    }
                    className="flex flex-col gap-4"
                >
                    <div className="bg-tichtich-primary-300   rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-base text-muted-foreground">
                                {dayjs().format('DD/MM/YYYY')}
                            </span>
                            <span className="text-base font-bold text-foreground">
                                Hôm nay {profileName} làm gì ?
                            </span>
                        </div>
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
                                            'min-w-0 rounded-lg px-2 py-3 flex flex-col items-center justify-center cursor-pointer outline-none transition-all duration-300 ease-out',
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
                    </div>

                    <TabPanel id="add" className="flex flex-col gap-4">
                        <div className="bg-tichtich-primary-300 rounded-lg p-4 flex flex-col gap-2.5">
                            <MoneyAmountField
                                label="Hôm nay mình nhận"
                                isRequired
                                value={formatMoney(total)}
                                onChange={(val) => {
                                    const raw = val.replace(/\D/g, '');
                                    setTotalInput(raw || '0');
                                    setCategories(DEFAULT_CATEGORIES);
                                    setAddSuggestionsDismissed(false);
                                }}
                                suggestions={
                                    addSuggestionsDismissed
                                        ? []
                                        : getTreasuryAmountSuggestions(
                                              totalInput
                                          )
                                }
                                selectedAmount={total > 0 ? total : undefined}
                                onPickSuggestion={(amount) => {
                                    setTotalInput(String(amount));
                                    setCategories(DEFAULT_CATEGORIES);
                                    setAddSuggestionsDismissed(true);
                                }}
                            />
                        </div>

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
                                {categories.map((category) => {
                                    const safeAmount = Math.max(
                                        0,
                                        toSafeNumber(category.amount)
                                    );
                                    const safeMaxValue = Math.max(
                                        0,
                                        toSafeNumber(
                                            total - allocated + safeAmount
                                        )
                                    );

                                    return (
                                        <CategorySlider
                                            key={category.id}
                                            category={{
                                                id: category.id,
                                                name: category.label,
                                                icon: category.icon,
                                            }}
                                            value={Math.min(
                                                safeAmount,
                                                safeMaxValue
                                            )}
                                            maxValue={safeMaxValue}
                                            totalAmount={total}
                                            onChange={(val) =>
                                                handleSliderChange(
                                                    category.id,
                                                    toSafeNumber(val, 0)
                                                )
                                            }
                                        />
                                    );
                                })}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-4">
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
                                        className="preset-btn cursor-pointer bg-tichtich-primary-300 border border-tichtich-black rounded-lg px-3 py-4 text-center transition-all duration-150 active:scale-95 active:bg-tichtich-primary-400"
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
                        <KidMissionCarouselSection missions={missions} />

                        <TichTichButton
                            variant="primary"
                            size="lg"
                            fullWidth
                            className={cn(
                                !isFullyAllocated || isDepositPending
                                    ? 'bg-gray-400 hover:brightness-100'
                                    : ''
                            )}
                            isDisabled={!isFullyAllocated || isDepositPending}
                            onClick={handleSubmit}
                        >
                            Lưu kho báu
                        </TichTichButton>
                    </TabPanel>

                    <TabPanel id="spend" className="flex flex-col gap-4">
                        <div className="bg-tichtich-primary-300 border border-tichtich-primary-200 rounded-lg p-4 flex flex-col gap-2.5">
                            <MoneyAmountField
                                label="Hôm nay mình chi"
                                isRequired
                                value={formatMoney(spendAmount)}
                                onChange={(val) => {
                                    const raw = val.replace(/\D/g, '');
                                    setSpendAmountInput(raw || '0');
                                    setSpendSuggestionsDismissed(false);
                                }}
                                error={
                                    isInsufficient
                                        ? 'số tiền hiện tại trong ví không đủ'
                                        : undefined
                                }
                                suggestions={
                                    spendSuggestionsDismissed
                                        ? []
                                        : getTreasuryAmountSuggestions(
                                              spendAmountInput,
                                              selectedSpendCategory
                                                  ? selectedWalletBalance
                                                  : TREASURY_MAX_AMOUNT
                                          )
                                }
                                selectedAmount={
                                    spendAmount > 0 ? spendAmount : undefined
                                }
                                onPickSuggestion={(amount) => {
                                    setSpendAmountInput(String(amount));
                                    setSpendSuggestionsDismissed(true);
                                }}
                            />
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
                                                'cursor-pointer border rounded-lg py-4 transition-all duration-150 active:scale-95 border-tichtich-black',
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

                        <div className="bg-tichtich-primary-300 border border-tichtich-primary-200 rounded-lg p-4 flex flex-col gap-4">
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

                        <KidMissionCarouselSection missions={missions} />

                        <TichTichButton
                            variant="primary"
                            size="lg"
                            fullWidth
                            className={cn(
                                !canSubmitSpend || isSpendPending
                                    ? 'bg-gray-400 hover:brightness-100'
                                    : ''
                            )}
                            isDisabled={!canSubmitSpend || isSpendPending}
                            onClick={handleSpendSubmit}
                        >
                            Lưu chi tiêu
                        </TichTichButton>
                    </TabPanel>
                </Tabs>
            </div>
        </div>
    );
}
