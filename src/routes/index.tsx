import { useLoadingStore } from '@/stores/useLoadingStore';
import { RewardSummaryDialog } from '@/components/DialogTest';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({ component: App });
function App() {
    return (
        <main className="page-wrap px-4 pb-8 pt-14">
            <RewardSummaryDialog
                amount="230.000 đ"
                childName="Quốc Bảo"
                date="29/08/2025"
                onEdit={() => console.log('edit')}
                onSubmit={() => console.log('submit')}
            />

            <button onClick={() => useLoadingStore.getState().show()}>
                Show Loading
            </button>
        </main>
    );
}
