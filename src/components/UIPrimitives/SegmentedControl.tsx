import type { ReactElement } from 'react';

export type SegmentedOption<T extends string> = {
    value: T;
    label: string;
};

type SegmentedControlProps<T extends string> = {
    value: T;
    options: SegmentedOption<T>[];
    onChange: (value: T) => void;
    /** Accessible name of the group. */
    label: string;
    /** `sm`: property rows · `md`: toolbars. */
    size?: 'sm' | 'md';
    /** Stretch the segments to fill the available width. */
    fullWidth?: boolean;
};

/** Single-choice group of adjacent buttons (radio semantics). */
function SegmentedControl<T extends string>({
    value,
    options,
    onChange,
    label,
    size = 'sm',
    fullWidth = false,
}: SegmentedControlProps<T>): ReactElement {
    return (
        <div
            role="radiogroup"
            aria-label={label}
            className={[
                'inline-flex h-8 overflow-hidden rounded-md border border-neutral-30 bg-white',
                fullWidth ? 'w-full' : '',
            ].join(' ')}
        >
            {options.map((option, index) => {
                const isActive = option.value === value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        onClick={() => onChange(option.value)}
                        className={[
                            'text-sm transition-colors',
                            'focus-visible:ring-2 focus-visible:ring-primary-50/40 focus-visible:outline-none focus-visible:ring-inset',
                            size === 'md' ? 'w-22' : 'px-3',
                            fullWidth ? 'flex-1' : '',
                            index > 0 ? 'border-l border-neutral-30' : '',
                            isActive
                                ? 'bg-primary-10 font-semibold text-primary-80'
                                : 'font-medium text-neutral-60 hover:bg-neutral-20 hover:text-neutral-90',
                        ].join(' ')}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}

export default SegmentedControl;
