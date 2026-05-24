import { WALLET_TYPE  } from './walletType';
import type {WalletTypeValue} from './walletType';

export const CATEGORY_TO_WALLET_TYPE = {
    savings: WALLET_TYPE.SAVING,
    learning: WALLET_TYPE.EDUCATION,
    charity: WALLET_TYPE.CHARITY,
    spending: WALLET_TYPE.SPENDING,
} as const satisfies Record<string, WalletTypeValue>;

export type CategoryId = keyof typeof CATEGORY_TO_WALLET_TYPE;
