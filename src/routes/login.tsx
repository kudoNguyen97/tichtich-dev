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
        mode: 'onChange',
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

                    <span>
                        <Link
                            to="/register"
                            className="text-base inline-block font-medium text-tichtich-black no-underline transition-colors duration-150 hover:text-tichtich-primary-100"
                        >
                            {t('auth.forgotPassword')}?
                        </Link>
                    </span>

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
                            {t('auth.registerNewAccount')}
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
                        <button className="size-[30px] cursor-pointer border-none p-0">
                            <img
                                src="/images/icon-google.svg"
                                alt="google"
                                className="size-full object-contain"
                            />
                        </button>
                        <button className="size-[30px] cursor-pointer border-none p-0">
                            <img
                                src="/images/icon-apple.svg"
                                alt="apple"
                                className="size-full object-contain"
                            />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
