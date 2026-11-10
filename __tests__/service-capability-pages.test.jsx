import React from 'react';
import { renderToString } from 'react-dom/server';
import Footer from '../src/components/Layout/Footer';
import ServicesOverview from '../pages/services';
import ServiceCapabilityPage, {
  getStaticPaths,
  getStaticProps,
} from '../pages/services/[slug]';
import { serviceCapabilities } from '../src/lib/serviceCapabilities';

describe('service capability pages', () => {
  it('pre-renders a route for every footer capability', async () => {
    const result = await getStaticPaths();

    expect(result.fallback).toBe(false);
    expect(result.paths.map(({ params }) => params.slug).sort()).toEqual(
      serviceCapabilities.map(({ slug }) => slug).sort()
    );
  });

  it('returns not found for an unknown capability', async () => {
    await expect(getStaticProps({ params: { slug: 'unknown-service' } })).resolves.toEqual({
      notFound: true,
    });
  });

  it('renders clear information for every capability', async () => {
    for (const capability of serviceCapabilities) {
      const result = await getStaticProps({ params: { slug: capability.slug } });
      const html = renderToString(
        React.createElement(ServiceCapabilityPage, result.props)
      );

      expect(result.props.capability.slug).toBe(capability.slug);
      expect(html).toContain(capability.title.replace(/&/g, '&amp;'));
      expect(html).toContain('What information should I prepare?');
      expect(html).toContain('Common questions');
      expect(html).toContain(capability.planningNote.replace(/&/g, '&amp;'));
    }
  });

  it('links every capability from the footer and services overview', () => {
    const footerHtml = renderToString(React.createElement(Footer));
    const servicesHtml = renderToString(React.createElement(ServicesOverview));

    for (const { slug } of serviceCapabilities) {
      const href = `href="/services/${slug}`;
      expect(footerHtml).toContain(href);
      expect(servicesHtml).toContain(href);
    }
  });
});
