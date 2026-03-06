import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { Separator } from 'react-aria-components';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { TichTichButton } from '@/components/common/TichTichButton';
import { TichTichInput } from '@/components/common/TichTichInput';
import { showError, showSuccess } from '@/lib/toast';
import type { LoginFormData } from '@/features/auth/types/auth.schema';
import { loginSchema } from '@/features/auth/types/auth.schema';

const GoogleIcon = () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
        />
        <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
        />
        <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
        />
        <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
        />
    </svg>
);

export const Route = createFileRoute('/login')({
    component: LoginPage,
});

function LoginPage() {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { isSubmitting, isValid },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
        mode: 'onBlur',
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);
            showSuccess('success.login');
        } catch (error) {
            showError(error);
        }
    };

    return (
        <div className="mobile-container flex flex-col">
            <div className="flex h-full min-h-screen w-full flex-col rounded-2xl bg-white shadow-lg">
                <div className="h-auto w-full">
                    <img
                        src="/images/logo-login.svg"
                        alt="logo"
                        className="h-auto w-full object-contain"
                    />
                </div>
                <div className="flex items-center justify-center">
                    <img
                        src="/images/tichtich-text.svg"
                        alt="logo"
                        className="object-contain"
                    />
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4 px-4 py-8"
                >
                    <Controller
                        name="email"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TichTichInput
                                label={t('auth.email')}
                                placeholder={t('auth.emailPlaceholder')}
                                type="email"
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                isInvalid={fieldState.invalid}
                                errorMessage={
                                    fieldState.error?.message
                                        ? t(fieldState.error.message)
                                        : undefined
                                }
                                rightAdornment={<Mail color="#aaa" />}
                            />
                        )}
                    />

                    <Controller
                        name="password"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TichTichInput
                                label={t('auth.password')}
                                placeholder={t('auth.passwordPlaceholder')}
                                type={showPassword ? 'text' : 'password'}
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
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
                                            setShowPassword((prev) => !prev)
                                        }
                                        className="cursor-pointer border-none bg-transparent p-0"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <EyeOff color="#aaa" />
                                        ) : (
                                            <Eye color="#aaa" />
                                        )}
                                    </button>
                                }
                            />
                        )}
                    />

                    <Link
                        to="/register"
                        className="text-base font-medium text-gray-500 no-underline transition-colors duration-150 hover:text-gray-900"
                    >
                        <span>{t('auth.forgotPassword')}?</span>
                    </Link>

                    <TichTichButton
                        type="submit"
                        isDisabled={!isValid || isSubmitting}
                        isLoading={isSubmitting}
                        variant="primary"
                        size="md"
                        fullWidth
                    >
                        {t('auth.login')}
                    </TichTichButton>

                    <div className="text-center text-sm font-medium text-gray-500">
                        {t('auth.noAccount')}&nbsp;
                        <Link
                            to="/register"
                            className="font-medium text-tichtich-primary-200 no-underline transition-colors duration-150 hover:text-tichtich-primary-200/80"
                        >
                            {t('auth.register')}
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <Separator className="h-px flex-1 border-none bg-gray-200" />
                        <span className="text-xs font-medium text-gray-400">
                            hoặc đăng nhập bằng
                        </span>
                        <Separator className="h-px flex-1 border-none bg-gray-200" />
                    </div>

                    <div className="flex items-center justify-center gap-6">
                        <GoogleIcon />
                        <div className="size-[30px]">
                            <img
                                src="/images/apple-logo.svg"
                                alt="apple"
                                className="size-full object-contain"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
