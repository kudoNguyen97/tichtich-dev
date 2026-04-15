import { WALLET_FORM_OPTIONS } from '@/helpers/adult/missions/walletOptions';

interface WalletSelectorProps {
    value: string;
    onChange: (val: string) => void;
    error?: string;
}

const WalletSelector = ({ value, onChange, error }: WalletSelectorProps) => {
    return (
        <div className="space-y-2">
            <label className="text-base font-semibold text-tichtich-black">
                Lấy từ ví nào <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3 mt-2">
                {WALLET_FORM_OPTIONS.map((w) => {
                    const isSelected = value === w.id;
                    return (
                        <button
                            key={w.id}
                            type="button"
                            onClick={() => onChange(w.id)}
                            className={`flex items-center justify-center h-20 gap-3 px-6 py-4 rounded-lg cursor-pointer border transition-all text-sm font-medium ${
                                isSelected
                                    ? 'border-tichtich-primary-200 bg-tichtich-primary-100 shadow-md'
                                    : 'border-tichtich-black bg-white text-tichtich-black hover:border-tichtich-primary-200/40'
                            }`}
                        >
                            <div className="w-8 h-8 flex items-center justify-center">
                                <img
                                    src={w.icon}
                                    aria-hidden="true"
                                    draggable={false}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span className="text-base font-medium">
                                {w.label}
                            </span>
                        </button>
                    );
                })}
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
};

export default WalletSelector;
