import type { ReactNode } from 'react';

// The dark bar that opens a rack, with a yellow index number.
export function SectionBar({ id, number, children }: { id?: string; number?: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3.5 px-4 py-3 rounded-t-md bg-bar text-on-bar">
      {number && (
        <span aria-hidden="true" className="font-mono font-semibold text-sm px-2 py-1 rounded bg-accent-solid text-on-accent">
          {number}
        </span>
      )}
      <h2 id={id} className="text-[22px] sm:text-[28px] font-extrabold tracking-tight leading-tight">
        {children}
      </h2>
    </div>
  );
}
