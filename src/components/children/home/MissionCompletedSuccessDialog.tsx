import { TichTichButton } from '@/components/common/TichTichButton';
import { TichTichModal } from '@/components/common/TichTichModal';
import type { Mission } from '@/features/missions/types/mission.type';
import completedPig from '@/assets/images/completed-pig.png';

interface MissionCompletedSuccessDialogProps {
    isOpen: boolean;
    mission: Mission | null;
    onClose: () => void;
    onGoCharacter: () => void;
}

export function MissionCompletedSuccessDialog({
    isOpen,
    mission,
    onClose,
    onGoCharacter,
}: MissionCompletedSuccessDialogProps) {
    return (
        <TichTichModal
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
            className="bg-transparent border-none"
        >
            {mission && (
                <div className="flex flex-col items-center text-center gap-4 pt-2">
                    <h2 className="text-4xl font-extrabold text-white">
                        Hoàn thành mục tiêu!
                    </h2>

                    <p className="text-base text-white">
                        Tuyệt vời! Bạn đã xong mục tiêu {mission.title}!
                    </p>
                    <div className="w-70 h-70 bg-tichtich-primary-300/80 rounded-lg">
                        <img
                            className="w-full h-full object-contain p-8"
                            src={completedPig}
                            alt="Hoàn thành mục tiêu"
                        />
                    </div>

                    <p className="text-3xl text-white">Bạn nhận được</p>

                    <div className="flex items-center justify-center gap-2">
                        <span className="text-5xl font-extrabold text-tichtich-primary-200 tabular-nums">
                            {mission.rewardPoint}
                        </span>
                        <img
                            src="/icons/target-mission/star.svg"
                            alt="Sao thưởng"
                            className="h-10 w-10"
                        />
                    </div>

                    <div className="flex flex-col gap-3 w-full pt-2">
                        <TichTichButton
                            variant="primary"
                            size="md"
                            fullWidth
                            onClick={onGoCharacter}
                        >
                            Nhân vật
                        </TichTichButton>
                        <TichTichButton
                            variant="outline"
                            size="md"
                            fullWidth
                            onClick={onClose}
                        >
                            Đóng
                        </TichTichButton>
                    </div>
                </div>
            )}
        </TichTichModal>
    );
}
