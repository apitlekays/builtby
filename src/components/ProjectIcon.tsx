import type { Project } from '../data/projects';

interface ProjectIconProps {
  project: Project;
  size: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'w-8 h-8 rounded-md',
  md: 'w-14 h-14 rounded-lg',
  lg: 'w-20 h-20 sm:w-24 sm:h-24 rounded-xl',
};

export function ProjectIcon({ project, size }: ProjectIconProps) {
  const { src, monogram, framed, pixelated } = project.icon;
  const frame = framed || !src ? 'bg-surface-2 border border-border overflow-hidden' : '';

  return (
    <div className={`${sizes[size]} ${frame} flex-shrink-0 flex items-center justify-center`}>
      {src ? (
        <img
          src={src}
          alt=""
          className={`w-full h-full object-contain ${framed ? (size === 'sm' ? 'p-1' : 'p-2') : ''}`}
          style={pixelated ? { imageRendering: 'pixelated' } : undefined}
        />
      ) : (
        <span aria-hidden="true" className={`font-bold text-muted-foreground ${size === 'sm' ? 'text-[11px]' : 'text-lg sm:text-xl'}`}>
          {monogram}
        </span>
      )}
    </div>
  );
}
