import { Suspense, lazy, type ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Toaster } from './components/UIPrimitives';

// One lazy chunk per page keeps the first load small.
const HomePage = lazy(() => import('./pages/home'));

function App(): ReactElement {
    return (
        <>
            <Suspense
                fallback={<div className="p-6 text-neutral-60">Loading…</div>}
            >
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="*" element={<HomePage />} />
                </Routes>
            </Suspense>
            <Toaster />
        </>
    );
}

export default App;
