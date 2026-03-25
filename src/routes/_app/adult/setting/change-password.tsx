import { useEffect, useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from 'react-aria-components';
import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react';
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
} from 'firebase/auth';
import type { AuthError } from 'firebase/auth';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { auth } from '@/firebase';
import { TichTichButton } from '@/components/common/TichTichButton';
import { TichTichInput } from '@/components/common/TichTichInput';
import { LoadingTichTich } from '@/components/common/LoadingTichTich';
import { useAppLayoutContext } from '@/components/layout/AppLayout';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { changePasswordSchema } from '@/features/auth/types/auth.schema';
import type { ChangePasswordFormData } from '@/features/auth/types/auth.schema';
import { showError } from '@/lib/toast';
import { cn } from '@/utils/cn';

export const Route = createFileRoute('/_app/adult/setting/change-password')({
    component: ChangePasswordPage,
});

function mapFirebaseChangePasswordMessage(error: unknown): string {
    const code = (error as AuthError | undefined)?.code;
    switch (code) {
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'Mật khẩu hiện tại không đúng';
        case 'auth/weak-password':
            return 'Mật khẩu mới quá yếu. Hãy chọn mật khẩu mạnh hơn.';
        case 'auth/requires-recent-login':
            return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        case 'auth/too-many-requests':
            return 'Thử lại sau. Bạn đã thử quá nhiều lần.';
        default:
            return 'Không thể đổi mật khẩu. Vui lòng thử lại.';
    }
}

function ChangePasswordPage() {
    const navigate = useNavigate();
    const { setAppBar } = useAppLayoutContext();
    const user = useAuthStore((s) => s.user);

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { isSubmitting, isValid },
    } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        mode: 'onChange',
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        },
    });

    useEffect(() => {
        setAppBar({
            title: 'Bảo mật & đăng nhập',
            subtitle: '',
            leftAction: (
                <Button
                    className="cursor-pointer p-2 -ml-2"
                    onPress={() => navigate({ to: '/adult/settings' })}
                    aria-label="Quay lại"
                >
                    <ArrowLeft className="size-6 text-tichtich-black" />
                </Button>
            ),
            rightAction: null,
            appBarClassName:
                'border-b-2 border-tichtich-primary-200 shadow-none',
        });
    }, [navigate, setAppBar]);

    const onSubmit = async (data: ChangePasswordFormData) => {
        const fbUser = auth.currentUser;
        console.log('fbUser', fbUser);

        if (!fbUser?.email) {
            showError(
                new Error(
                    'Không tìm thấy tài khoản email. Vui lòng đăng nhập lại.'
                )
            );
            return;
        }

        try {
            const credential = EmailAuthProvider.credential(
                fbUser.email,
                data.currentPassword
            );
            await reauthenticateWithCredential(fbUser, credential);
            await updatePassword(fbUser, data.newPassword);
            navigate({ to: '/adult/setting/change-password-success' });
        } catch (e) {
            const message = mapFirebaseChangePasswordMessage(e);
            showError(new Error(message));
        }
    };

    if (user && user.loginMethod !== 'email') {
        return (
            <div className="flex flex-col gap-4 px-4 pt-4">
                <p className="text-sm text-tichtich-black/80">
                    Đổi mật khẩu chỉ áp dụng cho tài khoản đăng nhập bằng email.
                </p>
                <TichTichButton
                    variant="outline"
                    size="lg"
                    fullWidth
                    onPress={() => navigate({ to: '/adult/settings' })}
                >
                    Quay lại cài đặt
                </TichTichButton>
            </div>
        );
    }

    return (
        <>
            <LoadingTichTich isLoading={isSubmitting} />
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex min-h-full flex-col px-4 pb-28 pt-4"
            >
                <div className="mb-6 flex gap-4">
                    <div
                        className="flex size-14 shrink-0 items-center justify-center rounded-full bg-orange-100"
                        aria-hidden
                    >
                        <Lock
                            className="size-7 text-orange-500"
                            strokeWidth={2}
                        />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <h2 className="text-xl font-bold text-tichtich-black">
                            Đổi mật khẩu
                        </h2>
                        <p className="text-sm text-tichtich-black/60">
                            Cập nhật mật khẩu để tăng cường bảo mật tài khoản.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <Controller
                        name="currentPassword"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TichTichInput
                                label="Mật khẩu hiện tại"
                                isRequired
                                placeholder="Nhập mật khẩu hiện tại"
                                type={showCurrent ? 'text' : 'password'}
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                isInvalid={fieldState.invalid}
                                errorMessage={fieldState.error?.message}
                                rightAdornment={
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        className="cursor-pointer border-none bg-transparent p-0"
                                        onClick={() =>
                                            setShowCurrent((v) => !v)
                                        }
                                        aria-label={
                                            showCurrent
                                                ? 'Ẩn mật khẩu'
                                                : 'Hiện mật khẩu'
                                        }
                                    >
                                        {showCurrent ? (
                                            <EyeOff className="size-5 text-gray-400" />
                                        ) : (
                                            <Eye className="size-5 text-gray-400" />
                                        )}
                                    </button>
                                }
                            />
                        )}
                    />
                    <Controller
                        name="newPassword"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TichTichInput
                                label="Mật khẩu mới"
                                isRequired
                                placeholder="Nhập mật khẩu mới"
                                type={showNew ? 'text' : 'password'}
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                isInvalid={fieldState.invalid}
                                errorMessage={fieldState.error?.message}
                                rightAdornment={
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        className="cursor-pointer border-none bg-transparent p-0"
                                        onClick={() => setShowNew((v) => !v)}
                                        aria-label={
                                            showNew
                                                ? 'Ẩn mật khẩu'
                                                : 'Hiện mật khẩu'
                                        }
                                    >
                                        {showNew ? (
                                            <EyeOff className="size-5 text-gray-400" />
                                        ) : (
                                            <Eye className="size-5 text-gray-400" />
                                        )}
                                    </button>
                                }
                            />
                        )}
                    />
                    <Controller
                        name="confirmNewPassword"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TichTichInput
                                label="Xác nhận mật khẩu mới"
                                isRequired
                                placeholder="Xác nhận mật khẩu mới"
                                type={showConfirm ? 'text' : 'password'}
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                isInvalid={fieldState.invalid}
                                errorMessage={fieldState.error?.message}
                                rightAdornment={
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        className="cursor-pointer border-none bg-transparent p-0"
                                        onClick={() =>
                                            setShowConfirm((v) => !v)
                                        }
                                        aria-label={
                                            showConfirm
                                                ? 'Ẩn mật khẩu'
                                                : 'Hiện mật khẩu'
                                        }
                                    >
                                        {showConfirm ? (
                                            <EyeOff className="size-5 text-gray-400" />
                                        ) : (
                                            <Eye className="size-5 text-gray-400" />
                                        )}
                                    </button>
                                }
                            />
                        )}
                    />
                </div>

                <div className="fixed bottom-0 left-0 right-0 z-40 max-w-[720px] mx-auto border-t border-gray-200 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                    <TichTichButton
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        isDisabled={!isValid || isSubmitting}
                        isLoading={isSubmitting}
                        className={cn(
                            !isValid &&
                                !isSubmitting &&
                                'bg-gray-600 opacity-90 hover:brightness-100'
                        )}
                    >
                        Đổi mật khẩu
                    </TichTichButton>
                </div>
            </form>
        </>
    );
}
