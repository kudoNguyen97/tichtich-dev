import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/utils/cn';

const PIN_LENGTH = 4;

interface PinInputDisplayProps {
    pinLength: number;
    filledCount: number;
    error?: boolean;
    prompt: string;
    errorMessage?: string;
    shakeKey?: number;
    className?: string;
}

export function PinInputDisplay({
    pinLength = PIN_LENGTH,
    filledCount,
    error = false,
    prompt,
    errorMessage,
    shakeKey = 0,
    className,
}: PinInputDisplayProps) {
    return (
        <div className={cn('flex flex-col items-center gap-3', className)}>
            <p className="text-center text-lg font-bold text-tichtich-black">
                {prompt}
            </p>
            <motion.div
                key={shakeKey}
                animate={
                    error
                        ? {
                              x: [0, -8, 8, -8, 8, -4, 4, 0],
                              transition: { duration: 0.4 },
                          }
                        : {}
                }
                className="flex items-center justify-center gap-3"
            >
                {Array.from({ length: pinLength }).map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            'rounded-full transition-all duration-200',
                            i < filledCount
                                ? error
                                    ? 'bg-tichtich-red scale-110'
                                    : 'bg-tichtich-orange scale-110'
                                : 'bg-profile-pin-frame/20',
                            sizeClass(pinLength)
                        )}
                    />
                ))}
            </motion.div>
            <AnimatePresence>
                {error && errorMessage && (
                    <motion.p
                        key="error"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-sm font-medium text-tichtich-red"
                    >
                        {errorMessage}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}

function sizeClass(length: number): string {
    if (length <= 4) return 'size-3';
    if (length <= 6) return 'size-2.5';
    return 'size-2';
}
