import { Info } from 'lucide-react';

export function MissionThreeTargetsNotice() {
    return (
        <div
            className="rounded-xl bg-tichtich-primary-200 px-4 py-3 text-white shadow-sm"
            role="status"
        >
            <div className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
                    <Info className="size-5" aria-hidden />
                </span>
                <div className="min-w-0 space-y-1">
                    <p className="text-sm font-bold leading-snug">
                        Bé đã có 3 mục tiêu
                    </p>
                    <p className="text-xs font-medium leading-snug text-white/95">
                        Hãy hỗ trợ bé hoàn thành trước khi giao thêm mục tiêu
                    </p>
                </div>
            </div>
        </div>
    );
}
