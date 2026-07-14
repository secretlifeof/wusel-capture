import { type IconComponent, ArrowsOutSimple, Maximize2, MonitorIcon } from '@wusel-capture/icons';
import { useState } from 'react';

import { cn } from '../lib/cn';
import type { CaptureMode, CaptureRequest } from '../types';
import { WuselMark } from './wusel-mark';

interface ModeDef {
  mode: CaptureMode;
  label: string;
  description: string;
  icon: IconComponent;
}

const MODES: ModeDef[] = [
  {
    mode: 'fullpage',
    label: 'Full page',
    description: 'The entire page',
    icon: ArrowsOutSimple,
  },
  {
    mode: 'viewport',
    label: 'Visible area',
    description: 'Only what is currently visible',
    icon: MonitorIcon,
  },
  {
    mode: 'region',
    label: 'Select region',
    description: 'Drag a rectangle with the mouse',
    icon: Maximize2,
  },
];

export function Popup() {
  const [busy, setBusy] = useState<CaptureMode | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function startCapture(mode: CaptureMode) {
    setError(null);
    setBusy(mode);
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id || tab.windowId == null) throw new Error('No active tab found.');

      const request: CaptureRequest = {
        type: 'CAPTURE',
        mode,
        tabId: tab.id,
        windowId: tab.windowId,
      };
      const res = (await chrome.runtime.sendMessage(request)) as
        | { ok: true }
        | { ok: false; error: string }
        | undefined;

      // On success the editor tab steals focus and this popup closes itself.
      if (res && res.ok === false) throw new Error(res.error);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setBusy(null);
    }
  }

  return (
    <div className="flex w-80 flex-col gap-3 p-4">
      <header className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <WuselMark className="size-5" />
        </span>
        <p className="text-sm font-medium text-foreground">Wusel Capture</p>
      </header>

      <div className="flex flex-col gap-2">
        {MODES.map(({ mode, label, description, icon: Icon }) => (
          <button
            key={mode}
            type="button"
            disabled={busy !== null}
            onClick={() => startCapture(mode)}
            className={cn(
              'group flex items-center gap-3 rounded-md border border-secondary bg-white px-3 py-2.5 text-left',
              'transition-colors hover:bg-button-hover-bg hover:text-button-hover-foreground',
              'disabled:pointer-events-none disabled:opacity-60',
              busy === mode && 'bg-button-hover-bg text-button-hover-foreground',
            )}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sand-100 text-foreground group-hover:bg-white/30">
              <Icon className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium">{label}</span>
              <span className="block truncate text-xs text-muted-foreground group-hover:text-button-hover-foreground/80">
                {description}
              </span>
            </span>
          </button>
        ))}
      </div>

      {error && (
        <p className="rounded-sm bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
