import type { EquippedItemRecord } from '@/features/items/hooks/useItems';
import type { Gender } from '@/features/auth/constants/gender';
import { EquippedCharacterFigure } from '@/components/children/character/EquippedCharacterFigure';

interface CharacterStageProps {
    equippedItems: EquippedItemRecord[];
    gender: Gender;
}

export function CharacterStage({ equippedItems }: CharacterStageProps) {
    return (
        <div className="flex justify-center items-center mt-20">
            <EquippedCharacterFigure
                equippedItems={equippedItems}
                className="w-85"
            />
        </div>
    );
}
