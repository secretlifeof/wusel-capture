import { Check, Copy } from '@wusel-capture/icons';
import { useState } from 'react';

export function CommandBlock({ command, label }: { command: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — ignore.
    }
  };

  return (
    <div>
      {label ? <p className="mb-2 text-sm font-medium text-white/70 text-center">{label}</p> : null}
      <div className="flex items-center gap-3 rounded-md border border-white/15 bg-lavender-700/50 px-4 py-3">
        <code className="flex-1 truncate font-mono text-sm text-white/90">
          <span className="select-none text-white/40">$ </span>
          {command}
        </code>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? 'Copied' : 'Copy command'}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </button>
      </div>
    </div>
  );
}
