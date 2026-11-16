import { statusLabels, type ProjectStatus } from '../data/projects';

const notOpenYet: ProjectStatus[] = ['closed-beta', 'coming-soon', 'in-development'];

// A filled green light marks what a visitor can use today, a hollow amber ring marks what is not open to them yet,
// and a grey square marks what has ended.
const tones = {
  open: { text: 'text-accent', light: 'rounded-full bg-accent ring-[3px] ring-accent/20' },
  pending: { text: 'text-pending', light: 'rounded-full border-2 border-pending' },
  ended: { text: 'text-muted-foreground', light: 'rounded-[1px] bg-muted-foreground' },
};

export function StatusTag({ status }: { status: ProjectStatus }) {
  const tone = status === 'retired' ? tones.ended : notOpenYet.includes(status) ? tones.pending : tones.open;

  return (
    <span className={`label inline-flex items-center gap-1.5 font-semibold whitespace-nowrap ${tone.text}`}>
      <span aria-hidden="true" className={`w-2 h-2 flex-shrink-0 ${tone.light}`} />
      {statusLabels[status]}
    </span>
  );
}
