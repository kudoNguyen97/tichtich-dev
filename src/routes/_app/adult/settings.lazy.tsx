import { useState } from 'react';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { Plus } from 'lucide-react';

import { TichTichEditableSettingCard } from '@/components/adult/setting/TichTichEditableSettingCard';
import { TichTichItemSetting } from '@/components/common/TichTichItemSetting';
import { TichTichNotificationSwitchCard } from '@/components/adult/setting/TichTichNotificationSwitchCard';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { cn } from '@/utils/cn';

export const Route = createLazyFileRoute('/_app/adult/settings')({
    component: AdultSettingsPage,
});

function AdultSettingsPage() {
    const navigate = useNavigate();
    const profiles = useAuthStore((s) => s.profiles);
    const user = useAuthStore((s) => s.user);
    const managedKidProfileId = useAuthStore((s) => s.managedKidProfileId);

    const kidProfiles = profiles.filter((p) => p.profileType === 'kid');
    const maxKids = user?.maxKidProfile ?? 5;

    const [dailySplitLimit, setDailySplitLimit] = useState(3);
    const [childEntryLimit, setChildEntryLimit] = useState(1_000_000);

    const [goalReminderOn, setGoalReminderOn] = useState(true);
    const [progressUpdatesOn, setProgressUpdatesOn] = useState(true);
    const [rewardNotifyOn, setRewardNotifyOn] = useState(true);

    const highlightedKidId = managedKidProfileId ?? kidProfiles[0]?.id;

    return (
        <div className="flex flex-col gap-4">
            <section className="flex flex-col gap-4 p-4">
                <TichTichItemSetting
                    label="Thông tin tài khoản"
                    onClick={() => navigate({ to: '/adult/information' })}
                />
                <TichTichItemSetting
                    label="Chuyển đổi tài khoản"
                    onClick={() => {}}
                />
                <TichTichItemSetting
                    label="Đổi mã PIN phụ huynh"
                    onClick={() => {}}
                />
                <TichTichItemSetting label="Đổi mật khẩu" onClick={() => {}} />
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
                                                ? 'bg-[#F9CCD7]'
                                                : 'bg-[#C0E0F0]',
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
                                onClick={() => {}}
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

            <section className="flex flex-col gap-4 p-4">
                <h2 className="text-base font-bold text-tichtich-black">
                    Kiểm soát của phụ huynh
                </h2>
                <TichTichEditableSettingCard
                    label="Giới hạn số lần chia tiền trong ngày"
                    variant="count"
                    value={dailySplitLimit}
                    onSave={setDailySplitLimit}
                    min={0}
                    max={99}
                />
                <TichTichEditableSettingCard
                    label="Giới hạn số tiền con nhập"
                    variant="currency"
                    value={childEntryLimit}
                    onSave={setChildEntryLimit}
                />
                <TichTichItemSetting
                    label={
                        <div className="flex items-start  justify-between w-full flex-col gap-2">
                            <span className="text-tichtich-black text-base font-medium">
                                Cài đặt lại ví tiền của con
                            </span>
                            <span>Xóa toàn bộ số dư của ví con và ví tổng</span>
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
                    isSelected={goalReminderOn}
                    onChange={setGoalReminderOn}
                />
                <TichTichNotificationSwitchCard
                    label="Cập nhật tiến độ"
                    value="Tóm tắt hằng tuần"
                    isSelected={progressUpdatesOn}
                    onChange={setProgressUpdatesOn}
                />
                <TichTichNotificationSwitchCard
                    label="Thông báo ngay khi con nhận thưởng"
                    isSelected={rewardNotifyOn}
                    onChange={setRewardNotifyOn}
                />
            </section>
        </div>
    );
}
