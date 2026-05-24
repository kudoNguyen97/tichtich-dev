import { useEffect, useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from 'react-aria-components';
import { ArrowLeft } from 'lucide-react';
import { AppBar } from '@/components/layout/AppBar';
import { LoadingTichTich } from '@/components/common/LoadingTichTich';
import { MoneyAmountField } from '@/components/common/MoneyAmountField';
import { TichTichButton } from '@/components/common/TichTichButton';
import { KidProfileSummaryCard } from '@/components/adult/reset-profile/KidProfileSummaryCard';
import { ResetWalletInfoCard } from '@/components/adult/reset-profile/ResetWalletInfoCard';
import { ResetWalletAmountSection } from '@/components/adult/reset-profile/ResetWalletAmountSection';
import { ResetWalletConfirmModal } from '@/components/adult/reset-profile/ResetWalletConfirmModal';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import {
    useKidProfileDetail,
    useResetProfile,
} from '@/features/profiles/hooks/useProfiles';
import {
    deriveAmountChange,
    deriveSuggestionPick,
    getResetBalanceSuggestions,
    INITIAL_RESET_AMOUNT_STATE,
} from '@/helpers/adult/reset-profile/resetWalletForm';
import { cn } from '@/utils/cn';

export const Route = createFileRoute('/_app/adult/reset-profile/_layout/')({
    component: ResetWalletFormPage,
    head: () => ({ meta: [{ title: 'Tích Tích - Đặt lại ví' }] }),
});

function ResetWalletFormPage() {
    const navigate = useNavigate();
    const adultProfileId = useAuthStore((s) => s.selectedProfile?.id);
    const kidProfileId = useAuthStore((s) => s.managedKidProfileId);

    const [amountState, setAmountState] = useState(INITIAL_RESET_AMOUNT_STATE);
    const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
        if (!adultProfileId || !kidProfileId) {
            navigate({ to: '/adult/settings', replace: true });
        }
    }, [adultProfileId, kidProfileId, navigate]);

    const { data: kidDetail, isPending: isKidPending } = useKidProfileDetail(
        kidProfileId ?? '',
        adultProfileId ?? ''
    );
    const { mutateAsync: resetProfile, isPending: isResetting } =
        useResetProfile();

    const handleAmountChange = (val: string) => {
        setAmountState(deriveAmountChange(val));
    };

    const pickSuggestion = (amount: number) => {
        setAmountState(deriveSuggestionPick(amount));
    };

    const suggestions = getResetBalanceSuggestions(amountState.typedDigits);

    const handleReset = async () => {
        if (!adultProfileId || !kidProfileId) return;
        try {
            await resetProfile({
                kidId: kidProfileId,
                adultProfileId,
                payload: {
                    initBalance: amountState.currentAmount,
                    adultId: adultProfileId,
                },
            });
            setConfirmOpen(false);
            navigate({
                to: '/adult/reset-profile/success',
                search: {
                    amount: amountState.currentAmount,
                    kidId: kidProfileId,
                },
                replace: true,
            });
        } catch {
            setConfirmOpen(false);
        }
    };

    return (
        <>
            <LoadingTichTich isLoading={isKidPending} />
            <div className={cn('flex min-h-screen flex-col bg-white pb-8')}>
                <AppBar
                    title="Đặt lại ví tiền của con"
                    leftAction={
                        <Button
                            onPress={() =>
                                navigate({ to: '/adult/settings' })
                            }
                            className="cursor-pointer p-2 -ml-2"
                        >
                            <ArrowLeft className="size-6 text-tichtich-black" />
                        </Button>
                    }
                />

                <div className="flex flex-col gap-4 p-4">
                    {kidDetail && <KidProfileSummaryCard profile={kidDetail} />}
                    <ResetWalletInfoCard />
                    <ResetWalletAmountSection
                        label="Thêm số dư ban đầu"
                        description="Nạp tiền vào ví của bé sau khi đặt lại"
                    >
                        <MoneyAmountField
                            label="Số tiền"
                            isRequired
                            value={amountState.amountDisplay}
                            onChange={handleAmountChange}
                            suggestions={
                                amountState.suggestionTagsDismissed
                                    ? []
                                    : suggestions
                            }
                            selectedAmount={amountState.currentAmount}
                            onPickSuggestion={pickSuggestion}
                            placeholder="Nhập số tiền"
                        />
                    </ResetWalletAmountSection>

                    <TichTichButton
                        variant="primary"
                        size="lg"
                        fullWidth
                        isDisabled={amountState.currentAmount < 1}
                        onPress={() => setConfirmOpen(true)}
                    >
                        Đặt lại ví
                    </TichTichButton>
                    <TichTichButton
                        variant="outline"
                        size="lg"
                        fullWidth
                        onPress={() => navigate({ to: '/adult/settings' })}
                    >
                        Quay lại
                    </TichTichButton>
                </div>
            </div>

            <ResetWalletConfirmModal
                isOpen={confirmOpen}
                amount={amountState.currentAmount}
                isLoading={isResetting}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleReset}
            />
        </>
    );
}
