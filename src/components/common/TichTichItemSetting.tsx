import { ChevronRightIcon } from 'lucide-react';
import React from 'react';

type TichTichItemSettingProps = {
    label: React.ReactNode | string;
    icon?: React.ReactNode;
    onClick?: () => void;
    className?: string;
};

export const TichTichItemSetting: React.FC<TichTichItemSettingProps> = ({
    label,
    icon,
    onClick,
    className = '',
}) => {
    return (
        <div
            className={`bg-tichtich-primary-300 rounded-lg border border-[#E5E5E5] px-5 py-4 flex items-center justify-between cursor-pointer transition hover:bg-tichtich-primary-100/60 ${className}`}
            onClick={onClick}
        >
            <span className="text-tichtich-black text-base font-medium">
                {label}
            </span>
            {icon || <ChevronRightIcon className="ml-2 size-6" />}
        </div>
    );
};

// Example usage:
// <TichTichItemSetting label="Chuyển đổi tài khoản" onClick={() => {}} />
