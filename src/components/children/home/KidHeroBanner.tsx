import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import type { EquippedItemRecord } from '@/features/items/hooks/useItems';
import type { Gender } from '@/features/auth/constants/gender';
import { EquippedCharacterFigure } from '@/components/children/character/EquippedCharacterFigure';
import { useNavigate } from '@tanstack/react-router';
import { ANIMATION_DURATION_S } from '@/constants/timing';

const formatMoney = (n: number) => n.toLocaleString('vi-VN');

interface KidHeroBannerProps {
    kidName: string;
    totalBalance: number;
    gender: Gender;
    equippedItems: EquippedItemRecord[];
}

export function KidHeroBanner({
    kidName,
    totalBalance,
    equippedItems,
}: KidHeroBannerProps) {
    const textPig = `Chia tiền là thêm đó nha ${kidName}!`;
    const navigate = useNavigate();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <section className="relative px-4 pb-6 pt-4 mt-20">
            <div className="flex">
                {/* Left: pig with equipped items on floating island */}
                <EquippedCharacterFigure
                    equippedItems={equippedItems}
                    className="w-70 shrink-0 cursor-pointer"
                    onClick={() => navigate({ to: '/children/character' })}
                />

                {/* Right: speech bubble + name + balance */}
                <div className="flex min-w-0 flex-1 flex-col items-start gap-2 pb-4">
                    {/* Speech bubble */}
                    <div className="relative rounded-lg bg-tichtich-primary-100 px-4 py-2 w-full">
                        <div className="flex flex-row items-start w-full">
                            <AnimatePresence>
                                {textPig.split('').map((char, i) => (
                                    <motion.p
                                        ref={ref}
                                        key={i}
                                        initial={{ opacity: 0, x: -18 }}
                                        animate={
                                            isInView ? { opacity: 1, x: 0 } : {}
                                        }
                                        exit="hidden"
                                        transition={{
                                            duration: 0.5,
                                            delay:
                                                i *
                                                ANIMATION_DURATION_S.STAGGER_STEP,
                                        }}
                                        className="text-base text-start font-bold tracking-tighter"
                                    >
                                        {char === ' ' ? (
                                            <span>&nbsp;</span>
                                        ) : (
                                            char
                                        )}
                                    </motion.p>
                                ))}
                            </AnimatePresence>
                        </div>
                        {/* Tail pointing left */}
                        <div className="absolute -left-2 top-1/2 h-0 w-0 -translate-y-1/2 border-y-10 border-r-10 border-l-0 border-y-transparent border-r-tichtich-primary-100" />
                    </div>

                    <div className="flex flex-col items-start gap-1 bg-tichtich-primary-300 rounded-lg p-4 w-full">
                        <p className="text-sm font-bold text-tichtich-black">
                            Heo đất của {kidName}
                        </p>
                        <p className="text-2xl font-extrabold text-tichtich-primary-200">
                            {formatMoney(totalBalance)} đ
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
