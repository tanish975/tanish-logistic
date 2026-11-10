import React from 'react';
import { readFileSync } from 'node:fs';
import { renderToString } from 'react-dom/server';
import Footer from '../src/components/Layout/Footer';
import Book from '../pages/book';
import ThankYou from '../pages/thank-you';
import ServicesOverview from '../pages/services';
import CustomerGuidePage, {
  getStaticPaths,
  getStaticProps,
} from '../pages/guides/[slug]';
import { customerGuides } from '../src/lib/customerGuides';

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: { booking: 'TN-TEST-001' },
    isReady: true,
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

const render = (component) => renderToString(component);

describe('customer guide pages', () => {
  it('pre-renders one route for each selected customer guide', async () => {
    const result = await getStaticPaths();

    expect(result.fallback).toBe(false);
    expect(result.paths.map(({ params }) => params.slug).sort()).toEqual(
      customerGuides.map(({ slug }) => slug).sort()
    );
  });

  it('returns not found for an unknown guide', async () => {
    await expect(getStaticProps({ params: { slug: 'unknown-guide' } })).resolves.toEqual({
      notFound: true,
    });
  });

  it('renders useful content for every guide', async () => {
    for (const guide of customerGuides) {
      const result = await getStaticProps({ params: { slug: guide.slug } });
      const html = render(React.createElement(CustomerGuidePage, result.props));

      expect(result.props.guide.slug).toBe(guide.slug);
      expect(html).toContain(guide.title.replace(/&/g, '&amp;'));
      expect(html).toContain(guide.overviewHeading);
      expect(html).toContain(guide.checklistHeading);
      expect(html).toContain(guide.note.replace(/&/g, '&amp;'));
      if (guide.slug === 'vehicle-selection') {
        expect(html).toContain('14ft / 17ft Closed Container');
        expect(html).toContain('Indicative payload');
      }
    }
  });

  it('links to the guides from the footer and relevant customer flows', () => {
    const footerHtml = render(React.createElement(Footer));
    const bookingHtml = render(React.createElement(Book));
    const thankYouHtml = render(React.createElement(ThankYou));
    const servicesHtml = render(React.createElement(ServicesOverview));

    expect(footerHtml).toContain('Customer Guides');
    for (const { slug } of customerGuides) {
      expect(footerHtml).toContain(`href="/guides/${slug}`);
    }
    expect(bookingHtml).toContain('href="/guides/online-booking');
    expect(bookingHtml).toContain('href="/guides/vehicle-selection');
    expect(thankYouHtml).toContain('href="/guides/shipment-updates');
    expect(servicesHtml).toContain('href="/guides/vehicle-selection');
  });

  it('lists each guide in the public sitemap', () => {
    const sitemap = readFileSync('public/sitemap.xml', 'utf8');

    for (const { slug } of customerGuides) {
      expect(sitemap).toContain(`https://tanishlogistic.com/guides/${slug}/`);
    }
  });
});
