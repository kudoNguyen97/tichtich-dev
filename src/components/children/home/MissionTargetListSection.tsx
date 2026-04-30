import type React from 'react';
import type { Mission } from '@/features/missions/types/mission.type';
import { MissionTargetCard } from './MissionTargetCard';

interface MissionTargetListSectionProps {
    missions: Mission[];
    renderAppendAction?: (mission: Mission) => React.ReactNode;
}

export function MissionTargetListSection({
    missions,
    renderAppendAction,
}: MissionTargetListSectionProps) {
    return (
        <section>
            <h2 className="text-lg font-bold text-tichtich-black mb-3">
                Mục tiêu đang thực hiện
            </h2>

            {missions.length === 0 ? (
                <p className="bg-tichtich-primary-300 rounded-lg p-10 text-base text-muted-foreground text-center">
                    Chưa có mục tiêu mới
                </p>
            ) : (
                <div className="flex flex-col gap-3">
                    {missions.map((mission) => (
                        <MissionTargetCard
                            key={mission.id}
                            mission={mission}
                            appendAction={renderAppendAction?.(mission)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
