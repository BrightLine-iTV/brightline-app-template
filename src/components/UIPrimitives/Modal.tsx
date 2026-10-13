import {
    useEffect,
    useId,
    useRef,
    type ReactElement,
    type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';

import IconButton from './IconButton';

type ModalProps = {
    open: boolean;
    onClose: () => void;
    title: ReactNode;
    /** Small line under the title. */
    description?: ReactNode;
    children: ReactNode;
    /** Right-aligned action row at the bottom. */
    footer?: ReactNode;
    /** Dialog width: sm 400 · md 480 · lg 560 · xl 640 · 2xl 720 (px). */
    size?: ModalSize;
    /** Hide the × button (e.g. confirmation dialogs). */
    hideCloseButton?: boolean;
    /** Role for assistive tech; confirmations use `alertdialog`. */
    role?: 'dialog' | 'alertdialog';
    /** Centered layout (icon above the title) for short confirmations. */
    align?: 'start' | 'center';
    /** Rendered above the title in the centered layout. */
    icon?: ReactNode;
    /** Footer buttons share the full width (always on in the centered layout). */
    stretchFooter?: boolean;
};

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const SIZE_CLASS_NAMES: Record<ModalSize, string> = {
    sm: 'max-w-100',
    md: 'max-w-120',
    lg: 'max-w-140',
    xl: 'max-w-160',
    '2xl': 'max-w-180',
};

const FOCUSABLE_SELECTOR =
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Centered dialog over a dimmed scrim, rendered in a portal.
 * Escape and a click on the scrim close it; Tab is kept inside; focus returns
 * to the previously focused element on close.
 */
function Modal({
    open,
    onClose,
    title,
    description,
    children,
    footer,
    size = 'lg',
    hideCloseButton = false,
    role = 'dialog',
    align = 'start',
    icon,
    stretchFooter = false,
}: ModalProps): ReactElement | null {
    const dialogRef = useRef<HTMLDivElement | null>(null);
    const onCloseRef = useRef(onClose);
    const titleId = useId();
    const descriptionId = useId();

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const previouslyFocused = document.activeElement as HTMLElement | null;
        const dialog = dialogRef.current;

        // Autofocus: an element marked data-autofocus, else the first control.
        const initial =
            dialog?.querySelector<HTMLElement>('[data-autofocus]') ??
            dialog?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
        initial?.focus();

        const handleKeyDown = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                event.stopPropagation();
                onCloseRef.current();
                return;
            }

            if (event.key !== 'Tab' || !dialog) {
                return;
            }

            const focusables = Array.from(
                dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
            );

            if (focusables.length === 0) {
                return;
            }

            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            previouslyFocused?.focus?.();
        };
    }, [open]);

    if (!open) {
        return null;
    }

    return createPortal(
        <div className="fixed inset-0 z-60 flex items-center justify-center p-6">
            <div
                aria-hidden="true"
                className="absolute inset-0 animate-fade-in bg-scrim/45 backdrop-blur-xs"
                onClick={onClose}
            />

            <div
                ref={dialogRef}
                role={role}
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={description ? descriptionId : undefined}
                className={`relative flex max-h-[calc(100vh-3rem)] w-full ${SIZE_CLASS_NAMES[size]} animate-dialog-in flex-col rounded-2xl bg-white shadow-dialog`}
            >
                <div
                    className={[
                        'flex shrink-0 gap-4 px-6 pb-4',
                        align === 'center'
                            ? 'flex-col items-center pt-7 text-center'
                            : 'items-start justify-between pt-5',
                    ].join(' ')}
                >
                    {align === 'center' && icon ? icon : null}

                    <div className="min-w-0">
                        <h2
                            id={titleId}
                            className="text-xl leading-6 font-semibold text-neutral-90"
                        >
                            {title}
                        </h2>
                        {description ? (
                            <p
                                id={descriptionId}
                                className="mt-1 text-sm leading-5 text-neutral-60"
                            >
                                {description}
                            </p>
                        ) : null}
                    </div>

                    {!hideCloseButton && align !== 'center' ? (
                        <IconButton
                            label="Close"
                            size="sm"
                            onClick={onClose}
                            className="-mr-2"
                        >
                            <XMarkIcon className="size-5" strokeWidth={1.8} />
                        </IconButton>
                    ) : null}
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-2">
                    {children}
                </div>

                {footer ? (
                    <div
                        className={[
                            'flex shrink-0 items-center gap-2 px-6 pt-4 pb-5',
                            align === 'center' || stretchFooter
                                ? '[&>*]:flex-1'
                                : 'justify-end',
                        ].join(' ')}
                    >
                        {footer}
                    </div>
                ) : (
                    <div className="h-4 shrink-0" />
                )}
            </div>
        </div>,
        document.body
    );
}

export default Modal;
