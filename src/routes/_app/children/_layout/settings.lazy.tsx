import { useState } from 'react';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useSelectedChildProfile } from '@/hooks/useSelectedChildProfile';
import { TichTichItemSetting } from '@/components/common/TichTichItemSetting';
import { TichTichConfirmModal } from '@/components/common/TichTichModal';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

export const Route = createLazyFileRoute('/_app/children/_layout/settings')({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const profile = useSelectedChildProfile();
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
    if (!profile) return null;
    const handleChangeAccount = () => {
        useAuthStore.setState({
            selectedProfile: null,
            managedKidProfileId: null,
        });
        navigate({ to: '/profiles' });
    };
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
    const openLogoutDialog = () => setIsLogoutDialogOpen(true);
    const closeLogoutDialog = () => setIsLogoutDialogOpen(false);
    return (
        <div className="flex flex-col gap-4 p-4">
            <TichTichItemSetting
                label="Chuyển đổi tài khoản"
                onClick={handleChangeAccount}
            />
            <TichTichItemSetting
                label="Đổi mã PIN"
                onClick={() => navigate({ to: '/children/setting/change-pin' })}
            />
            <TichTichItemSetting label="Đăng xuất" onClick={openLogoutDialog} />
            <TichTichConfirmModal
                isOpen={isLogoutDialogOpen}
                onClose={closeLogoutDialog}
                onConfirm={confirmLogout}
                title="Đăng xuất"
                description="Bạn có chắc chắn muốn đăng xuất?"
                cancelLabel="Đóng"
                confirmLabel="Đồng ý"
            />
        </div>
    );
}
