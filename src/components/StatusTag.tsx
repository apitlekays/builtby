import { statusLabels, type ProjectStatus } from '../data/projects';

const notOpenYet: ProjectStatus[] = ['closed-beta', 'coming-soon', 'in-development'];

// A filled green light marks what a visitor can use today, a hollow amber ring marks what is not open to them yet.
export function StatusTag({ status }: { status: ProjectStatus }) {
  const pending = notOpenYet.includes(status);

  return (
    <span className={`label inline-flex items-center gap-1.5 font-semibold whitespace-nowrap ${pending ? 'text-pending' : 'text-accent'}`}>
      <span
        aria-hidden="true"
        className={`w-2 h-2 rounded-full flex-shrink-0 ${pending ? 'border-2 border-pending' : 'bg-accent ring-[3px] ring-accent/20'}`}
      />
      {statusLabels[status]}
    </span>
  );
}
