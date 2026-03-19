import {
    createFileRoute,
    useNavigate,
    redirect,
    useSearch,
} from '@tanstack/react-router';
import { useState, useCallback, useEffect, useMemo } from 'react';
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
import { showError } from '@/lib/toast';
import { useLoadingStore } from '@/stores/useLoadingStore';
import { useUpdateProfilePinCode } from '@/features/profiles/hooks/useProfiles';

const PIN_LENGTH = 4;

export const Route = createFileRoute('/profile-pin')({
    component: ProfilePinPage,
    beforeLoad: () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) throw redirect({ to: '/login' });
    },
});

function ProfilePinPage() {
    const { t } = useTranslation();
    const [pin, setPin] = useState<string[]>([]);
    const [step, setStep] = useState<1 | 2>(1);
    const [firstPin, setFirstPin] = useState('');
    const [shakeKey, setShakeKey] = useState(0);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const search = useSearch({ from: '/profile-pin' });
    const profiles = useAuthStore((s) => s.profiles);
    const setSelectedProfile = useAuthStore((s) => s.setSelectedProfile);
    const { show: showLoading, hide: hideLoading } = useLoadingStore();

    const { mutateAsync: updateProfilePinCode } = useUpdateProfilePinCode();

    const selectedProfile = useMemo(
        () => profiles.find((p) => p.id === (search as { profileId?: string }).profileId),
        [profiles, search]
    );

    const hasPin =
        !!selectedProfile?.pinCode && selectedProfile.pinCode.length === 4;

    const prompt = hasPin
        ? t('profilePin.enterPin')
        : step === 1
          ? t('profilePin.enterNewPin')
          : t('profilePin.reenterNewPin');

    const errorMessage = hasPin
        ? t('profilePin.invalidPin')
        : t('profilePin.pinMismatch');

    const resetError = useCallback(() => {
        setError(false);
    }, []);

    useEffect(() => {
        if (pin.length > 0) resetError();
    }, [pin.length, resetError]);

    const handlePinComplete = useCallback(
        async (value: string) => {
            if (!selectedProfile) return;

            if (hasPin) {
                if (value === selectedProfile.pinCode) {
                    setSelectedProfile(selectedProfile);
                    const target =
                        selectedProfile.profileType === 'adult'
                            ? '/adult'
                            : '/children';
                    navigate({ to: target, replace: true });
                    return;
                }
                setShakeKey((k) => k + 1);
                setError(true);
                setTimeout(() => setPin([]), 400);
                return;
            }

            if (step === 1) {
                setFirstPin(value);
                setPin([]);
                setStep(2);
                return;
            }

            if (value !== firstPin) {
                setShakeKey((k) => k + 1);
                setError(true);
                setTimeout(() => setPin([]), 400);
                return;
            }

            try {
                showLoading();
                await updateProfilePinCode({
                    id: selectedProfile.id,
                    pinCode: firstPin,
                });
                setSelectedProfile({
                    ...selectedProfile,
                    pinCode: firstPin,
                });
                navigate({ to: '/create-success', replace: true });
            } catch (err) {
                showError(err);
            } finally {
                hideLoading();
            }
        },
        [
            selectedProfile,
            hasPin,
            step,
            firstPin,
            navigate,
            setSelectedProfile,
            showLoading,
            hideLoading,
        ]
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
                className={cn('bg-tichtich-primary-300')}
            />
            <AuthFormLayout.Content className={cn('bg-tichtich-primary-300')}>
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
            <AuthFormLayout.Footer className="bg-tichtich-primary-300">
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
