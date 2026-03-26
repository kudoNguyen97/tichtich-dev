import type { Profile } from '@/features/auth/types/auth.type';
import { cn } from '@/utils/cn';
import { RefreshCw } from 'lucide-react';

interface HomeCardSelectProfileProps {
    profile: Profile;
    onSelect: () => void;
}

function HomeCardSelectProfile({
    profile,
    onSelect,
}: HomeCardSelectProfileProps) {
    return (
        <div
            className={cn(
                'flex items-center justify-end gap-6 h-[140px]',
                ' rounded-lg px-6 py-4 w-full relative overflow-hidden',
                profile.gender === 'male'
                    ? 'bg-tichtich-blue'
                    : 'bg-tichtich-pink'
            )}
        >
            {/* Pig Illustration */}
            <div className="absolute left-[16px] bottom-0 h-full w-auto">
                <img
                    src="/images/home-adult/pog-boy-kid-card-3x.png"
                    aria-hidden="true"
                    draggable={false}
                    className="h-full w-auto"
                />
            </div>

            <div className="flex flex-col items-start justify-between gap-2">
                <div
                    className={cn(
                        'font-semibold text-base text-black',
                        'truncate'
                    )}
                >
                    {profile.fullName}
                </div>

                <button
                    type="button"
                    onClick={onSelect}
                    className={cn(
                        'flex items-center gap-2 cursor-pointer',
                        'border border-black rounded-full px-4 py-2',
                        'bg-white hover:bg-gray-100 transition-colors duration-150',
                        'font-medium text-sm text-black outline-none',
                        'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black'
                    )}
                >
                    <RefreshCw className="w-4 h-4 mr-1" strokeWidth={2} />
                    Đổi tài khoản con
                </button>
            </div>
        </div>
    );
}

export default HomeCardSelectProfile;
