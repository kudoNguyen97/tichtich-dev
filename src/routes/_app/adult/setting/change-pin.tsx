import { useCallback, useEffect, useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from 'react-aria-components';
import { ArrowLeft } from 'lucide-react';

import {
    ProfileAvatar,
    PinInputDisplay,
    NumericKeypad,
} from '@/components/profile-pin';
import { TichTichButton } from '@/components/common/TichTichButton';
import { LoadingTichTich } from '@/components/common/LoadingTichTich';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useUpdateProfilePinCode } from '@/features/profiles/hooks/useProfiles';
import { showError } from '@/lib/toast';
import { cn } from '@/utils/cn';

export const Route = createFileRoute('/_app/adult/setting/change-pin')({
    component: ChangePinPage,
});

const PIN_LENGTH = 4;

function ChangePinPage() {
    const navigate = useNavigate();
    const selectedProfile = useAuthStore((s) => s.selectedProfile);

    const [step, setStep] = useState<1 | 2>(1);
    const [pin, setPin] = useState<string[]>([]);
    const [firstPin, setFirstPin] = useState('');
    const [shakeKey, setShakeKey] = useState(0);
    const [error, setError] = useState(false);

    const { mutateAsync: updateProfilePinCode, isPending: isUpdatingPin } =
        useUpdateProfilePinCode();

    useEffect(() => {
        if (!selectedProfile || selectedProfile.profileType !== 'adult') {
            navigate({ to: '/profiles' });
        }
    }, [selectedProfile, navigate]);

    useEffect(() => {
        if (pin.length > 0) setError(false);
    }, [pin.length]);

    const prompt =
        step === 1 ? 'Nhập mã PIN mới 4 số' : 'Nhập lại mã PIN mới 4 số';

    const handleContinue = useCallback(() => {
        if (pin.length !== PIN_LENGTH || !selectedProfile) return;
        setFirstPin(pin.join(''));
        setPin([]);
        setStep(2);
    }, [pin, selectedProfile]);

    const handleComplete = useCallback(async () => {
        if (pin.length !== PIN_LENGTH || !selectedProfile) return;
        const value = pin.join('');
        if (value !== firstPin) {
            setShakeKey((k) => k + 1);
            setError(true);
            setTimeout(() => setPin([]), 400);
            return;
        }
        try {
            await updateProfilePinCode({
                id: selectedProfile.id,
                pinCode: firstPin,
            });
            navigate({ to: '/adult/setting/change-pin-success' });
        } catch (e) {
            showError(e);
        }
    }, [pin, firstPin, selectedProfile, updateProfilePinCode, navigate]);

    const handleDigit = (digit: string) => {
        if (pin.length >= PIN_LENGTH) return;
        setPin((prev) => [...prev, digit]);
    };

    const handleBackspace = () => {
        setPin((prev) => prev.slice(0, -1));
    };

    if (!selectedProfile || selectedProfile.profileType !== 'adult') {
        return null;
    }

    return (
        <>
            <LoadingTichTich isLoading={isUpdatingPin} />
            <div
                className={cn(
                    'flex min-h-screen flex-col',
                    'bg-tichtich-primary-300 pb-32'
                )}
            >
                <header
                    className={cn(
                        'sticky top-0 z-50 mx-auto grid min-h-14 w-full max-w-[720px]',
                        'grid-cols-[40px_1fr_40px] items-center bg-tichtich-primary-300 px-4',
                        'pt-[max(0px,env(safe-area-inset-top))]'
                    )}
                >
                    <div className="flex items-center justify-start">
                        <Button
                            className="cursor-pointer p-2 -ml-2"
                            onPress={() => navigate({ to: '/adult/settings' })}
                            aria-label="Quay lại"
                        >
                            <ArrowLeft className="size-6 text-tichtich-black" />
                        </Button>
                    </div>
                    <h1 className="truncate text-center font-display text-lg font-bold leading-tight text-tichtich-black">
                        Đổi mã PIN
                    </h1>
                    <div aria-hidden className="w-10" />
                </header>

                <div className="flex flex-1 flex-col items-center px-6 pt-4">
                    <ProfileAvatar
                        profile={selectedProfile}
                        size="lg"
                        showName
                        className="mb-6"
                    />

                    <PinInputDisplay
                        pinLength={PIN_LENGTH}
                        filledCount={pin.length}
                        error={error}
                        prompt={prompt}
                        errorMessage="Mã PIN không khớp. Vui lòng nhập lại."
                        shakeKey={shakeKey}
                        className="mb-8"
                    />

                    <NumericKeypad
                        pinLength={PIN_LENGTH}
                        currentLength={pin.length}
                        onDigit={handleDigit}
                        onBackspace={handleBackspace}
                        className="mb-8"
                    />
                </div>

                <div className="fixed bottom-0 left-0 right-0 z-40 max-w-[720px] mx-auto border-t border-gray-200/80 bg-tichtich-primary-300 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                    {step === 1 ? (
                        <TichTichButton
                            variant="outline"
                            size="lg"
                            fullWidth
                            isDisabled={pin.length < PIN_LENGTH}
                            onPress={handleContinue}
                        >
                            Tiếp tục
                        </TichTichButton>
                    ) : (
                        <TichTichButton
                            variant="primary"
                            size="lg"
                            fullWidth
                            isDisabled={
                                pin.length < PIN_LENGTH || isUpdatingPin
                            }
                            isLoading={isUpdatingPin}
                            className={cn(
                                pin.length < PIN_LENGTH &&
                                    !isUpdatingPin &&
                                    'bg-gray-500 opacity-90 hover:brightness-100'
                            )}
                            onPress={() => void handleComplete()}
                        >
                            Hoàn tất
                        </TichTichButton>
                    )}
                </div>
            </div>
        </>
    );
}
