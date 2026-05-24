import { useEffect, useState } from 'react';
import {
    SPLASH_DURATION_MS,
    SPLASH_FADE_OFFSET_MS,
} from '@/constants/timing';

interface SplashScreenProps {
    onDone: () => void;
    duration?: number;
}

export const SplashScreen = ({
    onDone,
    duration = SPLASH_DURATION_MS,
}: SplashScreenProps) => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const fadeTimer = setTimeout(
            () => setFadeOut(true),
            duration - SPLASH_FADE_OFFSET_MS
        );
        const doneTimer = setTimeout(onDone, duration);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(doneTimer);
        };
    }, []);

    return (
        <div
            className={`
          fixed inset-0 z-9999 h-full max-w-[720px] mx-auto bg-tichtich-primary-100
          flex flex-col items-center justify-center
          pointer-events-none
          transition-opacity duration-500 ease-out
          ${fadeOut ? 'opacity-0' : 'opacity-100'}
        `}
        >
            <img
                src="/images/splash.svg"
                alt="Splash Screen"
                className="w-full h-full object-fill"
            />
            <img
                src="/pig-loading.svg"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[170px] h-[170px]"
            />
        </div>
    );
};
