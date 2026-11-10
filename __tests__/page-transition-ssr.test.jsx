import React from 'react';
import { renderToString } from 'react-dom/server';

jest.mock('next/router', () => ({
  useRouter: () => ({ pathname: '/' }),
}));

import { PageTransition } from '../src/components/Layout/PageTransition';

describe('PageTransition (SSR)', () => {
  it('renders page content on the initial server response', () => {
    const html = renderToString(
      <PageTransition>
        <main>Home hero content</main>
      </PageTransition>
    );

    expect(html).toContain('Home hero content');
    expect(html).not.toMatch(/opacity:\s*0(?:;|")/);
  });
});
