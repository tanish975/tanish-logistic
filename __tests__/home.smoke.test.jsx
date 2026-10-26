import React from 'react';
import { renderToString } from 'react-dom/server';

jest.mock('@/lib/SettingsContext', () => ({
  useSettings: () => ({
    siteName: 'Tanish Logistic',
    slogan: 'Driven by Trust, Powered by Roads',
    primaryColor: '#0369A1',
  }),
  SettingsProvider: ({ children }) => children,
}));

// eslint-disable-next-line import/first
import Home from '../pages/index';

describe('Home page smoke test (SSR render)', () => {
  it('renders without crashing and contains all sections', () => {
    const html = renderToString(React.createElement(Home));

    // Hero + stats
    expect(html).toContain('Road Freight Built for Serious Business');
    expect(html).toContain('Years Moving Freight');

    // Coverage marquee (magicui)
    expect(html).toContain('Cities and industrial hubs served');
    expect(html).toContain('animate-marquee');

    // Mid-page sections
    expect(html).toContain('Operational Discipline');
    expect(html).toContain('Service Capabilities');
    expect(html).toContain('High-frequency freight routes');
    expect(html).toContain('The Tanish Difference');
    expect(html).toContain('Frequently Asked Questions');

    // Final CTA (magicui BorderBeam card)
    expect(html).toContain('Ready to move your next shipment?');
  });
});
