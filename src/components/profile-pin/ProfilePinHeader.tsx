import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';
import { ProfileAvatar } from './ProfileAvatar';
import type { Profile } from '@/features/profiles/types';
import { cn } from '@/utils/cn';

interface ProfilePinHeaderProps {
  profile: Profile;
  leftAction?: React.ReactNode;
  className?: string;
}

/** Short name for header: "Trần Quốc Bảo" -> "Quốc Bảo" */
function getShortName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return fullName;
  return parts.slice(1).join(' ');
}

export function ProfilePinHeader({ profile, leftAction, className }: ProfilePinHeaderProps) {
  const { t } = useTranslation();
  const shortName = getShortName(profile.name);

  return (
    <header
      className={cn(
        'flex items-center gap-3 px-4 py-3',
        'border-b border-profile-pin-frame/30 bg-white/80',
        className
      )}
    >
      <div className="flex size-10 shrink-0 items-center justify-center">
        {leftAction ?? <ProfileAvatar profile={profile} size="sm" />}
      </div>
      <div className="min-w-0 flex-1 text-center">
        <p className="text-sm font-medium text-tichtich-black">
          {t('profilePin.greeting')}{' '}
          <span className="font-bold">{shortName}</span>
        </p>
      </div>
      <div className="flex size-10 shrink-0 items-center justify-center">
        <button
        type="button"
        className="flex size-10 shrink-0 items-center justify-center rounded-full text-tichtich-black transition-colors hover:bg-gray-100"
        aria-label="Notifications"
      >
        <Bell className="size-5" />
        </button>
      </div>
    </header>
  );
}
