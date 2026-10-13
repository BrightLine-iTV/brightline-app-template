import type { ButtonHTMLAttributes, ReactElement, ReactNode, Ref } from 'react';

export type IconButtonVariant = 'ghost' | 'soft' | 'accent';
export type IconButtonSize = 'xs' | 'sm' | 'md';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    /** Accessible name, also used as the native tooltip. */
    label: string;
    variant?: IconButtonVariant;
    size?: IconButtonSize;
    /** Keeps the pressed look (open menus, active toggles). */
    pressed?: boolean;
    children: ReactNode;
    ref?: Ref<HTMLButtonElement>;
};

const VARIANT_CLASS_NAMES: Record<IconButtonVariant, string> = {
    ghost: 'text-neutral-60 hover:bg-neutral-20 hover:text-neutral-90',
    soft: 'bg-neutral-20 text-neutral-90 hover:bg-neutral-30',
    accent: 'bg-primary-10 text-primary-80 hover:bg-primary-20',
};

const SIZE_CLASS_NAMES: Record<IconButtonSize, string> = {
    xs: 'size-6 rounded',
    sm: 'size-7 rounded-md',
    md: 'size-9 rounded-md',
};

/** Square, icon-only button. */
function IconButton({
    label,
    variant = 'ghost',
    size = 'md',
    pressed = false,
    className = '',
    type = 'button',
    children,
    ref,
    ...buttonProps
}: IconButtonProps): ReactElement {
    return (
        <button
            ref={ref}
            type={type}
            aria-label={label}
            title={label}
            className={[
                'flex shrink-0 items-center justify-center transition-colors',
                'focus-visible:ring-2 focus-visible:ring-primary-50/40 focus-visible:outline-none',
                'disabled:cursor-not-allowed disabled:bg-transparent disabled:text-neutral-40',
                SIZE_CLASS_NAMES[size],
                pressed
                    ? 'bg-neutral-20 text-neutral-90'
                    : VARIANT_CLASS_NAMES[variant],
                className,
            ].join(' ')}
            {...buttonProps}
        >
            {children}
        </button>
    );
}

export default IconButton;
