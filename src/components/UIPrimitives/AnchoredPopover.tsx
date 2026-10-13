import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type CSSProperties,
    type ReactElement,
    type ReactNode,
    type RefObject,
} from 'react';
import { createPortal } from 'react-dom';

type Align = 'start' | 'center' | 'end';

type AnchoredPopoverProps = {
    open: boolean;
    onClose: () => void;
    anchorRef: RefObject<HTMLElement | null>;
    /** Horizontal alignment against the anchor. Default `end` (right edges). */
    align?: Align;
    /** Gap between the anchor and the panel, in px. */
    offset?: number;
    /** Give the panel the anchor's width (select menus). */
    matchAnchorWidth?: boolean;
    children: ReactNode;
};

const VIEWPORT_PADDING = 8;

/**
 * Floating panel rendered in a portal under its anchor, so `overflow: hidden`
 * containers never clip it. Opens above the anchor when there is no room
 * below. Closes on outside pointer-down (the anchor excluded, it toggles
 * itself), Escape and window resize.
 */
function AnchoredPopover({
    open,
    onClose,
    anchorRef,
    align = 'end',
    offset = 6,
    matchAnchorWidth = false,
    children,
}: AnchoredPopoverProps): ReactElement | null {
    const panelRef = useRef<HTMLDivElement | null>(null);
    const [style, setStyle] = useState<CSSProperties | null>(null);
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    const place = useCallback((): void => {
        const anchor = anchorRef.current;

        if (!anchor) {
            return;
        }

        const rect = anchor.getBoundingClientRect();
        const panelHeight = panelRef.current?.offsetHeight ?? 0;
        const spaceBelow =
            window.innerHeight - rect.bottom - offset - VIEWPORT_PADDING;
        const spaceAbove = rect.top - offset - VIEWPORT_PADDING;
        const opensUp = panelHeight > spaceBelow && spaceAbove > spaceBelow;

        const next: CSSProperties = opensUp
            ? { bottom: window.innerHeight - rect.top + offset }
            : { top: rect.bottom + offset };

        if (matchAnchorWidth) {
            next.width = rect.width;
        }

        if (align === 'end') {
            next.right = Math.max(
                VIEWPORT_PADDING,
                window.innerWidth - rect.right
            );
        } else if (align === 'start') {
            next.left = Math.max(VIEWPORT_PADDING, rect.left);
        } else {
            next.left = rect.left + rect.width / 2;
            next.transform = 'translateX(-50%)';
        }

        setStyle(next);
    }, [align, anchorRef, matchAnchorWidth, offset]);

    // First pass positions below the anchor; the second one (after the panel
    // is measured) flips it above when it does not fit.
    useLayoutEffect(() => {
        // Re-measured on every open, before paint, so a stale position from
        // the previous open is never shown.
        if (open) {
            place();
        }
    }, [open, place]);

    useLayoutEffect(() => {
        if (open && style && panelRef.current) {
            const rect = panelRef.current.getBoundingClientRect();

            if (
                rect.bottom > window.innerHeight - VIEWPORT_PADDING &&
                style.top !== undefined
            ) {
                place();
            }
        }
    }, [open, place, style]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const handlePointerDown = (event: PointerEvent): void => {
            const target = event.target as Node;

            if (
                panelRef.current?.contains(target) ||
                anchorRef.current?.contains(target)
            ) {
                return;
            }

            onCloseRef.current();
        };

        const handleKeyDown = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                onCloseRef.current();
                anchorRef.current?.focus();
            }
        };

        const handleResize = (): void => onCloseRef.current();

        window.addEventListener('pointerdown', handlePointerDown);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('pointerdown', handlePointerDown);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('resize', handleResize);
        };
    }, [anchorRef, open]);

    if (!open) {
        return null;
    }

    return createPortal(
        <div
            ref={panelRef}
            className="fixed z-50"
            style={style ?? { top: 0, left: 0, visibility: 'hidden' }}
        >
            <div className="animate-popover-in">{children}</div>
        </div>,
        document.body
    );
}

export default AnchoredPopover;
