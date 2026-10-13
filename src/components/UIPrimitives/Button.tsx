import type { ButtonHTMLAttributes, ReactElement, ReactNode, Ref } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    /** Icon rendered before the label (e.g. a plus). */
    leadingIcon?: ReactNode;
    /** Icon rendered after the label (e.g. a chevron). */
    trailingIcon?: ReactNode;
    /** Keeps the pressed look (open menus, active toggles). */
    pressed?: boolean;
    fullWidth?: boolean;
    ref?: Ref<HTMLButtonElement>;
};

const VARIANT_CLASS_NAMES: Record<
    ButtonVariant,
    { base: string; pressed: string }
> = {
    primary: {
        base: 'bg-primary-50 text-white hover:bg-primary-80 disabled:bg-neutral-20 disabled:text-neutral-40',
        pressed: 'bg-primary-80 text-white',
    },
    secondary: {
        base: 'border border-neutral-30 bg-white text-neutral-90 hover:border-primary-50 hover:bg-primary-10 hover:text-primary-80 disabled:border-neutral-30 disabled:bg-neutral-20 disabled:text-neutral-40',
        pressed: 'border border-primary-50 bg-primary-10 text-primary-80',
    },
    danger: {
        base: 'bg-error-50 text-white hover:bg-error-60 disabled:bg-neutral-20 disabled:text-neutral-40',
        pressed: 'bg-error-60 text-white',
    },
    ghost: {
        base: 'text-neutral-90 hover:bg-neutral-20 disabled:text-neutral-40',
        pressed: 'bg-primary-10 text-primary-80',
    },
};

const SIZE_CLASS_NAMES: Record<ButtonSize, string> = {
    sm: 'h-8 gap-1.5 px-3 text-sm',
    md: 'h-9 gap-2 px-4 text-sm',
};

/** Standard text button of the design system (primary, secondary, danger, ghost). */
function Button({
    variant = 'secondary',
    size = 'md',
    leadingIcon,
    trailingIcon,
    pressed = false,
    fullWidth = false,
    className = '',
    type = 'button',
    children,
    ref,
    ...buttonProps
}: ButtonProps): ReactElement {
    const styles = VARIANT_CLASS_NAMES[variant];

    return (
        <button
            ref={ref}
            type={type}
            className={[
                'inline-flex shrink-0 items-center justify-center rounded-lg font-semibold transition-colors',
                'focus-visible:ring-2 focus-visible:ring-primary-50/40 focus-visible:ring-offset-1 focus-visible:outline-none',
                'disabled:cursor-not-allowed',
                SIZE_CLASS_NAMES[size],
                pressed ? styles.pressed : styles.base,
                fullWidth ? 'w-full' : '',
                className,
            ].join(' ')}
            {...buttonProps}
        >
            {leadingIcon}
            {children}
            {trailingIcon}
        </button>
    );
}

export default Button;
