import { useState, useEffect, useCallback, useRef } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

/**
 * useOtpCountdown
 *
 * @param {object} options
 * @param {number}   options.initialSeconds - Thời gian đếm ngược (mặc định 60)
 * @param {boolean}  options.autoStart      - Tự start khi mount (mặc định true)
 * @param {function} options.onExpire       - Callback khi hết giờ
 *
 * @returns {object}
 * - formatted   : string  — "00:59"
 * - secondsLeft : number  — số giây còn lại
 * - isRunning   : boolean
 * - isExpired   : boolean
 * - start()     — bắt đầu / reset về initialSeconds rồi chạy lại
 * - stop()      — dừng timer
 * - reset()     — reset về initialSeconds, không tự chạy
 */

interface CountDownProps {
    initialSeconds?: number;
    autoStart?: boolean;
    onExpire?: () => void;
}

export function useCountDown({
    initialSeconds = 60,
    autoStart = true,
    onExpire,
}: CountDownProps) {
    const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
    const [isRunning, setIsRunning] = useState(autoStart);
    const [isExpired, setIsExpired] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const onExpireRef = useRef<() => void>(onExpire);

    // Giữ ref của callback luôn mới nhất, tránh stale closure
    useEffect(() => {
        onExpireRef.current = onExpire;
    }, [onExpire]);

    const clearTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const start = useCallback(() => {
        clearTimer();
        setSecondsLeft(initialSeconds);
        setIsExpired(false);
        setIsRunning(true);
    }, [initialSeconds, clearTimer]);

    const stop = useCallback(() => {
        clearTimer();
        setIsRunning(false);
    }, [clearTimer]);

    const reset = useCallback(() => {
        clearTimer();
        setSecondsLeft(initialSeconds);
        setIsRunning(false);
        setIsExpired(false);
    }, [initialSeconds, clearTimer]);

    useEffect(() => {
        if (!isRunning) return;

        intervalRef.current = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearTimer();
                    setIsRunning(false);
                    setIsExpired(true);
                    onExpireRef.current?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return clearTimer;
    }, [isRunning, clearTimer]);

    const formatted = dayjs.duration(secondsLeft, 'seconds').format('mm:ss');

    return { formatted, secondsLeft, isRunning, isExpired, start, stop, reset };
}
