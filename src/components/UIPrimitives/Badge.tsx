import type { ReactElement, ReactNode } from 'react';

export type BadgeTone =
    | 'primary'
    | 'secondary'
    | 'neutral'
    | 'dark'
    | 'warning'
    | 'success'
    | 'info'
    | 'error';

type BadgeProps = {
    tone?: BadgeTone;
    /** `tag`: squared label · `pill`: rounded status chip. */
    shape?: 'tag' | 'pill';
    /** Leading status dot. */
    dot?: boolean;
    /** Leading icon (replaces the dot). */
    icon?: ReactNode;
    title?: string;
    className?: string;
    children: ReactNode;
};

const TONE_CLASS_NAMES: Record<BadgeTone, { badge: string; dot: string }> = {
    primary: {
        badge: 'border-primary-40 bg-primary-10 text-primary-60',
        dot: 'bg-primary-60',
    },
    secondary: {
        badge: 'border-secondary-50 bg-secondary-10 text-secondary-50',
        dot: 'bg-secondary-50',
    },
    neutral: {
        badge: 'border-neutral-40 bg-neutral-20 text-neutral-60',
        dot: 'bg-neutral-50',
    },
    dark: {
        badge: 'border-neutral-80 bg-white text-neutral-80',
        dot: 'bg-neutral-80',
    },
    warning: {
        badge: 'border-warning-60 bg-warning-10 text-warning-60',
        dot: 'bg-warning-60',
    },
    success: {
        badge: 'border-success-60 bg-success-10 text-success-60',
        dot: 'bg-success-60',
    },
    info: {
        badge: 'border-tertiary-60 bg-tertiary-10 text-tertiary-60',
        dot: 'bg-tertiary-60',
    },
    error: {
        badge: 'border-error-50 bg-error-10 text-error-50',
        dot: 'bg-error-50',
    },
};

/** Tag / status pill of the design system ("Active", "Draft", "Saved"…). */
function Badge({
    tone = 'neutral',
    shape = 'tag',
    dot = false,
    icon,
    title,
    className = '',
    children,
}: BadgeProps): ReactElement {
    const styles = TONE_CLASS_NAMES[tone];

    return (
        <span
            title={title}
            className={[
                'inline-flex shrink-0 items-center gap-1.5 border px-2 font-semibold whitespace-nowrap',
                shape === 'pill'
                    ? 'h-5 rounded-full text-2xs'
                    : 'h-6 rounded text-xs',
                styles.badge,
                className,
            ].join(' ')}
        >
            {icon ??
                (dot ? (
                    <span
                        aria-hidden="true"
                        className={`size-1.5 rounded-full ${styles.dot}`}
                    />
                ) : null)}
            {children}
        </span>
    );
}

export default Badge;
