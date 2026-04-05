import { AnimatePresence, motion } from 'motion/react';
import { useLoadingStore } from '@/stores/useLoadingStore';

export function LoadingTichTich({ isLoading }: { isLoading?: boolean }) {
    const globalLoading = useLoadingStore((s) => s.globalLoading);
    const visible = isLoading ?? globalLoading;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    role="status"
                    aria-label="Loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-1000 flex items-center justify-center bg-black/20 backdrop-blur-xs"
                >
                    <div className="flex flex-col items-center gap-4 px-6 py-8">
                        <div className="size-[170px]">
                            <img
                                src="/pig-loading.svg"
                                alt=""
                                className="size-full object-contain"
                            />
                        </div>
                        <p className="text-base font-bold">Đang tải...</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
