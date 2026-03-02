import {
    Dialog,
    DialogTrigger,
    Modal,
    ModalOverlay,
    Button,
  } from "react-aria-components";
  
  type RewardSummaryDialogProps = {
    amount: string;
    childName: string;
    date: string;
    onEdit?: () => void;
    onSubmit?: () => void;
  };
  
  export function RewardSummaryDialog({
    amount,
    childName,
    date,
    onEdit,
    onSubmit,
  }: RewardSummaryDialogProps) {
    return (
      <DialogTrigger>
        <Button className="px-4 py-2 rounded-lg bg-orange-500 text-white">
          Mở tóm tắt
        </Button>
  
        <ModalOverlay className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <Modal className="outline-none">
            <Dialog className="w-[420px] max-w-full rounded-2xl border border-orange-400 bg-[#F6E7C8] p-6 shadow-xl">
              {/* Title */}
              <h2 className="text-2xl font-semibold text-center mb-4">
                Tóm tắt
              </h2>
  
              {/* Summary box */}
              <div className="bg-amber-400 rounded-xl p-5 space-y-3 text-[15px]">
                <Row label="Số tiền thưởng:" value={amount} />
                <Row label="Dành cho con:" value={childName} />
                <Row label="Ngày:" value={date} />
              </div>
  
              {/* Actions */}
              <div className="flex gap-4 mt-6">
                <Button
                  onPress={onEdit}
                  className="flex-1 rounded-full border border-gray-400 bg-gray-200 py-2 font-medium"
                >
                  Chỉnh sửa
                </Button>
  
                <Button
                  onPress={onSubmit}
                  className="flex-1 rounded-full bg-orange-500 text-white py-2 font-medium"
                >
                  Gửi
                </Button>
              </div>
            </Dialog>
          </Modal>
        </ModalOverlay>
      </DialogTrigger>
    );
  }
  
  function Row({ label, value }: { label: string; value: string }) {
    return (
      <div className="flex justify-between">
        <span className="font-medium">{label}</span>
        <span>{value}</span>
      </div>
    );
  }