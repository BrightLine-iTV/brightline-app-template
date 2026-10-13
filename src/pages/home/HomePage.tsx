import { useState, type ReactElement } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

import {
    Badge,
    Button,
    Modal,
    SegmentedControl,
    Select,
    toast,
} from '../../components/UIPrimitives';
import { useCounterStore } from '../../store';

const VIEW_OPTIONS = [
    { value: 'grid', label: 'Grid' },
    { value: 'list', label: 'List' },
] as const;

const ENV_OPTIONS = [
    { value: 'dev', label: 'Development' },
    { value: 'staging', label: 'Staging' },
    { value: 'prod', label: 'Production' },
];

/**
 * Starter page doubling as a living style guide: every shared primitive in one
 * place. Replace it with the real first page of the app.
 */
function HomePage(): ReactElement {
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [env, setEnv] = useState('dev');
    const [modalOpen, setModalOpen] = useState(false);
    const count = useCounterStore((state) => state.count);
    const increment = useCounterStore((state) => state.increment);

    return (
        <main className="mx-auto flex min-h-full max-w-3xl flex-col gap-8 bg-canvas p-8">
            <header>
                <h1 className="text-xl font-semibold text-neutral-90">
                    BrightLine app template
                </h1>
                <p className="mt-1 text-sm text-neutral-60">
                    React 19 · TypeScript · Vite · Tailwind 4 · Zustand. Replace
                    this page with your app.
                </p>
            </header>

            <section className="flex flex-col gap-3">
                <h2 className="text-md font-semibold text-neutral-80">
                    Buttons
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant="primary"
                        leadingIcon={<PlusIcon className="size-4" />}
                    >
                        Primary
                    </Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="danger">Danger</Button>
                </div>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-md font-semibold text-neutral-80">
                    Badges
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="primary">Primary</Badge>
                    <Badge tone="success" shape="pill" dot>
                        Active
                    </Badge>
                    <Badge tone="warning" shape="pill" dot>
                        Draft
                    </Badge>
                    <Badge tone="error" shape="pill" dot>
                        Failed
                    </Badge>
                </div>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-md font-semibold text-neutral-80">
                    Inputs
                </h2>
                <div className="flex flex-wrap items-center gap-3">
                    <SegmentedControl
                        label="View"
                        value={view}
                        options={[...VIEW_OPTIONS]}
                        onChange={setView}
                    />
                    <div className="w-56">
                        <Select
                            ariaLabel="Environment"
                            value={env}
                            options={ENV_OPTIONS}
                            onChange={setEnv}
                        />
                    </div>
                </div>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-md font-semibold text-neutral-80">
                    Feedback
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                    <Button onClick={() => setModalOpen(true)}>
                        Open modal
                    </Button>
                    <Button
                        onClick={() =>
                            toast.success('Saved', {
                                description: 'All changes stored.',
                            })
                        }
                    >
                        Success toast
                    </Button>
                    <Button onClick={() => toast.error('Something went wrong')}>
                        Error toast
                    </Button>
                    <Button variant="primary" onClick={increment}>
                        Store count: {count}
                    </Button>
                </div>
            </section>

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Example dialog"
                description="Escape or a click outside closes it."
                size="md"
                footer={
                    <>
                        <Button onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => setModalOpen(false)}
                        >
                            Confirm
                        </Button>
                    </>
                }
            >
                <p className="text-sm text-neutral-70">
                    Modals render in a portal, trap focus and restore it on
                    close.
                </p>
            </Modal>
        </main>
    );
}

export default HomePage;
