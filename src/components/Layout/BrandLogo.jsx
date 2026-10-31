import React from 'react';

const ANIMATED_LOGO_URL = '/logo-animated.svg';
const STATIC_LOGO_URL = '/logo.svg';

/**
 * The animated SVG is the default brand mark. Serve the matching static mark
 * directly to users who request reduced motion, without waiting for hydration.
 * User-configured logo URLs are otherwise left untouched.
 */
export function BrandLogo({ src, alt, className = '', ...imgProps }) {
  const usesAnimatedBrandMark = src === ANIMATED_LOGO_URL;

  return (
    <picture>
      {usesAnimatedBrandMark && (
        <source
          media="(prefers-reduced-motion: reduce)"
          srcSet={STATIC_LOGO_URL}
        />
      )}
      <img src={src} alt={alt} className={className} {...imgProps} />
    </picture>
  );
}

export default BrandLogo;
