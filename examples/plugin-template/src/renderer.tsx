// Renderer side: built as an IIFE (dist/renderer.js) and injected by the host.
// It grabs the host runtime, defines a panel using the host's React, and
// registers itself. Inline styles are used so it renders without the host's
// Tailwind having scanned these classes.
import React, { useState } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */
const runtime = (globalThis as any).__PLUGIN_RUNTIME__;

function HelloPanel() {
    const [pong, setPong] = useState<number | null>(null);

    const ping = async () => {
        const res = (await runtime.invoke('hello-world:ping')) as { pong: number } | undefined;
        setPong(res?.pong ?? null);
    };

    return (
        <div style={{ padding: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 8px' }}>Hello from a plugin</h2>
            <p style={{ fontSize: 13, opacity: 0.7, margin: '0 0 16px' }}>
                This whole tab is loaded at runtime from an installed git repo.
            </p>
            <button
                type="button"
                onClick={ping}
                style={{
                    height: 36,
                    padding: '0 14px',
                    borderRadius: 8,
                    border: 'none',
                    background: '#4f46e5',
                    color: '#fff',
                    fontSize: 14,
                    cursor: 'pointer'
                }}
            >
                Ping main process
            </button>
            {pong !== null && (
                <p style={{ fontSize: 13, marginTop: 12 }}>
                    pong @ {new Date(pong).toLocaleTimeString()}
                </p>
            )}
        </div>
    );
}

runtime.register({
    id: 'hello-world',
    label: 'Hello',
    description: 'Example external plugin',
    icon: 'Star',
    Panel: HelloPanel
});
