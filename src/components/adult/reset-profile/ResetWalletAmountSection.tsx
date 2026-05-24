import type { ReactNode } from 'react';

interface ResetWalletAmountSectionProps {
    label: string;
    description?: string;
    children: ReactNode;
}

export function ResetWalletAmountSection({
    label,
    description,
    children,
}: ResetWalletAmountSectionProps) {
    return (
        <div className="rounded-lg bg-orange-50 p-4">
            <h3 className="mb-1 text-base font-bold text-tichtich-black">
                {label}
            </h3>
            {description && (
                <p className="mb-3 text-sm text-tichtich-black/70">
                    {description}
                </p>
            )}
            {children}
        </div>
    );
}
