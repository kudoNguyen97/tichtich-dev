import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { MissionSuccessCard } from '@/components/adult/missions/MissionSuccessCard';
import type { Mission } from '@/features/missions/types/mission.type';
import { cn } from '@/utils/cn';

interface KidMissionCarouselSectionProps {
    missions: Mission[];
}

export function KidMissionCarouselSection({
    missions,
}: KidMissionCarouselSectionProps) {
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
        <section className="rounded-2xl border border-tichtich-primary-200 bg-tichtich-primary-300 p-4">
            <h2 className="text-base font-bold text-tichtich-black">
                Mục tiêu của con
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
                Đang thực hiện và đã hoàn thành
            </p>

            <div ref={emblaRef} className="mt-3 overflow-hidden">
                <div className="flex cursor-grab select-none active:cursor-grabbing">
                    {missions.map((mission) => (
                        <div key={mission.id} className="min-w-0 flex-[0_0_85%] pr-2">
                            <MissionSuccessCard mission={mission} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-2 flex items-center justify-center gap-1.5">
                {missions.map((mission, index) => (
                    <span
                        key={mission.id}
                        aria-hidden
                        className={cn(
                            'h-2 rounded-full transition-all duration-200',
                            index === selectedIndex
                                ? 'w-5 bg-tichtich-primary-200'
                                : 'w-2 bg-tichtich-primary-100'
                        )}
                    />
                ))}
            </div>
        </section>
    );
}
