import { formatVndAmount } from '@/helpers/adult/reward/rewardFormat';

export const MAX_RESET_BALANCE = 10_000_000;

export function getResetBalanceSuggestions(typedDigits: string): number[] {
    const n = parseInt(typedDigits, 10);
    if (!n || isNaN(n)) return [];
    const candidates = [n * 1_000, n * 10_000];
    return candidates.filter((v) => v >= 1 && v <= MAX_RESET_BALANCE);
}

export type ResetAmountState = {
    typedDigits: string;
    amountDisplay: string;
    currentAmount: number;
    suggestionTagsDismissed: boolean;
};

export const INITIAL_RESET_AMOUNT_STATE: ResetAmountState = {
    typedDigits: '',
    amountDisplay: '',
    currentAmount: 0,
    suggestionTagsDismissed: false,
};

export function deriveAmountChange(val: string): ResetAmountState {
    const digits = val.replace(/\D/g, '');
    const num = digits ? parseInt(digits, 10) : NaN;
    if (isNaN(num)) {
        return {
            typedDigits: digits,
            amountDisplay: '',
            currentAmount: 0,
            suggestionTagsDismissed: false,
        };
    }
    return {
        typedDigits: digits,
        amountDisplay: formatVndAmount(num),
        currentAmount: num,
        suggestionTagsDismissed: false,
    };
}

export function deriveSuggestionPick(amount: number): ResetAmountState {
    return {
        typedDigits: String(amount / 1000),
        amountDisplay: formatVndAmount(amount),
        currentAmount: amount,
        suggestionTagsDismissed: true,
    };
}
