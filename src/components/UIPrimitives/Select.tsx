import {
    useEffect,
    useId,
    useRef,
    useState,
    type CSSProperties,
    type KeyboardEvent,
    type ReactElement,
} from 'react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';

import AnchoredPopover from './AnchoredPopover';

export type SelectOption = {
    value: string;
    label: string;
    /** Inline style for the option label (e.g. a font preview). */
    labelStyle?: CSSProperties;
};

type SelectProps = {
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    /** Accessible name when there is no visible label. */
    ariaLabel?: string;
    /** Called when the menu opens (e.g. to lazy-load font previews). */
    onOpen?: () => void;
    className?: string;
};

/**
 * Custom select (listbox) following the form-controls design: bordered
 * trigger with a chevron, a floating menu with a highlighted row and a check
 * on the selected option. Keyboard: ↑ ↓ Home End to move, Enter / Space to
 * pick, Escape or Tab to close.
 */
function Select({
    value,
    options,
    onChange,
    placeholder = 'Select an option',
    disabled = false,
    ariaLabel,
    onOpen,
    className = '',
}: SelectProps): ReactElement {
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const listRef = useRef<HTMLUListElement | null>(null);
    const listId = useId();
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const selectedIndex = options.findIndex((option) => option.value === value);
    const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

    useEffect(() => {
        if (isOpen) {
            listRef.current
                ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
                ?.scrollIntoView({ block: 'nearest' });
        }
    }, [activeIndex, isOpen]);

    const open = (): void => {
        if (disabled || options.length === 0) {
            return;
        }

        setActiveIndex(Math.max(selectedIndex, 0));
        setIsOpen(true);
        onOpen?.();
    };

    const close = (): void => {
        setIsOpen(false);
    };

    const pick = (index: number): void => {
        const option = options[index];

        if (option) {
            onChange(option.value);
        }

        close();
        triggerRef.current?.focus();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
        if (!isOpen) {
            if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
                event.preventDefault();
                open();
            }
            return;
        }

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                setActiveIndex((index) =>
                    Math.min(index + 1, options.length - 1)
                );
                break;
            case 'ArrowUp':
                event.preventDefault();
                setActiveIndex((index) => Math.max(index - 1, 0));
                break;
            case 'Home':
                event.preventDefault();
                setActiveIndex(0);
                break;
            case 'End':
                event.preventDefault();
                setActiveIndex(options.length - 1);
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                pick(activeIndex);
                break;
            case 'Tab':
                close();
                break;
            default:
                break;
        }
    };

    return (
        <>
            <button
                ref={triggerRef}
                type="button"
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={isOpen ? listId : undefined}
                aria-label={ariaLabel}
                disabled={disabled}
                onClick={() => (isOpen ? close() : open())}
                onKeyDown={handleKeyDown}
                className={[
                    'flex h-8 w-full min-w-0 items-center gap-2 rounded-md border bg-white pr-2 pl-2.5 text-left text-sm transition-colors',
                    'focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-neutral-20 disabled:text-neutral-40',
                    isOpen
                        ? 'border-primary-50 ring-2 ring-primary-50/20'
                        : 'border-neutral-30 hover:border-neutral-40 focus-visible:border-primary-50 focus-visible:ring-2 focus-visible:ring-primary-50/20',
                    className,
                ].join(' ')}
            >
                <span
                    className={`min-w-0 flex-1 truncate ${selected ? 'text-neutral-90' : 'text-neutral-50'}`}
                    style={selected?.labelStyle}
                >
                    {selected?.label ?? placeholder}
                </span>
                <ChevronDownIcon
                    aria-hidden="true"
                    className={`size-4 shrink-0 text-neutral-60 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <AnchoredPopover
                open={isOpen}
                onClose={close}
                anchorRef={triggerRef}
                align="start"
                offset={4}
                matchAnchorWidth
            >
                <ul
                    ref={listRef}
                    id={listId}
                    role="listbox"
                    aria-label={ariaLabel}
                    className="max-h-64 overflow-y-auto rounded-md border border-neutral-30 bg-white py-1 shadow-popover"
                >
                    {options.map((option, index) => {
                        const isSelected = index === selectedIndex;
                        const isActive = index === activeIndex;

                        return (
                            <li
                                key={option.value}
                                role="option"
                                data-index={index}
                                aria-selected={isSelected}
                                onMouseEnter={() => setActiveIndex(index)}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => pick(index)}
                                className={[
                                    'flex h-9 cursor-pointer items-center gap-2 px-3 text-sm',
                                    isActive ? 'bg-primary-10' : '',
                                    isSelected
                                        ? 'text-primary-60'
                                        : 'text-neutral-90',
                                ].join(' ')}
                            >
                                <span
                                    className="min-w-0 flex-1 truncate"
                                    style={option.labelStyle}
                                >
                                    {option.label}
                                </span>
                                {isSelected ? (
                                    <CheckIcon
                                        aria-hidden="true"
                                        className="size-4 shrink-0"
                                    />
                                ) : null}
                            </li>
                        );
                    })}
                </ul>
            </AnchoredPopover>
        </>
    );
}

export default Select;
