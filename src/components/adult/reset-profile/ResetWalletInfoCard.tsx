import { Info } from 'lucide-react';

export function ResetWalletInfoCard() {
    return (
        <div className="rounded-lg border border-orange-200 bg-orange-100 p-4">
            <Info className="mb-2 size-5 text-orange-500" aria-hidden />
            <h3 className="mb-2 text-base font-bold text-orange-600">
                Cảnh báo: Đặt lại ví
            </h3>
            <div className="flex flex-col gap-1 text-sm text-tichtich-black">
                <p>
                    Khôi phục số tiền của 4 ngăn về bằng 0 để con chia tiền lại.
                </p>
                <p>Xoá hết các mục tiêu đang thực hiện</p>
                <p>Xóa tất cả phần thưởng đang chờ</p>
            </div>
        </div>
    );
}
