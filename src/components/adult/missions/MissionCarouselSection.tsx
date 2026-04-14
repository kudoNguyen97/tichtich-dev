import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { MissionSuccessCard } from '@/components/adult/missions/MissionSuccessCard';
import type { Mission } from '@/features/missions/types/mission.type';
import { cn } from '@/utils/cn';

interface MissionCarouselSectionProps {
    missions: Mission[];
}

export function MissionCarouselSection({
    missions,
}: MissionCarouselSectionProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: 'start',
        containScroll: 'trimSnaps',
    });
    const [selectedIndex, setSelectedIndex] = useState(0);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on('select', onSelect);
        onSelect();
        return () => {
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi, onSelect]);

    useEffect(() => {
        if (!missions.length) {
            setSelectedIndex(0);
            return;
        }
        setSelectedIndex((prev) => Math.min(prev, missions.length - 1));
    }, [missions.length]);

    if (!missions.length) {
        return null;
    }

    return (
        <section className="mb-4 rounded-lg bg-tichtich-primary-300 p-4">
            <h2 className="text-base font-semibold text-tichtich-black">
                Mục tiêu đang thực hiện
            </h2>
            <div ref={emblaRef} className="mt-3 overflow-hidden">
                <div className="flex select-none cursor-grab active:cursor-grabbing">
                    {missions.map((mission) => (
                        <div
                            key={mission.id}
                            className="min-w-0 flex-[0_0_84%] pr-2"
                        >
                            <MissionSuccessCard mission={mission} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-2 flex items-center justify-center gap-1.5">
                {missions.map((mission, index) => (
                    <span
                        key={mission.id}
                        className={cn(
                            'h-2 rounded-full transition-all duration-200',
                            index === selectedIndex
                                ? 'w-5 bg-tichtich-primary-200'
                                : 'w-2 bg-tichtich-primary-100'
                        )}
                        aria-hidden
                    />
                ))}
            </div>
        </section>
    );
}
