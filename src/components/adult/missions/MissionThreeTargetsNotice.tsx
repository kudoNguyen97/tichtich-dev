import { Info } from 'lucide-react';

export function MissionThreeTargetsNotice() {
    return (
        <div
            className="rounded-lg bg-tichtich-primary-100 px-4 py-3 text-white"
            role="status"
        >
            <div className="min-w-0 space-y-1">
                <span className="inline-block">
                    <Info className=" text-tichtich-black" aria-hidden />
                </span>
                <p className="text-sm font-bold leading-snug text-tichtich-black">
                    Bé đã có 3 mục tiêu
                </p>
                <p className="text-xs font-medium leading-snug text-tichtich-black">
                    Hãy hỗ trợ bé hoàn thành trước khi giao thêm mục tiêu
                </p>
            </div>
        </div>
    );
}
