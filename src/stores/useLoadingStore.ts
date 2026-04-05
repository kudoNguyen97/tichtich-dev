import { create } from 'zustand';

type LoadingStore = {
    globalLoading: boolean;
    setGlobalLoading: (val: boolean) => void;
};

export const useLoadingStore = create<LoadingStore>((set) => ({
    globalLoading: false,
    setGlobalLoading: (val) => set({ globalLoading: val }),
}));
