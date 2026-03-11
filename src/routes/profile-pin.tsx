import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import {
    ProfilePinHeader,
    ProfileAvatar,
    PinInputDisplay,
    NumericKeypad,
} from '@/components/profile-pin';
import { TichTichButton } from '@/components/common/TichTichButton';
import type { Profile } from '@/features/profiles/types';
import { cn } from '@/utils/cn';
import { AuthFormLayout } from '@/components/layout/AuthFormLayout';

const PIN_LENGTH = 4;

/** Mock profile khi chưa có store; sau có thể dùng useAuthStore().selectedProfile */
const MOCK_PROFILE: Profile = {
    id: '2',
    name: 'Trần Quốc Bảo',
    type: 'boy',
};

export const Route = createFileRoute('/profile-pin')({
    component: ProfilePinPage,
});

type Step = 1 | 2;

function ProfilePinPage() {
    const { t } = useTranslation();
    const [step, setStep] = useState<Step>(1);
    const [firstPin, setFirstPin] = useState('');
    const [pin, setPin] = useState<string[]>([]);
    const [shakeKey, setShakeKey] = useState(0);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const prompt =
        step === 1
            ? t('profilePin.enterNewPin')
            : t('profilePin.reenterNewPin');
    const errorMessage = t('profilePin.pinMismatch');

    const resetError = useCallback(() => {
        setError(false);
    }, []);

    useEffect(() => {
        if (pin.length > 0) resetError();
    }, [pin.length, resetError]);

    const handlePinComplete = useCallback(
        (value: string) => {
            if (step === 1) {
                setFirstPin(value);
                setPin([]);
                setStep(2);
                return;
            }
            if (value === firstPin) {
                setPin([]);
                setFirstPin('');
                setStep(1);
                // TODO: gọi API lưu PIN / verify và navigate
                return;
            }
            setShakeKey((k) => k + 1);
            setError(true);
            setTimeout(() => setPin([]), 400);
        },
        [step, firstPin]
    );

    useEffect(() => {
        if (pin.length === PIN_LENGTH) {
            handlePinComplete(pin.join(''));
        }
    }, [pin, handlePinComplete]);

    function handleDigit(digit: string) {
        if (pin.length >= PIN_LENGTH) return;
        setPin((prev) => [...prev, digit]);
    }

    function handleBackspace() {
        setPin((prev) => prev.slice(0, -1));
    }

    const canContinue = pin.length === PIN_LENGTH && !error;

    const handleContinue = () => {
        navigate({ to: '/children' });
        if (!canContinue) return;
        handlePinComplete(pin.join(''));
    };

    const profile = MOCK_PROFILE;

    return (
        <AuthFormLayout
            className={cn(
                'bg-tichtich-primary-300',
                'border-x border-profile-pin-frame'
            )}
            title={t('profilePin.title')}
            submitButton={
                <TichTichButton
                    variant="outline"
                    size="lg"
                    fullWidth
                    //   isDisabled={!canContinue}
                    onPress={handleContinue}
                >
                    {t('profilePin.continue')}
                </TichTichButton>
            }
        >
            <div className="flex flex-1 flex-col items-center px-6 pb-6 pt-8">
                <ProfileAvatar
                    profile={profile}
                    size="lg"
                    showName
                    className="mb-6"
                />

                <PinInputDisplay
                    pinLength={PIN_LENGTH}
                    filledCount={pin.length}
                    error={error}
                    prompt={prompt}
                    errorMessage={errorMessage}
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
        </AuthFormLayout>
    );
}
