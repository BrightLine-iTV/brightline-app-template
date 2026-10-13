/**
 * App-wide notification queue.
 *
 * Call `toast.success(title, { description })` (or `error` / `info`) from
 * anywhere — components, hooks or store actions — and mount `<Toaster />` once
 * where the notifications should appear.
 */

import { create } from 'zustand';

export type ToastVariant = 'success' | 'error' | 'info';

export type ToastOptions = {
    description?: string;
    /** Milliseconds before auto-dismiss; 0 keeps it until closed. Default 4500. */
    duration?: number;
};

export type ToastItem = {
    id: number;
    variant: ToastVariant;
    title: string;
    description?: string;
    duration: number;
};

const DEFAULT_DURATION = 4500;
/** Older toasts are dropped beyond this many. */
const MAX_VISIBLE = 3;

type ToastState = {
    toasts: ToastItem[];
    push: (toast: Omit<ToastItem, 'id'>) => number;
    dismiss: (id: number) => void;
};

let nextId = 1;

export const useToastStore = create<ToastState>()((set) => ({
    toasts: [],
    push: (toast) => {
        const id = nextId++;

        set((state) => ({
            toasts: [...state.toasts, { ...toast, id }].slice(-MAX_VISIBLE),
        }));

        return id;
    },
    dismiss: (id) => {
        set((state) => ({
            toasts: state.toasts.filter((toast) => toast.id !== id),
        }));
    },
}));

function show(
    variant: ToastVariant,
    title: string,
    options: ToastOptions = {}
): number {
    return useToastStore.getState().push({
        variant,
        title,
        description: options.description,
        duration: options.duration ?? DEFAULT_DURATION,
    });
}

export const toast = {
    success: (title: string, options?: ToastOptions) =>
        show('success', title, options),
    error: (title: string, options?: ToastOptions) =>
        show('error', title, options),
    info: (title: string, options?: ToastOptions) =>
        show('info', title, options),
    dismiss: (id: number) => useToastStore.getState().dismiss(id),
};
