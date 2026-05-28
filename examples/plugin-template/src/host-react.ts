// Resolves `import ... from 'react'` to the HOST's React instance at runtime
// (build.mjs aliases 'react' to this file). Sharing one React instance is what
// makes hooks work across the host/plugin boundary.
/* eslint-disable @typescript-eslint/no-explicit-any */
const React = (globalThis as any).__PLUGIN_RUNTIME__.react;

export default React;
export const {
    createElement,
    Fragment,
    useState,
    useEffect,
    useRef,
    useMemo,
    useCallback,
    useContext
} = React;
