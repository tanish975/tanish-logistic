import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ProcessDraw from '../src/components/Animations/ProcessDraw';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }) => {
    const React = require('react');
    return React.createElement('a', { href, ...props }, children);
  },
}));

import { FinalCta } from '../src/components/Layout/PublicPage';

describe('mobile-safe freight process layout', () => {
  it('renders ordered steps in a responsive, shrink-safe card grid', () => {
    const html = renderToStaticMarkup(
      <ProcessDraw
        steps={[
          {
            number: '01',
            title: 'Requirement Capture',
            description: 'Cargo dimensions and pickup details are reviewed.',
            tag: 'Step 1',
          },
          {
            number: '02',
            title: 'Vehicle & Driver Allocation',
            description: 'A suitable commercial vehicle is assigned.',
            tag: 'Step 2',
          },
        ]}
      />
    );

    expect(html).toContain('aria-label="Freight movement process"');
    expect(html).toContain('grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3');
    expect(html).toContain('min-w-0');
    expect(html).toContain('Requirement Capture');
    expect(html).toContain('Vehicle &amp; Driver Allocation');
  });
});

describe('FinalCta destinations', () => {
  it('uses the configured call and services destinations instead of fixed routes', () => {
    const html = renderToStaticMarkup(
      <FinalCta
        primaryHref="tel:+919924204744"
        primaryLabel="Call Dispatch Desk"
        secondaryHref="/services"
        secondaryLabel="View Transport Services"
      />
    );

    expect(html).toContain('href="tel:+919924204744"');
    expect(html).toContain('href="/services"');
    expect(html).not.toContain('href="/book"');
    expect(html).toContain('View Transport Services');
  });
});
