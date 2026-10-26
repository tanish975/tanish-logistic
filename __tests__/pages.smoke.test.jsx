import React from 'react';
import { renderToString } from 'react-dom/server';

jest.mock('next/router', () => ({
  useRouter: () => ({ query: { booking: 'TN1234' }, isReady: true }),
}));

jest.mock('@/lib/SettingsContext', () => ({
  useSettings: () => ({
    siteName: 'Tanish Logistic',
    slogan: 'Driven by Trust, Powered by Roads',
    primaryColor: '#0369A1',
  }),
  SettingsProvider: ({ children }) => children,
}));

// eslint-disable-next-line import/first
import PrivacyPolicy from '../pages/privacy';
// eslint-disable-next-line import/first
import ThankYou from '../pages/thank-you';

describe('Privacy Policy page (SSR render)', () => {
  it('renders all policy sections and contact info', () => {
    const html = renderToString(React.createElement(PrivacyPolicy));
    expect(html).toContain('Privacy Policy');
    expect(html).toContain('Information We Collect');
    expect(html).toContain('How We Use Your Information');
    expect(html).toContain('Data Security');
    expect(html).toContain('Digital Personal Data Protection Act, 2023');
    expect(html).toContain('tanishlogistic744@gmail.com');
  });
});

describe('Thank-you page (SSR render)', () => {
  it('renders success state with booking reference and next steps', () => {
    const html = renderToString(React.createElement(ThankYou));
    expect(html).toContain('Booking Submitted Successfully');
    expect(html).toContain('TN1234');
    expect(html).toContain('What happens next?');
    expect(html).toContain('Confirmation Call');
    expect(html).toContain('Vehicle Assignment');
    expect(html).toContain('Dispatch &amp; Updates');
  });
});
