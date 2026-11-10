import Link from 'next/link';
import { ArrowRight, CheckCircle2, CircleHelp, Info } from 'lucide-react';
import { FinalCta, PublicPageHero } from '@/components/Layout/PublicPage';
import { SiteMetadata } from '@/components/Layout/Metadata';
import {
  getServiceCapabilityBySlug,
  serviceCapabilities,
} from '@/lib/serviceCapabilities';

const SITE_ORIGIN = 'https://tanishlogistic.com';

function ServiceCapabilityPage({ capability }) {
  const relatedServices = capability.relatedSlugs
    .map((slug) => getServiceCapabilityBySlug(slug))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-950">
      <SiteMetadata
        title={capability.metaTitle}
        description={capability.metaDescription}
        url={`${SITE_ORIGIN}/services/${capability.slug}/`}
      />

      <PublicPageHero
        eyebrow="Freight service guide"
        title={capability.title}
        description={capability.heroDescription}
        primaryHref="/contact/"
        primaryLabel="Ask about this service"
        secondaryHref="/services/"
        secondaryLabel="Compare all services"
      >
        <div className="rounded-2xl border border-white/15 bg-slate-900/80 p-6 text-white backdrop-blur-md sm:p-7">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-300">
            At a glance
          </p>
          <p className="mt-3 text-lg font-semibold leading-relaxed text-white">
            {capability.cardSummary}
          </p>
          <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-relaxed text-slate-300">
            The right vehicle, route, and timing depend on your specific shipment. Share the details to discuss a suitable plan.
          </p>
        </div>
      </PublicPageHero>

      <section className="py-16 sm:py-20" aria-labelledby="meaning-heading">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-sky-700">
              In plain English
            </p>
            <h2 id="meaning-heading" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              What does {capability.label} mean?
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
              {capability.plainMeaning}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-slate-950">
              It may be a good fit when
            </h3>
            <ul className="mt-5 space-y-3.5">
              {capability.goodFit.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-16 sm:py-20" aria-labelledby="quote-details-heading">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-sky-700">
              Before requesting a quote
            </p>
            <h2 id="quote-details-heading" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              What information should I prepare?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              A few accurate shipment details help the team assess vehicle fit, route, and timing before confirming a plan.
            </p>
          </div>

          <div>
            <ul className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              {capability.prepare.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700 sm:text-base">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-800">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
              <p>{capability.planningNote}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20" aria-labelledby="questions-heading">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-800">
              <CircleHelp className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-sky-700">
                Helpful answers
              </p>
              <h2 id="questions-heading" className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Common questions
              </h2>
            </div>
          </div>

          <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
            {capability.faqs.map((item) => (
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

      <section className="border-t border-slate-200 bg-slate-50 py-16 sm:py-20" aria-labelledby="related-services-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-sky-700">
              Compare your options
            </p>
            <h2 id="related-services-heading" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Related freight services
            </h2>
          </div>
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
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <FinalCta
        eyebrow="Talk through your shipment"
        title={`Need help choosing ${capability.label.toLowerCase()}?`}
        description="Share the cargo, route, and timing you have in mind. The team can help you understand which details need to be confirmed before booking."
        primaryHref="/contact/"
        primaryLabel="Ask about this service"
        secondaryHref="/book/"
        secondaryLabel="Book a shipment"
      />
    </div>
  );
}

export async function getStaticPaths() {
  return {
    paths: serviceCapabilities.map((service) => ({ params: { slug: service.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const capability = getServiceCapabilityBySlug(params.slug);
  if (!capability) return { notFound: true };

  return { props: { capability } };
}

export default ServiceCapabilityPage;
