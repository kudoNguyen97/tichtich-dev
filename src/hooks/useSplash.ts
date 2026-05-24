import { useCallback, useState } from 'react';
import { STORAGE_KEYS } from '@/constants/storage';

export const useSplash = () => {
    const [showSplash] = useState(() => {
        const seen = localStorage.getItem(STORAGE_KEYS.APP_SPLASH_SHOWN);
        if (seen) return false;
        localStorage.setItem(STORAGE_KEYS.APP_SPLASH_SHOWN, '1');
        return true;
    });

    const [visible, setVisible] = useState(showSplash);

    const dismiss = useCallback(() => setVisible(false), []);

    return { visible, dismiss };
};
