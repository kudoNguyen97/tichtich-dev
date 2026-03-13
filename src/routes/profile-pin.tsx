import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router';
import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ProfileAvatar,
    PinInputDisplay,
    NumericKeypad,
} from '@/components/profile-pin';
import { TichTichButton } from '@/components/common/TichTichButton';
import { cn } from '@/utils/cn';
import { AuthFormLayout } from '@/components/layout/AuthFormLayout';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

const PIN_LENGTH = 4;

export const Route = createFileRoute('/profile-pin')({
    component: ProfilePinPage,
    beforeLoad: () => {
        const { isAuthenticated, selectedProfile } =
            useAuthStore.getState();
        if (!isAuthenticated) throw redirect({ to: '/login' });
        if (!selectedProfile) throw redirect({ to: '/profiles' });
    },
});

function ProfilePinPage() {
    const { t } = useTranslation();
    const [pin, setPin] = useState<string[]>([]);
    const [shakeKey, setShakeKey] = useState(0);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const selectedProfile = useAuthStore((s) => s.selectedProfile);

    const prompt = t('profilePin.enterNewPin');
    const errorMessage = t('profilePin.pinMismatch');

    const resetError = useCallback(() => {
        setError(false);
    }, []);

    useEffect(() => {
        if (pin.length > 0) resetError();
    }, [pin.length, resetError]);

    const handlePinComplete = useCallback(
        (value: string) => {
            if (!selectedProfile) return;

            // If profile has no pinCode yet, accept any PIN (first-time setup scenario)
            if (!selectedProfile.pinCode || value === selectedProfile.pinCode) {
                navigate({ to: '/children', replace: true });
                return;
            }

            setShakeKey((k) => k + 1);
            setError(true);
            setTimeout(() => setPin([]), 400);
        },
        [selectedProfile, navigate]
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

    if (!selectedProfile) return null;

    return (
        <AuthFormLayout>
            <AuthFormLayout.AppBar
                title={t('profilePin.title')}
                backTo="/profiles"
                className={cn(
                    'bg-tichtich-primary-300',
                    'border-x border-profile-pin-frame'
                )}
            />
            <AuthFormLayout.Content
                className={cn(
                    'bg-tichtich-primary-300',
                    'border-x border-profile-pin-frame'
                )}
            >
                <div className="flex flex-1 flex-col items-center px-6 pb-6 pt-8">
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
            </AuthFormLayout.Content>
            <AuthFormLayout.Footer>
                <TichTichButton
                    variant="outline"
                    size="lg"
                    fullWidth
                    isDisabled={pin.length < PIN_LENGTH || error}
                    onPress={() => {
                        if (pin.length === PIN_LENGTH) {
                            handlePinComplete(pin.join(''));
                        }
                    }}
                >
                    {t('profilePin.continue')}
                </TichTichButton>
            </AuthFormLayout.Footer>
        </AuthFormLayout>
    );
}
