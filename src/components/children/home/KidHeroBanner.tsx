import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const formatMoney = (n: number) => n.toLocaleString('vi-VN');

const PIG_SRC: Record<'male' | 'female', string> = {
    male: '/pig-full-body-male.svg',
    female: '/pig-full-body-female.svg',
};

interface KidHeroBannerProps {
    kidName: string;
    totalBalance: number;
    gender: 'male' | 'female';
}

export function KidHeroBanner({
    kidName,
    totalBalance,
    gender,
}: KidHeroBannerProps) {
    const textPig = `Chia tiền là thêm đó nha ${kidName}!`;

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <section className="relative px-4 pb-6 pt-4 mt-20">
            <div className="flex">
                {/* Left: pig on floating island */}
                <div className="relative w-70 shrink-0">
                    <img
                        src="/images/home-kid/land-fly.png"
                        alt=""
                        className="w-full"
                    />
                    <img
                        src={PIG_SRC[gender]}
                        alt="Heo đất"
                        className="absolute bottom-[55%] left-1/2 w-30 -translate-x-1/2"
                    />
                </div>

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
                                            delay: i * 0.1,
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
