// Public surface of the editor UI, consumed by the marketing site to embed a
// faithful (scaled-down) preview of the real editor. Only the presentational
// pieces are exported — NOT `editor.tsx`, which wires chrome storage/messaging.
export { Toolbar } from './Toolbar';
export { Canvas } from './Canvas';
export { SidePanel, type SendStatus } from './side-panel';
export { PALETTE, DEFAULT_COLOR, defaultFontSize, type Tool } from './annotations';
export type { Annotation, CapturePayload } from '../types';
