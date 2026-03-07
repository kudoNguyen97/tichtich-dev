import { useCountDown } from '@/hooks/useCountDown';
import { cn } from '@/utils/cn';

/**
 * CountDown — Hiển thị đếm ngược (vd: OTP resend)
 *
 * Chế độ uncontrolled (mặc định): tự quản lý timer với initialSeconds, autoStart, onExpire.
 * Chế độ controlled: truyền formatted + isExpired từ parent (cùng useCountDown) để đồng bộ với nút "Gửi lại".
 */
interface CountDownProps {
    /** Chế độ controlled: giá trị hiển thị từ parent */
    formatted?: string;
    /** Chế độ controlled: đã hết giờ chưa */
    isExpired?: boolean;
    /** Chế độ uncontrolled: số giây đếm ngược (mặc định 60) */
    initialSeconds?: number;
    /** Chế độ uncontrolled: tự start khi mount (mặc định true) */
    autoStart?: boolean;
    /** Chế độ uncontrolled: callback khi hết giờ */
    onExpire?: () => void;
    className?: string;
}

export default function CountDown({
    formatted: controlledFormatted,
    isExpired: controlledExpired,
    initialSeconds = 60,
    autoStart = true,
    onExpire,
    className = '',
}: CountDownProps) {
    const isControlled =
        controlledFormatted !== undefined && controlledExpired !== undefined;

    const uncontrolled = useCountDown({
        initialSeconds,
        autoStart: isControlled ? false : autoStart,
        onExpire,
    });

    const formatted = isControlled
        ? controlledFormatted
        : uncontrolled.formatted;
    const isExpired = isControlled ? controlledExpired : uncontrolled.isExpired;

    return (
        <span
            className={cn(
                'font-mono font-semibold tabular-nums tracking-widest',
                isExpired ? 'text-red-500' : 'text-gray-800',
                className
            )}
        >
            {formatted}
        </span>
    );
}
