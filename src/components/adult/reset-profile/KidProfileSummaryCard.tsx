import type { Profile } from '@/features/auth/types/auth.type';
import { GENDER } from '@/features/auth/constants/gender';
import { cn } from '@/utils/cn';

interface KidProfileSummaryCardProps {
    profile: Profile;
}

export function KidProfileSummaryCard({ profile }: KidProfileSummaryCardProps) {
    const isMale = profile.gender === GENDER.MALE;
    return (
        <div
            className={cn(
                'flex items-center justify-end gap-6 h-[140px]',
                'rounded-lg px-6 py-4 w-full relative overflow-hidden',
                isMale ? 'bg-tichtich-blue' : 'bg-tichtich-pink'
            )}
        >
            <div className="absolute left-[16px] bottom-0 h-full w-auto">
                <img
                    src="/images/home-adult/pog-boy-kid-card-3x.png"
                    aria-hidden="true"
                    draggable={false}
                    className="h-full w-auto"
                />
            </div>
            <div className="flex flex-col items-end justify-center gap-1 text-right">
                <div className="text-lg font-bold text-tichtich-black truncate">
                    {profile.fullName}
                </div>
                <div className="text-sm text-tichtich-black/70">
                    Hồ sơ trẻ em
                </div>
            </div>
        </div>
    );
}
