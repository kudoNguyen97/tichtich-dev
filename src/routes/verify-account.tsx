import CountDown from '@/components/common/CountDown';
import { TichTichButton } from '@/components/common/TichTichButton';
import { AuthFormLayout } from '@/components/layout/AuthFormLayout';
import { useLogin } from '@/features/auth/hooks/useAuth';
import { auth } from '@/firebase';
import { useCountDown } from '@/hooks/useCountDown';
import { showError, showSuccess } from '@/lib/toast';
import { useLoadingStore } from '@/stores/useLoadingStore';
import { cn } from '@/utils/cn';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { reload, sendEmailVerification } from 'firebase/auth';

export const Route = createFileRoute('/verify-account')({
    validateSearch: (search: Record<string, unknown>): { email?: string } => ({
        email:
            typeof search.email === 'string' && search.email.length > 0
                ? search.email
                : undefined,
    }),
    component: VerifyAccountPage,
});

function VerifyAccountPage() {
    const { email } = Route.useSearch();
    const navigate = useNavigate();
    const { mutateAsync: login } = useLogin();
    const { show, hide } = useLoadingStore();
    const { formatted, isExpired, isRunning, start, reset } = useCountDown({
        initialSeconds: 10,
        autoStart: true,
    });

    const resolveCurrentUser = () => {
        const currentUser = auth.currentUser;

        if (!currentUser) {
            showError('Phiên xác thực đã hết. Vui lòng đăng nhập lại.');
            navigate({ to: '/login', replace: true });
            return null;
        }

        return currentUser;
    };

    const handleResend = async () => {
        const currentUser = resolveCurrentUser();
        if (!currentUser) return;

        try {
            show();
            await sendEmailVerification(currentUser);
            reset();
            start();
            showSuccess('success.updated', 'Vui lòng kiểm tra email của bạn.');
        } catch (error) {
            showError(error);
        } finally {
            hide();
        }
    };

    const handleCheckVerified = async () => {
        const currentUser = resolveCurrentUser();
        if (!currentUser) return;

        try {
            show();
            await reload(currentUser);

            if (!currentUser.emailVerified) {
                showError(
                    'Email chưa được xác thực. Vui lòng kiểm tra hộp thư của bạn.'
                );
                return;
            }

            const idToken = await currentUser.getIdToken(true);
            await login({
                method: 'email',
                provider: 'firebase',
                idToken,
            });

            navigate({ to: '/profiles', replace: true });
        } catch (error) {
            showError(error);
        } finally {
            hide();
        }
    };

    return (
        <AuthFormLayout>
            <AuthFormLayout.AppBar
                title="Xác thực tài khoản"
                backTo="/login"
                className={cn('bg-tichtich-primary-300')}
            />
            <div className="flex flex-col items-center px-4 py-6">
                <p className="mb-4 text-center text-xl font-semibold text-tichtich-black">
                    Kiểm tra email của bạn
                </p>
                <span className="text-center text-sm text-gray-600">
                    Chúng tôi đã gửi một liên kết xác minh đến
                </span>
                <span className="mb-6 font-medium text-tichtich-black">
                    {email ?? 'email@example.com'}
                </span>

                <div className="flex w-full flex-col gap-4">
                    <TichTichButton
                        className="w-full"
                        onPress={() => {
                            const to = email ? encodeURIComponent(email) : '';
                            window.open(`mailto:${to}`, '_self');
                        }}
                    >
                        Mở ứng dụng Email
                    </TichTichButton>
                    <TichTichButton
                        className="w-full"
                        variant="outline"
                        onPress={handleResend}
                        isDisabled={isRunning}
                    >
                        {isExpired ? 'Gửi lại mã xác thực' : 'Gửi mã xác thực'}
                    </TichTichButton>
                    <TichTichButton
                        variant="outline"
                        className="w-full"
                        onPress={handleCheckVerified}
                    >
                        Kiểm tra xác thực
                    </TichTichButton>
                </div>

                <p className="mt-6 text-sm text-tichtich-primary-200">
                    Không nhận được email? Kiểm tra thư mục spam hoặc thử gửi
                    lại.
                </p>
                <p className="mt-4 text-sm text-gray-500">
                    Có thể gửi lại sau &nbsp;
                    <CountDown formatted={formatted} isExpired={isExpired} />
                </p>
            </div>
        </AuthFormLayout>
    );
}
