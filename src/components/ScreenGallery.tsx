import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { ProjectScreen } from '../data/projects';
import { SectionBar } from './SectionBar';

const controlClass =
  'inline-flex items-center justify-center gap-1 min-h-11 min-w-11 px-3 rounded-md border border-border-bright bg-surface text-foreground font-semibold hover:bg-surface-2 transition-colors';

export function ScreenViewer({ screens, index, onChange, onClose }: {
  screens: ProjectScreen[];
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const screen = screens[index];
  const hasMany = screens.length > 1;
  const step = (by: number) => onChange((index + by + screens.length) % screens.length);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-label="Screenshot viewer"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}
      onKeyDown={(event) => {
        if (!hasMany) return;
        if (event.key === 'ArrowRight') step(1);
        if (event.key === 'ArrowLeft') step(-1);
      }}
      className="w-[min(94vw,1400px)] max-w-none max-h-[94dvh] p-0 rounded-md bg-surface text-foreground border border-border-bright backdrop:bg-black/80"
    >
      <div className="p-3 sm:p-4 grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 text-sm text-body">
            {hasMany && `${index + 1} of ${screens.length}: `}
            {screen.caption}
          </p>
          <button type="button" autoFocus onClick={() => dialogRef.current?.close()} className={controlClass} aria-label="Close viewer">
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
        <img src={screen.src} alt={screen.caption} className="block mx-auto max-w-full max-h-[74dvh] w-auto h-auto" />
        {hasMany && (
          <div className="flex justify-between gap-3">
            <button type="button" onClick={() => step(-1)} className={controlClass}>
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              Previous
            </button>
            <button type="button" onClick={() => step(1)} className={controlClass}>
              Next
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}

function ScreenButton({ screen, onOpen, wide }: { screen: ProjectScreen; onOpen: () => void; wide?: boolean }) {
  return (
    <figure className="m-0 min-w-0">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`View larger: ${screen.caption}`}
        className="block w-full overflow-hidden border border-border bg-surface-2 cursor-zoom-in"
      >
        <img
          src={screen.src}
          alt=""
          loading={wide ? 'eager' : 'lazy'}
          className={wide ? 'block mx-auto max-w-full h-auto' : 'block w-full h-auto'}
        />
      </button>
      <figcaption className="mt-2 text-sm text-body">{screen.caption}</figcaption>
    </figure>
  );
}

export function LeadScreen({ screens, onOpen }: { screens: ProjectScreen[]; onOpen: (index: number) => void }) {
  if (screens.length === 0) return null;
  return <ScreenButton screen={screens[0]} onOpen={() => onOpen(0)} wide />;
}

export function MoreScreens({ screens, onOpen }: { screens: ProjectScreen[]; onOpen: (index: number) => void }) {
  if (screens.length < 2) return null;
  return (
    <section aria-labelledby="more-screens" className="mt-7">
      <SectionBar id="more-screens">More screens</SectionBar>
      <div className="rack rounded-t-none border-t-0 grid-cols-1 md:grid-cols-2">
        {screens.slice(1).map((screen, position) => (
          <div key={screen.src} className="bg-surface p-3.5 min-w-0">
            <ScreenButton screen={screen} onOpen={() => onOpen(position + 1)} />
          </div>
        ))}
        {screens.length % 2 === 0 && <div aria-hidden="true" className="hidden md:block bg-surface" />}
      </div>
    </section>
  );
}

