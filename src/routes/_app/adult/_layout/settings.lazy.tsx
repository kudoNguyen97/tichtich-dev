import { useState } from 'react';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { Plus } from 'lucide-react';

import { TichTichEditableSettingCard } from '@/components/adult/setting/TichTichEditableSettingCard';
import { TichTichItemSetting } from '@/components/common/TichTichItemSetting';
import { TichTichNotificationSwitchCard } from '@/components/adult/setting/TichTichNotificationSwitchCard';
import { LoadingTichTich } from '@/components/common/LoadingTichTich';
import {
    useMeSettings,
    useUpdateMeSettings,
} from '@/features/auth/hooks/useAuth';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { cn } from '@/utils/cn';
import { TichTichButton } from '@/components/common/TichTichButton';
import { TichTichConfirmModal } from '@/components/common/TichTichModal';

export const Route = createLazyFileRoute('/_app/adult/_layout/settings')({
    component: AdultSettingsPage,
});

function AdultSettingsPage() {
    const navigate = useNavigate();
    const profiles = useAuthStore((s) => s.profiles);
    const user = useAuthStore((s) => s.user);
    const managedKidProfileId = useAuthStore((s) => s.managedKidProfileId);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

    const {
        data: settings,
        isPending: isSettingsQueryPending,
        isError: isSettingsError,
    } = useMeSettings();
    const { mutateAsync: updateSettings, isPending: isUpdateSettingsPending } =
        useUpdateMeSettings();

    const kidProfiles = profiles.filter((p) => p.profileType === 'kid');
    const maxKids = user?.maxKidProfile ?? 5;

    const highlightedKidId = managedKidProfileId ?? kidProfiles[0]?.id;

    /** Loading khi GET /me/settings lần đầu hoặc khi POST cập nhật cài đặt */
    const showSettingsLoading =
        isAuthenticated &&
        ((!settings && isSettingsQueryPending) || isUpdateSettingsPending);
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

    const handleChangeAccount = () => {
        useAuthStore.setState({
            selectedProfile: null,
            managedKidProfileId: null,
        });
        navigate({ to: '/profiles' });
    };

    const openLogoutDialog = () => setIsLogoutDialogOpen(true);
    const closeLogoutDialog = () => setIsLogoutDialogOpen(false);

    const confirmLogout = () => {
        useAuthStore.setState({
            isAuthenticated: false,
            selectedProfile: null,
            managedKidProfileId: null,
            user: null,
            accessToken: null,
            profiles: [],
        });
        navigate({ to: '/' });
    };

    return (
        <>
            <LoadingTichTich isLoading={showSettingsLoading} />
            <div className="flex flex-col gap-4">
                <section className="flex flex-col gap-4 p-4">
                    <TichTichItemSetting
                        label="Thông tin tài khoản"
                        onClick={() =>
                            navigate({ to: '/adult/setting/information' })
                        }
                    />
                    <TichTichItemSetting
                        label="Chuyển đổi tài khoản"
                        onClick={handleChangeAccount}
                    />
                    <TichTichItemSetting
                        label="Đổi mã PIN phụ huynh"
                        onClick={() =>
                            navigate({ to: '/adult/setting/change-pin' })
                        }
                    />
                    <TichTichItemSetting
                        label="Đổi mật khẩu"
                        onClick={() =>
                            navigate({ to: '/adult/setting/change-password' })
                        }
                    />
                </section>

                <section>
                    <h2 className="text-base font-bold text-tichtich-black px-4 mb-2">
                        Tài khoản trẻ em ({kidProfiles.length}/{maxKids})
                    </h2>
                    <div className="flex flex-col gap-4 py-3 px-4 bg-[#E0D6D2]">
                        <div className="flex flex-row flex-wrap items-start gap-4">
                            {kidProfiles.map((kid) => {
                                const isActive = kid.id === highlightedKidId;
                                const isFemale = kid.gender === 'female';
                                return (
                                    <div
                                        key={kid.id}
                                        className="flex flex-col items-center gap-2"
                                    >
                                        <div
                                            className={cn(
                                                'flex h-22 w-22 p-3 items-center justify-center rounded-lg overflow-hidden',
                                                isFemale
                                                    ? 'bg-tichtich-pink'
                                                    : 'bg-tichtich-blue',
                                                isActive
                                                    ? isFemale
                                                        ? 'border-2 border-[#f07997]'
                                                        : 'border-2 border-tichtich-primary-200'
                                                    : 'border-2 border-transparent'
                                            )}
                                        >
                                            <img
                                                src={
                                                    isFemale
                                                        ? '/images/face-icons/female-kid.png'
                                                        : '/images/face-icons/male-kid.png'
                                                }
                                                alt=""
                                                className="h-full w-full object-contain"
                                            />
                                        </div>
                                        <span
                                            className={cn(
                                                'text-base text-center max-w-22 truncate',
                                                isActive
                                                    ? 'font-bold text-tichtich-black'
                                                    : 'font-normal text-tichtich-black/60'
                                            )}
                                        >
                                            {kid.fullName}
                                        </span>
                                    </div>
                                );
                            })}
                            {kidProfiles.length < maxKids && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        navigate({
                                            to: '/adult/setting/create-profile',
                                        });
                                    }}
                                    className={cn(
                                        'flex h-22 w-22 shrink-0 items-center justify-center rounded-lg',
                                        'bg-orange-500 hover:bg-orange-600 transition-colors',
                                        'cursor-pointer'
                                    )}
                                    aria-label="Thêm tài khoản trẻ em"
                                >
                                    <Plus
                                        className="size-10 text-black"
                                        strokeWidth={2.5}
                                    />
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {isAuthenticated && isSettingsError && (
                    <section className="px-4">
                        <p className="text-sm text-tichtich-red">
                            Không tải được cài đặt. Vui lòng thử lại sau.
                        </p>
                    </section>
                )}

                {settings && (
                    <>
                        <section className="flex flex-col gap-4 p-4">
                            <h2 className="text-base font-bold text-tichtich-black">
                                Kiểm soát của phụ huynh
                            </h2>
                            <TichTichEditableSettingCard
                                label="Giới hạn số lần chia tiền trong ngày"
                                variant="count"
                                value={settings.dailySavingLimit}
                                onSave={(next) =>
                                    void updateSettings({
                                        dailySavingLimit: next,
                                    })
                                }
                                min={0}
                                max={99}
                            />
                            <TichTichEditableSettingCard
                                label="Giới hạn số tiền con nhập"
                                variant="currency"
                                value={settings.maxMoneyInput}
                                onSave={(next) =>
                                    void updateSettings({
                                        maxMoneyInput: next,
                                    })
                                }
                            />
                            <TichTichItemSetting
                                label={
                                    <div className="flex items-start  justify-between w-full flex-col gap-2">
                                        <span className="text-tichtich-black text-base font-medium">
                                            Cài đặt lại ví tiền của con
                                        </span>
                                        <span>
                                            Xóa toàn bộ số dư của ví con và ví
                                            tổng
                                        </span>
                                    </div>
                                }
                                onClick={() => {}}
                            />
                        </section>

                        <section className="flex flex-col gap-3 p-4">
                            <h2 className="text-base font-bold text-tichtich-black">
                                Thông báo
                            </h2>
                            <TichTichNotificationSwitchCard
                                label="Nhắc nhở mục tiêu"
                                value="Hằng ngày lúc 8:00 PM"
                                isSelected={settings.isEnableDailyReminder}
                                onChange={(v) =>
                                    void updateSettings({
                                        isEnableDailyReminder: v,
                                    })
                                }
                            />
                            <TichTichNotificationSwitchCard
                                label="Cập nhật tiến độ"
                                value="Tóm tắt hằng tuần"
                                isSelected={settings.isEnableWeeklySummary}
                                onChange={(v) =>
                                    void updateSettings({
                                        isEnableWeeklySummary: v,
                                    })
                                }
                            />
                            <TichTichNotificationSwitchCard
                                label="Thông báo ngay khi con nhận thưởng"
                                isSelected={settings.isNotifyWhenKidSavedMoney}
                                onChange={(v) =>
                                    void updateSettings({
                                        isNotifyWhenKidSavedMoney: v,
                                    })
                                }
                            />
                            <TichTichButton
                                variant="outline"
                                onPress={openLogoutDialog}
                            >
                                Đăng xuất
                            </TichTichButton>

                            <TichTichButton
                                variant="danger"
                                // onClick={handleDeleteAccount}
                            >
                                Xóa tài khoản
                            </TichTichButton>
                        </section>
                    </>
                )}
            </div>
            <TichTichConfirmModal
                isOpen={isLogoutDialogOpen}
                onClose={closeLogoutDialog}
                onConfirm={confirmLogout}
                title="Đăng xuất"
                description="Bạn có chắc chắn muốn đăng xuất?"
                cancelLabel="Đóng"
                confirmLabel="Đồng ý"
            />
        </>
    );
}
