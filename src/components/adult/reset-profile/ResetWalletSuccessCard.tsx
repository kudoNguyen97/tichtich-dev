import type { Profile } from '@/features/auth/types/auth.type';
import { GENDER } from '@/features/auth/constants/gender';
import { formatVndAmount } from '@/helpers/adult/reward/rewardFormat';
import { cn } from '@/utils/cn';

interface ResetWalletSuccessCardProps {
    profile: Profile;
    newBalance: number;
}

export function ResetWalletSuccessCard({
    profile,
    newBalance,
}: ResetWalletSuccessCardProps) {
    const isMale = profile.gender === GENDER.MALE;
    return (
        <div
            className={cn(
                'flex items-center gap-5 rounded-lg px-5 py-5',
                isMale ? 'bg-tichtich-blue' : 'bg-tichtich-pink'
            )}
        >
            <div
                className={cn(
                    'size-20 shrink-0 overflow-hidden rounded-full p-2',
                    isMale ? 'bg-tichtich-blue' : 'bg-tichtich-pink'
                )}
            >
                <img
                    src={
                        isMale
                            ? '/images/face-icons/male-kid.png'
                            : '/images/face-icons/female-kid.png'
                    }
                    aria-hidden
                    draggable={false}
                    className="h-full w-full object-contain"
                />
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-sm text-tichtich-black/70">
                    Tài khoản của con
                </p>
                <p className="text-lg font-semibold text-tichtich-black">
                    {profile.fullName}
                </p>
                <p className="text-base font-bold text-tichtich-black">
                    Số dư mới: {formatVndAmount(newBalance)}
                </p>
            </div>
        </div>
    );
}
