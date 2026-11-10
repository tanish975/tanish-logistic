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

import Home from '../pages/index';

describe('Home page smoke test (SSR render)', () => {
  it('renders without crashing and contains all sections', () => {
    const html = renderToString(React.createElement(Home));

    // Hero + stats
    expect(html).toContain('Road Freight Built for Serious Business');
    expect(html).toContain('Years Moving Freight');

    // Hero video stack — the first video loads immediately, with a poster
    // fallback; remaining videos are not all downloaded at page startup.
    expect(html.match(/hero-videos\//g)).toHaveLength(4);
    expect(html).toContain('poster="/hero-posters/mixkit-52428-video-52428-full-hd.jpg"');
    expect(html).toContain('preload="auto"');
    expect(html).toContain('preload="metadata"');
    expect(html).toContain('preload="none"');

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
