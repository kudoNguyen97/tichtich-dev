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
import {
    GoogleAuthProvider,
    OAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
} from 'firebase/auth';
import type { AuthError } from 'firebase/auth';
import { auth } from '../firebase';
import { TichTichButton } from '@/components/common/TichTichButton';
import { TichTichInput } from '@/components/common/TichTichInput';
import { showError } from '@/lib/toast';
import { ApiError } from '@/types/api.type';
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
    const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
    const [isAppleSubmitting, setIsAppleSubmitting] = useState(false);
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
            const response = await login({
                method: 'email',
                provider: 'firebase',
                idToken,
            });

            const hasKidProfile = response.user.profiles.some(
                (p) => p.profileType === 'kid'
            );

            navigate({
                to: hasKidProfile ? '/profiles' : '/create-profile',
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

    const handleGoogleLogin = async () => {
        if (isGoogleSubmitting || isSubmitting) return;

        try {
            setIsGoogleSubmitting(true);
            const provider = new GoogleAuthProvider();
            const credential = await signInWithPopup(auth, provider);
            const idToken = await credential.user.getIdToken();

            const response = await login({
                method: 'google',
                provider: 'firebase',
                idToken,
            });

            const hasKidProfile = response.user.profiles.some(
                (p) => p.profileType === 'kid'
            );

            navigate({
                to: hasKidProfile ? '/profiles' : '/create-profile',
                replace: true,
            });
        } catch (error) {
            const code = (error as AuthError | undefined)?.code;
            const popupErrorCodes = new Set([
                'auth/popup-closed-by-user',
                'auth/popup-blocked',
                'auth/cancelled-popup-request',
            ]);

            if (code && popupErrorCodes.has(code)) {
                showError('Đăng nhập Google đã bị hủy hoặc bị chặn pop-up.');
                return;
            }

            if (error instanceof ApiError && error.statusCode === 404) {
                showError(
                    'Tài khoản Google này chưa được đăng ký. Vui lòng đăng ký trước.'
                );
                return;
            }

            showError(error);
        } finally {
            setIsGoogleSubmitting(false);
        }
    };

    const handleAppleLogin = async () => {
        if (isAppleSubmitting || isSubmitting) return;

        try {
            setIsAppleSubmitting(true);
            const provider = new OAuthProvider('apple.com');
            const credential = await signInWithPopup(auth, provider);
            const idToken = await credential.user.getIdToken();

            const response = await login({
                method: 'apple',
                provider: 'firebase',
                idToken,
            });

            const hasKidProfile = response.user.profiles.some(
                (p) => p.profileType === 'kid'
            );

            navigate({
                to: hasKidProfile ? '/profiles' : '/create-profile',
                replace: true,
            });
        } catch (error) {
            const code = (error as AuthError | undefined)?.code;
            const popupErrorCodes = new Set([
                'auth/popup-closed-by-user',
                'auth/popup-blocked',
                'auth/cancelled-popup-request',
            ]);

            if (code && popupErrorCodes.has(code)) {
                showError('Đăng nhập Apple đã bị hủy hoặc bị chặn pop-up.');
                return;
            }

            if (error instanceof ApiError && error.statusCode === 404) {
                showError(
                    'Tài khoản Apple này chưa được đăng ký. Vui lòng đăng ký trước.'
                );
                return;
            }

            showError(error);
        } finally {
            setIsAppleSubmitting(false);
        }
    };

    return (
        <div className="flex h-full min-h-screen w-full flex-col overflow-y-auto rounded-2xl bg-white shadow-lg">
            <div className="w-full shrink-0 px-4 pt-4 sm:px-5 sm:pt-5 [@media(max-height:760px)]:px-3 [@media(max-height:760px)]:pt-3">
                <img
                    src="/images/logo-login.svg"
                    alt="logo"
                    fetchPriority="high"
                    draggable={false}
                    className="mx-auto h-auto w-full max-w-[600px] object-contain max-h-[clamp(96px,24dvh,220px)] sm:max-h-[clamp(110px,26dvh,250px)] [@media(max-height:860px)]:max-h-[clamp(90px,20dvh,180px)] [@media(max-height:760px)]:max-h-[clamp(74px,17dvh,128px)]"
                />
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-3 px-4 pb-2 pt-3 sm:px-5 sm:pb-3 sm:pt-4 [@media(max-height:760px)]:gap-2.5 [@media(max-height:760px)]:px-3 [@media(max-height:760px)]:pb-1 [@media(max-height:760px)]:pt-2"
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
            <div className="mb-2 px-4 text-center text-sm font-medium text-gray-500 sm:mb-3 sm:px-5 [@media(max-height:760px)]:mb-1 [@media(max-height:760px)]:px-3">
                {t('auth.noAccount')}&nbsp;
                <Link
                    to="/register"
                    className="font-medium text-tichtich-primary-200 no-underline transition-colors duration-150 hover:text-tichtich-primary-200/80"
                >
                    {t('auth.registerNewAccount')}
                </Link>
            </div>

            <div className="my-2 flex items-center gap-2 px-4 sm:my-3 sm:px-5 [@media(max-height:760px)]:my-1.5 [@media(max-height:760px)]:px-3">
                <Separator className="h-px flex-1 border-none bg-gray-200" />
                <span className="text-xs font-medium text-gray-400">
                    hoặc đăng nhập bằng
                </span>
                <Separator className="h-px flex-1 border-none bg-gray-200" />
            </div>

            <div className="my-2 flex items-center justify-center gap-5 pb-4 sm:my-3 sm:pb-5 [@media(max-height:760px)]:my-1.5 [@media(max-height:760px)]:gap-4 [@media(max-height:760px)]:pb-3">
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isGoogleSubmitting || isSubmitting}
                    aria-label="Đăng nhập bằng Google"
                    className="size-7 cursor-pointer border-none p-0 disabled:cursor-not-allowed disabled:opacity-60 sm:size-[30px]"
                >
                    <img
                        src="/images/icon-google.svg"
                        alt="google"
                        className="size-full object-contain"
                    />
                </button>
                <button
                    type="button"
                    onClick={handleAppleLogin}
                    disabled={isAppleSubmitting || isSubmitting}
                    aria-label="Đăng nhập bằng Apple"
                    className="size-7 cursor-pointer border-none p-0 disabled:cursor-not-allowed disabled:opacity-60 sm:size-[30px]"
                >
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
