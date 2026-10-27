import Head from 'next/head';

// ponytail: single source of truth for the site chrome — title, description,
// favicon, theme color. Pass page-specific bits; everything else stays consistent.
export const SiteMetadata = ({
  title = 'Tanish Logistic — Road freight built for serious business',
  description = 'Tanish Logistic provides reliable B2B road freight across India. Book cargo transport, get quotes, and track shipments with a team that treats your goods like their own.',
  url,
  image = '/icon-512x512.png',
}) => {
  const fullTitle = title.includes('Tanish Logistic') ? title : `${title} — Tanish Logistic`;
  const canonical = url || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}

      <meta name="theme-color" content="#0369A1" />
      <meta name="color-scheme" content="light" />

      <link rel="shortcut icon" href="/favicon.ico?v=5" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico?v=5" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=5" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=5" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=5" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=5" />
      <link rel="manifest" href="/site.webmanifest" />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Tanish Logistic" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
};

export default SiteMetadata;