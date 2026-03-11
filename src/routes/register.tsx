import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
} from 'firebase/auth';
import { Pencil, Eye, EyeOff, User, UserPlus } from 'lucide-react';
import { auth } from '../firebase';
import { AuthFormLayout } from '@/components/layout/AuthFormLayout';
import { TichTichButton } from '@/components/common/TichTichButton';
import { TichTichInput } from '@/components/common/TichTichInput';
import { showError } from '@/lib/toast';
import type { RegisterFormData } from '@/features/auth/types/auth.schema';
import { registerSchema } from '@/features/auth/types/auth.schema';
import { cn } from '@/utils/cn';
import { useLoadingStore } from '@/stores/useLoadingStore';
import { authService } from '@/features/auth/api/auth.service';

export const Route = createFileRoute('/register')({
    component: RegisterPage,
});

const REGISTER_FORM_ID = 'register-form';

function RegisterPage() {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { show, hide } = useLoadingStore();
    const navigate = useNavigate();
    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: '',
            phone: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: RegisterFormData) => {
        console.log('data', data);

        try {
            show();

            const { user } = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );

            const accessToken = await user.getIdToken();

            await Promise.all([
                authService.signUp({
                    method: 'email',
                    provider: 'firebase',
                    idToken: accessToken,
                    fullName: data.fullName,
                    phoneNumber: data.phone || undefined,
                    parentGender: 'male',
                }),
                sendEmailVerification(user),
            ]);

            navigate({
                to: '/verify-account',
                replace: true,
                search: { email: data.email },
            });
        } catch (error) {
            showError(error);
        } finally {
            hide();
        }
    };

    return (
        <AuthFormLayout
            title={t('auth.createParentAccount')}
            backTo="/login"
            submitButton={
                <TichTichButton
                    onClick={handleSubmit(onSubmit)}
                    form={REGISTER_FORM_ID}
                    isDisabled={isSubmitting}
                    isLoading={isSubmitting}
                    variant="primary"
                    size="lg"
                    fullWidth
                    leftIcon={<UserPlus className="size-5" />}
                >
                    {t('auth.continue')}
                </TichTichButton>
            }
        >
            <form
                id={REGISTER_FORM_ID}
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6 px-4 py-6"
            >
                {/* Thông tin cá nhân */}
                <section className="rounded-2xl bg-white p-4 border border-tichtich-black shadow-xl">
                    <h2 className="mb-4 text-xs font-bold text-tichtich-black">
                        {t('auth.personalInfo')}
                    </h2>

                    <div className="mb-4 flex justify-center">
                        <div className="relative">
                            <div
                                className={cn(
                                    'flex size-24 items-center justify-center rounded-full',
                                    'bg-gray-300'
                                )}
                            >
                                <User className="size-12 text-gray-500" />
                            </div>
                            <button
                                type="button"
                                className={cn(
                                    'absolute -bottom-1 -right-1',
                                    'flex size-8 items-center justify-center rounded-full',
                                    'bg-tichtich-primary-200 text-white',
                                    'transition-colors hover:brightness-110'
                                )}
                                aria-label={t('auth.personalInfo')}
                            >
                                <Pencil className="size-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <Controller
                            name="fullName"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TichTichInput
                                    label={t('auth.fullName')}
                                    placeholder={t('auth.fullNamePlaceholder')}
                                    isRequired
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    isInvalid={fieldState.invalid}
                                    errorMessage={
                                        fieldState.error?.message
                                            ? t(fieldState.error.message)
                                            : undefined
                                    }
                                />
                            )}
                        />
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <TichTichInput
                                    label={t('auth.phone')}
                                    placeholder={t('auth.phonePlaceholder')}
                                    type="tel"
                                    value={field.value ?? ''}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                />
                            )}
                        />
                    </div>
                </section>

                {/* Thông tin đăng nhập */}
                <section className="rounded-2xl bg-white p-4 border border-tichtich-black shadow-xl">
                    <h2 className="mb-4 text-xs font-bold text-tichtich-black">
                        {t('auth.loginInfo')}
                    </h2>

                    <div className="flex flex-col gap-4">
                        <Controller
                            name="email"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TichTichInput
                                    label={t('auth.emailAddress')}
                                    placeholder={t('auth.emailPlaceholder')}
                                    type="email"
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    isRequired
                                    isInvalid={fieldState.invalid}
                                    errorMessage={
                                        fieldState.error?.message
                                            ? t(fieldState.error.message)
                                            : undefined
                                    }
                                />
                            )}
                        />
                        <Controller
                            name="password"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TichTichInput
                                    label={t('auth.password')}
                                    placeholder={t('auth.createPassword')}
                                    type={showPassword ? 'text' : 'password'}
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    isRequired
                                    isInvalid={fieldState.invalid}
                                    errorMessage={
                                        fieldState.error?.message
                                            ? t(fieldState.error.message)
                                            : undefined
                                    }
                                    rightAdornment={
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword((p) => !p)
                                            }
                                            className="cursor-pointer border-none bg-transparent p-0"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <EyeOff
                                                    className="size-5 text-tichtich-primary-200"
                                                    aria-hidden
                                                />
                                            ) : (
                                                <Eye
                                                    className="size-5 text-tichtich-primary-200"
                                                    aria-hidden
                                                />
                                            )}
                                        </button>
                                    }
                                />
                            )}
                        />
                        <Controller
                            name="confirmPassword"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TichTichInput
                                    label={t('auth.confirmPassword')}
                                    placeholder={t(
                                        'auth.confirmPasswordPlaceholder'
                                    )}
                                    type={
                                        showConfirmPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    isRequired
                                    isInvalid={fieldState.invalid}
                                    errorMessage={
                                        fieldState.error?.message
                                            ? t(fieldState.error.message)
                                            : undefined
                                    }
                                    rightAdornment={
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    (p) => !p
                                                )
                                            }
                                            className="cursor-pointer border-none bg-transparent p-0"
                                            tabIndex={-1}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff
                                                    className="size-5 text-tichtich-primary-200"
                                                    aria-hidden
                                                />
                                            ) : (
                                                <Eye
                                                    className="size-5 text-tichtich-primary-200"
                                                    aria-hidden
                                                />
                                            )}
                                        </button>
                                    }
                                />
                            )}
                        />
                    </div>
                </section>
            </form>
        </AuthFormLayout>
    );
}
