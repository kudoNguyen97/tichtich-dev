import type { Profile } from '@/features/auth/types/auth.type';
import { cn } from '@/utils/cn';

export interface KidProfileSummaryCardProps {
    kidProfile: Profile;
    totalPoints?: number;
    isLoading?: boolean;
    className?: string;
}

export function KidProfileSummaryCard({
    kidProfile,
    totalPoints,
    isLoading = false,
    className,
}: KidProfileSummaryCardProps) {
    const avatarSrc =
        kidProfile.gender === 'female'
            ? '/pig-full-body-female.svg'
            : '/pig-full-body-male.svg';

    return (
        <div
            className={cn(
                'flex items-center gap-4 rounded-lg bg-tichtich-blue px-5 py-4',
                className
            )}
        >
            <img
                src={avatarSrc}
                alt={kidProfile.fullName}
                className="h-20 w-20 object-contain shrink-0"
            />
            <div className="flex flex-col gap-1">
                <p className="text-lg font-bold text-tichtich-black">
                    {kidProfile.fullName}
                </p>
                {isLoading ? (
                    <div className="h-5 w-20 rounded bg-black/10 animate-pulse" />
                ) : (
                    <div className="flex items-center gap-1">
                        <span className="text-base font-bold text-tichtich-black">
                            {totalPoints ?? 0}
                        </span>
                        <span className="text-base text-tichtich-primary-100">
                            ★
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
