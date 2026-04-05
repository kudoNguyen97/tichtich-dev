export interface RewardCard {
    id: string;
    amount: number;
    message: string;
}

export function RewardCardItem({ reward }: { reward: RewardCard }) {
    return (
        <div className="bg-tichtich-primary-300 h-[120px] rounded-xl p-5 border border-tichtich-primary-200">
            <p className="text-base font-bold text-tichtich-black mb-1">
                Phần thưởng: {reward.amount.toLocaleString('vi-VN')} đ
            </p>
            <p className="text-base font-bold text-tichtich-black">
                {reward.message}
            </p>
        </div>
    );
}
