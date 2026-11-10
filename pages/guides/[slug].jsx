import Link from 'next/link';
import { ArrowRight, CheckCircle2, Info } from 'lucide-react';
import { FinalCta, PublicPageHero } from '@/components/Layout/PublicPage';
import { SiteMetadata } from '@/components/Layout/Metadata';
import {
  getCustomerGuideBySlug,
  customerGuides,
} from '@/lib/customerGuides';
import { getServiceCapabilityBySlug } from '@/lib/serviceCapabilities';
import { vehicleSpecs as publishedVehicleSpecs } from '@/lib/vehicleSpecs';

const SITE_ORIGIN = 'https://tanishlogistic.com';

function CustomerGuidePage({ guide, vehicleSpecs }) {
  const relatedServices = guide.relatedServiceSlugs
    .map((slug) => getServiceCapabilityBySlug(slug))
    .filter(Boolean);
  const showsVehicleSpecs = guide.slug === 'vehicle-selection';

  return (
    <div className="min-h-screen bg-white font-sans text-slate-950">
      <SiteMetadata
        title={guide.metaTitle}
        description={guide.metaDescription}
        url={`${SITE_ORIGIN}/guides/${guide.slug}/`}
      />

      <PublicPageHero
        eyebrow="Customer guide"
        title={guide.title}
        description={guide.heroDescription}
        primaryHref={guide.primaryHref}
        primaryLabel={guide.primaryLabel}
        secondaryHref={guide.secondaryHref}
        secondaryLabel={guide.secondaryLabel}
      >
        <div className="rounded-2xl border border-white/15 bg-slate-900/80 p-6 text-white backdrop-blur-md sm:p-7">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-300">
            At a glance
          </p>
          <p className="mt-3 text-lg font-semibold leading-relaxed text-white">
            {guide.summary}
          </p>
        </div>
      </PublicPageHero>

      <section className="py-16 sm:py-20" aria-labelledby="guide-overview-heading">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-sky-700">
              The short version
            </p>
            <h2 id="guide-overview-heading" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {guide.overviewHeading}
            </h2>
          </div>
          <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
            {guide.overview}
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-7xl gap-5 px-4 sm:px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {guide.steps.map((step, index) => (
            <article key={step.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-extrabold tabular-nums text-sky-700">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-3 text-base font-bold text-slate-950">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {showsVehicleSpecs && (
        <section className="border-y border-slate-200 bg-slate-50 py-16 sm:py-20" aria-labelledby="vehicle-specs-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-widest text-sky-700">
              Published vehicle ranges
            </p>
            <h2 id="vehicle-specs-heading" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Compare body type, payload, and cargo space
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
              Use these listed configurations as a starting point. A final vehicle choice depends on the packed load, route, and available vehicle.
            </p>

            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table aria-label="Published vehicle specifications" className="w-full min-w-[760px] border-collapse text-left text-sm">
                  <caption className="sr-only">Indicative payload and volume ranges for listed commercial vehicle types</caption>
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-900">
                      <th scope="col" className="p-4 font-bold sm:p-5">Vehicle type</th>
                      <th scope="col" className="p-4 font-bold sm:p-5">Indicative payload</th>
                      <th scope="col" className="p-4 font-bold sm:p-5">Listed volume</th>
                      <th scope="col" className="p-4 font-bold sm:p-5">Body type</th>
                      <th scope="col" className="p-4 font-bold sm:p-5">Typical cargo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {vehicleSpecs.map((vehicle) => (
                      <tr key={vehicle.type} className="align-top">
                        <th scope="row" className="p-4 font-semibold text-slate-900 sm:p-5">
                          {vehicle.type}
                        </th>
                        <td className="whitespace-nowrap p-4 text-slate-700 sm:p-5">{vehicle.payload}</td>
                        <td className="whitespace-nowrap p-4 text-slate-700 sm:p-5">{vehicle.volume}</td>
                        <td className="p-4 text-slate-700 sm:p-5">{vehicle.body}</td>
                        <td className="p-4 text-slate-600 sm:p-5">{vehicle.bestFor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
              <p>{guide.note}</p>
            </div>
          </div>
        </section>
      )}

      <section className="border-y border-slate-200 bg-slate-50 py-16 sm:py-20" aria-labelledby="guide-checklist-heading">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-sky-700">
              Get ready
            </p>
            <h2 id="guide-checklist-heading" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {guide.checklistHeading}
            </h2>
          </div>
          <div>
            <ul className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              {guide.checklist.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700 sm:text-base">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {!showsVehicleSpecs && (
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
                <p>{guide.note}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20" aria-labelledby="guide-faq-heading">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-sky-700">
            Helpful answers
          </p>
          <h2 id="guide-faq-heading" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Common questions
          </h2>
          <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
            {guide.faqs.map((item) => (
              <article key={item.question} className="py-6">
                <h3 className="text-base font-bold text-slate-950 sm:text-lg">
                  {item.question}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-16 sm:py-20" aria-labelledby="guide-related-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="guide-related-heading" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Related freight services
          </h2>
          <nav aria-label="Related freight services" className="mt-8 grid gap-4 md:grid-cols-2">
            {relatedServices.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}/`}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
                  {service.label}
                </span>
                <span className="mt-2 block text-lg font-bold text-slate-950">
                  {service.title}
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-slate-600">
                  {service.cardSummary}
                </span>
                <span className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-sky-800">
                  Read this service guide
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <FinalCta
        eyebrow={guide.ctaEyebrow}
        title={guide.ctaTitle}
        description={guide.ctaDescription}
        primaryHref={guide.primaryHref}
        primaryLabel={guide.primaryLabel}
        secondaryHref={guide.secondaryHref}
        secondaryLabel={guide.secondaryLabel}
      />
    </div>
  );
}

export async function getStaticPaths() {
  return {
    paths: customerGuides.map((guide) => ({ params: { slug: guide.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const guide = getCustomerGuideBySlug(params.slug);
  if (!guide) return { notFound: true };

  return {
    props: {
      guide,
      vehicleSpecs: guide.slug === 'vehicle-selection' ? publishedVehicleSpecs : [],
    },
  };
}

export default CustomerGuidePage;
