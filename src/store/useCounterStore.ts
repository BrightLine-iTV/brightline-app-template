/**
 * Example Zustand store: delete it once the app has a real one.
 *
 * Conventions: one store per domain (`use<Name>Store.ts`), state and actions in
 * the same typed object, components select only the slice they need
 * (`useCounterStore((s) => s.count)`) so unrelated updates don't re-render them.
 */
import { create } from 'zustand';

type CounterState = {
    count: number;
    increment: () => void;
    reset: () => void;
};

export const useCounterStore = create<CounterState>()((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    reset: () => set({ count: 0 }),
}));
