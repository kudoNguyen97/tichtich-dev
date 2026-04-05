import {
    createFileRoute,
    Link,
    redirect,
    useNavigate,
} from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { Separator } from 'react-aria-components';
import { signInWithEmailAndPassword } from 'firebase/auth';
import type { AuthError } from 'firebase/auth';
import { auth } from '../firebase';
import { TichTichButton } from '@/components/common/TichTichButton';
import { TichTichInput } from '@/components/common/TichTichInput';
import { showError } from '@/lib/toast';
import type { LoginFormData } from '@/features/auth/types/auth.schema';
import { loginSchema } from '@/features/auth/types/auth.schema';
import { useLogin } from '@/features/auth/hooks/useAuth';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

export const Route = createFileRoute('/login')({
    component: LoginPage,
    beforeLoad: () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (isAuthenticated) {
            throw redirect({ to: '/profiles' });
        }
    },
    head: () => ({
        meta: [{ title: 'Tích Tích - Đăng nhập' }],
    }),
});

function LoginPage() {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const { mutateAsync: login } = useLogin();

    const navigate = useNavigate();
    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
        // mode: 'onChange',
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            const credential = await signInWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );
            const { user: firebaseUser } = credential;

            const expirationTime = await firebaseUser
                .getIdTokenResult()
                .then((result) => result.expirationTime);

            // Nếu thông tin đúng nhưng email chưa được xác thực -> chuyển sang verify-account
            if (!firebaseUser.emailVerified) {
                navigate({
                    to: '/verify-account',
                    replace: true,
                    search: { email: data.email },
                });
                return;
            }

            // Email đã xác thực: lấy idToken từ Firebase và gọi API login backend
            const idToken = await firebaseUser.getIdToken();
            await login({
                method: 'email',
                provider: 'firebase',
                idToken,
            });

            localStorage.setItem('time_expired', expirationTime.toString());

            navigate({
                to: '/profiles',
                replace: true,
            });
        } catch (error) {
            const code = (error as AuthError | undefined)?.code;

            // Thông tin đăng nhập sai (email hoặc mật khẩu) -> hiển thị message chung
            if (
                code === 'auth/invalid-credential' ||
                code === 'auth/wrong-password' ||
                code === 'auth/user-not-found'
            ) {
                showError(t('error.auth.invalidCredentials'));
                return;
            }

            showError(error);
        }
    };

    return (
        <div className="flex h-full min-h-screen w-full flex-col rounded-2xl bg-white shadow-lg">
            <div className="h-auto w-full">
                <img
                    src="/images/logo-login.svg"
                    alt="logo"
                    fetchPriority="high"
                    draggable={false}
                    className="h-auto w-full object-contain"
                />
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 p-4"
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
                    isDisabled={isSubmitting}
                    isLoading={isSubmitting}
                    variant="primary"
                    size="md"
                    fullWidth
                >
                    {t('auth.login')}
                </TichTichButton>
            </form>
            <div className="text-center text-sm font-medium text-gray-500 px-4 mb-4">
                {t('auth.noAccount')}&nbsp;
                <Link
                    to="/register"
                    className="font-medium text-tichtich-primary-200 no-underline transition-colors duration-150 hover:text-tichtich-primary-200/80"
                >
                    {t('auth.registerNewAccount')}
                </Link>
            </div>

            <div className="flex items-center gap-3 my-4">
                <Separator className="h-px flex-1 border-none bg-gray-200" />
                <span className="text-xs font-medium text-gray-400">
                    hoặc đăng nhập bằng
                </span>
                <Separator className="h-px flex-1 border-none bg-gray-200" />
            </div>

            <div className="flex items-center justify-center gap-6 my-4">
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
        </div>
    );
}
