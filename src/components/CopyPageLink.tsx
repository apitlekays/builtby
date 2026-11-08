import { useState } from 'react';

interface CopyPageLinkProps {
  className: string;
  label?: string;
}

export function CopyPageLink({ className, label = 'Copy link to this page' }: CopyPageLinkProps) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const url = window.location.href;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setState('copied');
      window.setTimeout(() => setState('idle'), 2000);
    } catch {
      setState('failed');
    }
  };

  if (state === 'failed') {
    return (
      <label className="block text-sm text-body">
        Copy this address:
        <input
          readOnly
          value={url}
          onFocus={(event) => event.target.select()}
          className="mt-1 w-full min-h-11 px-3 rounded-md bg-background border border-border-bright text-foreground text-sm"
        />
      </label>
    );
  }

  return (
    <button type="button" onClick={copy} className={className}>
      {state === 'copied' ? 'Link copied' : label}
    </button>
  );
}
