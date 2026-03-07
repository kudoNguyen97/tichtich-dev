import CountDown from '@/components/common/CountDown';
import { TichTichButton } from '@/components/common/TichTichButton';
import { AuthFormLayout } from '@/components/layout/AuthFormLayout';
import { useCountDown } from '@/hooks/useCountDown';
import { createFileRoute } from '@tanstack/react-router';

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
    const { formatted, isExpired, isRunning, start, reset } = useCountDown({
        initialSeconds: 10,
        autoStart: true,
    });

    const handleResend = () => {
        reset();
        start();
    };

    return (
        <AuthFormLayout title="Xác thực tài khoản">
            <div className="flex flex-col items-center px-4 py-6">
                <p className="text-center text-tichtich-black text-xl font-semibold mb-4">
                    Kiểm tra email của bạn
                </p>
                <span className="text-center text-sm text-gray-600">
                    Chúng tôi đã gửi một liên kết xác minh đến
                </span>
                <span className="font-medium text-tichtich-black mb-6">
                    {email ?? 'email@example.com'}
                </span>

                <div className="flex flex-col gap-4 w-full">
                    <TichTichButton className="w-full">
                        Mở ứng dụng Email
                    </TichTichButton>
                    <TichTichButton
                        className="w-full"
                        variant="outline"
                        onClick={handleResend}
                        isDisabled={isRunning}
                    >
                        {isExpired ? 'Gửi lại mã xác thực' : 'Gửi mã xác thực'}
                    </TichTichButton>
                    <TichTichButton variant="outline" className="w-full">
                        Kiểm tra xác thực
                    </TichTichButton>
                </div>

                <p className="text-sm text-tichtich-primary-200 mt-6">
                    Không nhận dược email? Kiểm tra thư mục spam hoặc thư gửi
                    lại.
                </p>
                <p className="text-sm text-gray-500 mt-4">
                    Có thể gửi lại sau &nbsp;
                    <CountDown formatted={formatted} isExpired={isExpired} />
                </p>
            </div>
        </AuthFormLayout>
    );
}
