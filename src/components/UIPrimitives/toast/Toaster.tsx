import { useEffect, useRef, useState, type ReactElement } from 'react';
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    InformationCircleIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

import { useToastStore, type ToastItem, type ToastVariant } from './toastStore';

const VARIANT_STYLES: Record<
    ToastVariant,
    { icon: typeof CheckCircleIcon; className: string }
> = {
    success: { icon: CheckCircleIcon, className: 'bg-success-40' },
    error: { icon: ExclamationCircleIcon, className: 'bg-error-50' },
    info: { icon: InformationCircleIcon, className: 'bg-primary-80' },
};

function Toast({ toast }: { toast: ToastItem }): ReactElement {
    const dismiss = useToastStore((state) => state.dismiss);
    const [isPaused, setIsPaused] = useState(false);
    const remainingRef = useRef(toast.duration);

    const { icon: Icon, className } = VARIANT_STYLES[toast.variant];

    // Auto-dismiss; hovering pauses the countdown.
    useEffect(() => {
        if (toast.duration <= 0 || isPaused) {
            return;
        }

        const startedAt = Date.now();
        const timer = window.setTimeout(
            () => dismiss(toast.id),
            remainingRef.current
        );

        return () => {
            window.clearTimeout(timer);
            remainingRef.current -= Date.now() - startedAt;
        };
    }, [dismiss, isPaused, toast.duration, toast.id]);

    return (
        <div
            role={toast.variant === 'error' ? 'alert' : 'status'}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className={`pointer-events-auto flex w-100 max-w-full animate-toast-in items-center gap-3 rounded-lg py-3.5 pr-3 pl-4 text-white shadow-popover ${className}`}
        >
            <Icon
                aria-hidden="true"
                className="size-8 shrink-0"
                strokeWidth={1.4}
            />

            <div className="min-w-0 flex-1">
                <p className="text-lg font-semibold">{toast.title}</p>
                {toast.description ? (
                    <p className="text-sm wrap-break-word text-white/90">
                        {toast.description}
                    </p>
                ) : null}
            </div>

            <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => dismiss(toast.id)}
                className="flex size-8 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
            >
                <XMarkIcon className="size-5" strokeWidth={1.8} />
            </button>
        </div>
    );
}

/**
 * Renders the toast queue as a centered column, newest closest to the bottom.
 * Mount it once (App.tsx); pass `className` to reposition it.
 */
function Toaster({ className = '' }: { className?: string }): ReactElement {
    const toasts = useToastStore((state) => state.toasts);

    return (
        <div
            aria-live="polite"
            className={`pointer-events-none flex flex-col items-center gap-2 ${className}`}
        >
            {toasts.map((item) => (
                <Toast key={item.id} toast={item} />
            ))}
        </div>
    );
}

export default Toaster;
