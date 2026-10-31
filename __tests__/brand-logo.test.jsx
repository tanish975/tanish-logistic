import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import BrandLogo from '../src/components/Layout/BrandLogo';

describe('BrandLogo', () => {
  it('offers the matching static mark when reduced motion is preferred', () => {
    const html = renderToStaticMarkup(
      <BrandLogo src="/logo-animated.svg" alt="Tanish Logistic Logo" className="h-12 w-12" />
    );

    expect(html).toContain('<source media="(prefers-reduced-motion: reduce)" srcSet="/logo.svg"/>');
    expect(html).toContain('<img src="/logo-animated.svg" alt="Tanish Logistic Logo"');
  });

  it('leaves a user-configured logo URL unchanged', () => {
    const html = renderToStaticMarkup(
      <BrandLogo src="/uploads/customer-logo.svg" alt="Customer logo" />
    );

    expect(html).toContain('<img src="/uploads/customer-logo.svg" alt="Customer logo"');
    expect(html).not.toContain('prefers-reduced-motion');
  });
});
