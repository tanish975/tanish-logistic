import React from 'react';
import { cn } from '@/lib/utils';

/**
 * DotPattern — static SVG dot-grid background texture.
 * Simplified (non-animated) adaptation of magicui's DotPattern (MIT,
 * https://magicui.design) using an SVG <pattern> for near-zero runtime cost.
 * Color follows `currentColor` — control via text-* utilities.
 */
export function DotPattern({
  width = 20,
  height = 20,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  ...props
}) {
  const id = React.useId();

  return (
    <svg
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full fill-current text-neutral-400/80',
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          x={x}
          y={y}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={cx} cy={cy} r={cr} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} strokeWidth="0" />
    </svg>
  );
}

export default DotPattern;
