import { Button } from 'react-aria-components';
import { Bell, RefreshCw } from 'lucide-react';

import type { Profile } from '@/features/auth/types/auth.type';
import { cn } from '@/utils/cn';

type AdultAppBarLeftAvatarButtonProps = {
    selectedProfile: Profile | null;
    onPress: () => void;
};

export function AdultAppBarLeftAvatarButton({
    selectedProfile,
    onPress,
}: AdultAppBarLeftAvatarButtonProps) {
    return (
        <Button className="cursor-pointer group" onPress={onPress}>
            <div
                className={cn(
                    'relative',
                    'size-10 rounded-full flex items-center justify-center transition-transform duration-150 group-hover:scale-105 group-hover:shadow-lg',
                    selectedProfile?.gender === 'male'
                        ? 'bg-tichtich-primary-100'
                        : 'bg-tichtich-primary-200'
                )}
            >
                <img
                    src={
                        selectedProfile?.gender === 'male'
                            ? '/images/avatar/adult-fullface.png'
                            : '/images/avatar/kidgirl-fullface.png'
                    }
                    alt="Avatar"
                    className="size-full w-6 h-6 transition-transform duration-150 group-hover:scale-110"
                />
                <RefreshCw
                    className={cn(
                        'absolute bottom-0 right-0 size-4 text-white font-bold',
                        'transition-transform duration-150 group-hover:scale-110',
                        selectedProfile?.gender === 'male'
                            ? 'text-tichtich-primary-200'
                            : 'text-tichtich-primary-100'
                    )}
                    strokeWidth={2.5}
                />
            </div>
        </Button>
    );
}

export function AdultAppBarRightBellButton() {
    return (
        <Button className="cursor-pointer group">
            <div className="size-10 rounded-full overflow-hidden flex items-center justify-center transition-transform duration-150 bg-tichtich-primary-300">
                <Bell
                    className="size-6 text-tichtich-primary-200 font-bold"
                    strokeWidth={2.5}
                />
            </div>
        </Button>
    );
}
