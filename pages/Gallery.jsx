import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn, Check } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { SiteMetadata } from '@/components/Layout/Metadata';
import { PublicPageHero, FinalCta } from '@/components/Layout/PublicPage';

const galleryImages = [
  {
    id: 1,
    url: "/gallery/Picture1.jpg",
    alt: "Commercial logistics truck traversing national highway corridor",
    title: "Long-Haul Multi-Axle Carrier",
    category: "Long-Haul Trucks",
    location: "Western Expressway Corridor",
    spec: "Heavy Freight Transit • Interstate FTL",
  },
  {
    id: 3,
    url: "/gallery/Picture3.png",
    alt: "Professional cargo loading and dock securing operation",
    title: "Pre-Dispatch Cargo Securing",
    category: "Cargo Operations",
    location: "Manufacturing Loading Dock",
    spec: "Tarpaulin Lashing & Weight Balance",
  },
  {
    id: 4,
    url: "/gallery/Picture4.png",
    alt: "Modern fleet of commercial transport vehicles staged at depot",
    title: "Dedicated Commercial Fleet",
    category: "Fleet Staging",
    location: "Regional Transport Yard",
    spec: "Scheduled Highway Departure Fleet",
  },
  {
    id: 5,
    url: "/gallery/Picture5.jpg",
    alt: "Tanish Logistic driver and dispatch team coordination",
    title: "Professional Operations Crew",
    category: "Fleet Staging",
    location: "Dispatch Coordination Desk",
    spec: "Commercial Driver Briefing & Checkpoints",
  },
  {
    id: 6,
    url: "/gallery/Picture6.jpg",
    alt: "Modern transport truck undergoing mechanical safety checks",
    title: "Pre-Trip Inspection Protocol",
    category: "Long-Haul Trucks",
    location: "Fleet Maintenance Bay",
    spec: "Brake & Tire Pressure Verification",
  },
  {
    id: 7,
    url: "/gallery/Picture7.jpg",
    alt: "Secured commercial pallets and goods ready for highway haulage",
    title: "Industrial Palletized Staging",
    category: "Cargo Operations",
    location: "Factory Departure Terminal",
    spec: "Full Truckload High-Density Cargo",
  },
  {
    id: 8,
    url: "/gallery/Picture8.jpg",
    alt: "Interstate highway freight vehicle on north-west corridor",
    title: "Express Highway Transit",
    category: "Long-Haul Trucks",
    location: "National Highway 48 Belt",
    spec: "Non-Stop Corridor Haulage",
  },
  {
    id: 10,
    url: "/gallery/Picture10.jpg",
    alt: "Heavy commercial carrier en route across interstate boundary",
    title: "Interstate Corridor Dispatch",
    category: "Long-Haul Trucks",
    location: "Gujarat-Rajasthan Border Route",
    spec: "Scheduled Commercial Highway Transit",
  },
  {
    id: 11,
    url: "/gallery/Picture11.jpg",
    alt: "Tanish Logistic transport vehicle on active delivery route",
    title: "Client Dock Arrival & Delivery",
    category: "Fleet Staging",
    location: "Destination Industrial Facility",
    spec: "Safe Unloading & POD Verification",
  },
];

const categories = [
  "All Fleet Assets",
  "Long-Haul Trucks",

  "Cargo Operations",
  "Fleet Staging"
];

const Gallery = () => {
  const shouldReduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState("All Fleet Assets");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const filteredImages = useMemo(() => activeCategory === "All Fleet Assets"
    ? galleryImages
    : galleryImages.filter((img) => img.category === activeCategory), [activeCategory]);

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
    setSelectedIndex(null);
  }, []);

  const navigateImage = useCallback((direction) => {
    if (selectedIndex === null || filteredImages.length === 0) return;
    const newIndex = direction === 'prev'
      ? (selectedIndex - 1 + filteredImages.length) % filteredImages.length
      : (selectedIndex + 1) % filteredImages.length;
    setSelectedImage(filteredImages[newIndex]);
    setSelectedIndex(newIndex);
  }, [selectedIndex, filteredImages]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navigateImage('next');
      if (e.key === 'ArrowLeft') navigateImage('prev');
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage, closeLightbox, navigateImage]);

  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setSelectedIndex(index);
  };

  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans">
      <SiteMetadata
        title="Fleet & Infrastructure Gallery — Tanish Logistic"
        description="View Tanish Logistic's commercial fleet, commercial vehicle fleet, cargo securing procedures, and highway transport operations across India."
      />

      {/* Enterprise Page Hero */}
      <PublicPageHero
        eyebrow="Fleet & Operations"
        title="Our Transport Assets & Highway Operations in Action."
        description="Take an inside look at our modern commercial carriers, cargo fastening protocols, and disciplined road transit across India."
        primaryLabel="Inquire About Fleet"
        secondaryHref="/book"
        secondaryLabel="Book Transport Online"
      >
        <div className="rounded-2xl border border-white/15 bg-slate-900/80 p-6 backdrop-blur-md">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-400">Fleet Quality Standards</p>
          <div className="mt-4 space-y-3.5 text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Multi-axle, container, and open-body commercial vehicles</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Mandatory pre-trip mechanical and tarpaulin waterproofing audit</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Pan-India GPS tracking on active highway corridors</span>
            </div>
          </div>
        </div>
      </PublicPageHero>

      {/* Gallery Filter & Grid Section */}
      <section className="py-20 sm:py-28 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Photo Bento / Grid */}
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredImages.map((image, index) => (
              <motion.article
                key={image.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.35, delay: shouldReduceMotion ? 0 : index * 0.05 }}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:border-slate-300 flex flex-col justify-between"
              >
                <div
                  onClick={() => openLightbox(image, index)}
                  className="relative aspect-[16/11] cursor-pointer overflow-hidden bg-slate-100"
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="rounded-full bg-slate-900/80 p-3 text-white backdrop-blur shadow-lg">
                      <ZoomIn className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="absolute top-3 left-3 rounded-md bg-slate-900/80 px-2.5 py-1 text-[11px] font-bold text-sky-300 backdrop-blur">
                    {image.category}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-950 leading-snug">
                    {image.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-500 font-medium">
                    {image.location}
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
                    <span>{image.spec}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image preview modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md"
        >
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close image preview"
            className="absolute top-6 right-6 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={() => navigateImage('prev')}
            aria-label="Previous image"
            className="absolute left-4 sm:left-8 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={() => navigateImage('next')}
            aria-label="Next image"
            className="absolute right-4 sm:right-8 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="relative max-h-[85vh] max-w-4xl overflow-hidden rounded-2xl bg-slate-900 border border-white/15 shadow-2xl">
            <div className="relative h-[60vh] w-[80vw] max-w-3xl">
              <Image
                src={selectedImage.url}
                alt={selectedImage.alt}
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="bg-slate-950/90 p-5 text-white border-t border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                    {selectedImage.category} &bull; {selectedImage.location}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {selectedImage.title}
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedIndex + 1} of {filteredImages.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Final CTA */}
      <FinalCta
        eyebrow="Fleet Deployment"
        title="Ready to deploy dedicated commercial vehicles for your freight?"
        description="Tell us your cargo requirements and shipping frequency. Our fleet operations team will configure the right chassis and schedule."
        primaryLabel="Contact Fleet Dispatch"
        secondaryLabel="Book Transport Online"
      />
    </div>
  );
};

export default Gallery;