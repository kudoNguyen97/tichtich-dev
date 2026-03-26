import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from 'react-aria-components';
import { ArrowLeft, Check } from 'lucide-react';

import { TichTichButton } from '@/components/common/TichTichButton';
import { AppBar } from '@/components/layout/AppBar';

export const Route = createFileRoute(
    '/_app/adult/setting/_layout/change-password-success'
)({
    component: ChangePasswordSuccessPage,
});

function ChangePasswordSuccessPage() {
    const navigate = useNavigate();

    return (
        <>
            <AppBar
                title="Thông tin tài khoản"
                subtitle=""
                leftAction={
                    <Button
                        onPress={() => navigate({ to: '/adult/settings' })}
                        className="cursor-pointer p-2 -ml-2"
                    >
                        <ArrowLeft className="size-6 text-tichtich-black" />
                    </Button>
                }
                rightAction={null}
            />
            <div className="flex min-h-[calc(100vh-3.5rem)] flex-col px-4 pb-28 pt-8">
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                    <div
                        className="mb-6 flex size-28 items-center justify-center rounded-full bg-orange-100"
                        aria-hidden
                    >
                        <div className="flex size-16 items-center justify-center rounded-full bg-orange-400/90">
                            <Check
                                className="size-10 text-white"
                                strokeWidth={3}
                            />
                        </div>
                    </div>
                    <h2 className="mb-3 text-xl font-bold text-tichtich-black">
                        Đổi mật khẩu thành công!
                    </h2>
                    <p className="max-w-sm text-base text-tichtich-black/60">
                        Mật khẩu của bạn đã được cập nhật thành công.
                        <br />
                        Bạn có thể sử dụng mật khẩu mới để đăng nhập.
                    </p>
                </div>

                <div className="fixed bottom-0 left-0 right-0 z-40 max-w-[720px] mx-auto border-t border-gray-200 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                    <TichTichButton
                        variant="primary"
                        size="lg"
                        fullWidth
                        onPress={() => navigate({ to: '/adult/settings' })}
                    >
                        Quay lại cài đặt
                    </TichTichButton>
                </div>
            </div>
        </>
    );
}
