import { cn } from '@/lib/utils';

/**
 * Marquee — infinite horizontal/vertical scroll strip.
 * Adapted from magicui (MIT, https://magicui.design) for Tailwind v3
 * (`gap-[var(--gap)]` instead of v4 `gap-(--gap)`).
 * Requires the `marquee` / `marquee-vertical` keyframes in tailwind.config.js.
 */
export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}) {
  return (
    <div
      {...props}
      className={cn(
        'group flex gap-[var(--gap)] overflow-hidden p-2 [--duration:40s] [--gap:1rem]',
        vertical ? 'flex-col' : 'flex-row',
        className
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex shrink-0 justify-around gap-[var(--gap)] motion-reduce:animate-none',
              {
                'animate-marquee flex-row': !vertical,
                'animate-marquee-vertical flex-col': vertical,
                'group-hover:[animation-play-state:paused]': pauseOnHover,
                '[animation-direction:reverse]': reverse,
              }
            )}
          >
            {children}
          </div>
        ))}
    </div>
  );
}

export default Marquee;
