import { Star } from 'lucide-react';
import { TichTichModal } from '@/components/common/TichTichModal';
import { TichTichButton } from '@/components/common/TichTichButton';

const MAX = 200;

interface Props {
    points: number;
    kidName: string;
    open: boolean;
    onClose: () => void;
    onViewRareItems: () => void;
}

export function PointsInfoModal({
    points,
    kidName,
    open,
    onClose,
    onViewRareItems,
}: Props) {
    const unlocked = points >= MAX;
    const pct = Math.min(100, (points / MAX) * 100);
    const formattedPoints = points.toLocaleString('vi-VN');

    return (
        <TichTichModal
            isOpen={open}
            onClose={onClose}
            size="lg"
            title={`Ngôi Sao "Tích Tích"`}
            footer={
                unlocked ? (
                    <div className="flex flex-col gap-2 w-full">
                        <TichTichButton
                            variant="primary"
                            fullWidth
                            onPress={onViewRareItems}
                        >
                            Xem bộ đồ hiếm
                        </TichTichButton>
                        <TichTichButton
                            variant="outline"
                            fullWidth
                            onPress={onClose}
                        >
                            Đóng
                        </TichTichButton>
                    </div>
                ) : (
                    <TichTichButton
                        variant="primary"
                        fullWidth
                        onPress={onClose}
                    >
                        Đồng ý
                    </TichTichButton>
                )
            }
        >
            <div className="flex flex-col items-center gap-3 text-center">
                {/* Points pill */}
                <div className="inline-flex items-center gap-2 rounded-full border border-tichtich-primary-200 bg-white px-5 py-2">
                    <span className="text-2xl font-extrabold tabular-nums text-foreground">
                        {formattedPoints}
                    </span>
                    <Star className="size-5 fill-tichtich-primary-200 text-tichtich-primary-200" />
                </div>

                {/* Main message */}
                <p className="text-base font-semibold text-foreground">
                    {unlocked
                        ? `Wow! ${kidName} đã đạt được mốc 200 sao rồi! ✨`
                        : `${kidName} biết không? Có bộ đồ siêu đặc biệt đang chờ bạn!`}
                </p>

                {/* Sub message */}
                <p className="text-sm text-muted-foreground">
                    {unlocked
                        ? `${kidName} đã có thể đổi được bất cứ món đồ nào ${kidName} thích, cùng khám phá nhé!`
                        : 'Cần 200 sao để mở khoá bộ đồ hiếm. Tích từng chút là được đó con!'}
                </p>

                {/* Progress section */}
                <div className="w-full">
                    <div className="mb-1.5 flex items-center gap-1 text-sm font-semibold text-foreground">
                        <span>{formattedPoints}</span>
                        <Star className="size-3.5 fill-tichtich-primary-200 text-tichtich-primary-200" />
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                            className="h-full rounded-full bg-tichtich-primary-200 transition-all duration-500"
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                </div>
            </div>
        </TichTichModal>
    );
}
