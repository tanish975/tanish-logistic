import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card.js';
import { Button } from '@/components/ui/button.js';
import { Badge } from '@/components/ui/badge.js';
import { X, ChevronLeft, ChevronRight, ZoomIn, Download } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { SiteMetadata } from '@/components/Layout/Metadata';

// ponytail: module-level constant avoids re-creating arrays on every render
const galleryImages = [
  { id: 1, url: "/gallery/Picture1.jpg", alt: "Logistics truck on highway" },
  { id: 2, url: "/gallery/Picture2.jpg", alt: "Warehouse storage facility" },
  { id: 3, url: "/gallery/Picture3.png", alt: "Cargo loading operation" },
  { id: 4, url: "/gallery/Picture4.png", alt: "Fleet of delivery vehicles" },
  { id: 5, url: "/gallery/Picture5.jpg", alt: "Professional logistics team" },
  { id: 6, url: "/gallery/Picture6.jpg", alt: "Modern transport truck" },
  { id: 7, url: "/gallery/Picture7.jpg", alt: "Packages ready for delivery" },
  { id: 8, url: "/gallery/Picture8.jpg", alt: "Intercity freight transport" },
  { id: 9, url: "/gallery/Picture9.jpg", alt: "Logistics warehouse interior" },
  { id: 10, url: "/gallery/Picture10.jpg", alt: "Commercial vehicle on route" },
  { id: 11, url: "/gallery/Picture11.jpg", alt: "Tanish Logistic fleet operations" },
];

const Gallery = () => {
  const shouldReduceMotion = useReducedMotion();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

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
  }, [selectedImage]);

  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setSelectedIndex(null);
  };

  const navigateImage = (direction) => {
    if (selectedIndex === null) return;
    const newIndex = direction === 'prev'
      ? (selectedIndex - 1 + galleryImages.length) % galleryImages.length
      : (selectedIndex + 1) % galleryImages.length;
    setSelectedImage(galleryImages[newIndex]);
    setSelectedIndex(newIndex);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteMetadata
        title="Gallery — Tanish Logistic"
        description="Browse Tanish Logistic's fleet, facilities, and operations gallery. Modern trucks, professional drivers, and state-of-the-art logistics infrastructure."
      />
      {/* Hero Section */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: shouldReduceMotion ? 0 : 0.5 }} className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-24">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.2 }} className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Our Fleet
          </motion.h1>
          <motion.p initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.4 }} className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Take a look at our modern fleet, professional operations, and state-of-the-art 
            facilities that make us India's trusted logistics partner.
          </motion.p>
        </div>
      </motion.section>

      {/* Gallery Grid */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.2 }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
{galleryImages.map((image, index) => (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : index * 0.1 }} key={image.id}>
                <button
                  type="button"
                  onClick={() => openLightbox(image, index)}
                  aria-label={`View image: ${image.alt}`}
                  className="overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 group rounded-xl transform hover:-translate-y-2 w-full text-left bg-white border-0">
                  <CardContent className="p-0 relative">
                    <div className="relative overflow-hidden h-64">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                        <ZoomIn className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
                      </div>
                    </div>
                  </CardContent>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

{/* Lightbox Modal */}
      {selectedImage && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: shouldReduceMotion ? 0 : 0.3 }} className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 animate-fade-in" role="dialog" aria-modal="true" aria-label="Image lightbox">
          <div className="relative w-full max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 z-10"
              aria-label="Close lightbox">
              <X className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={() => navigateImage('prev')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 rounded-full p-3 hover:bg-black/70 transition-all z-10"
              aria-label="Previous image">
              <ChevronLeft className="h-8 w-8" aria-hidden="true" />
            </button>

            <button
              onClick={() => navigateImage('next')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 rounded-full p-3 hover:bg-black/70 transition-all z-10"
              aria-label="Next image">
              <ChevronRight className="h-8 w-8" aria-hidden="true" />
            </button>

            {/* Image */}
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: shouldReduceMotion ? 0 : 0.3 }} className="w-full h-full flex items-center justify-center">
              <Image
                src={selectedImage.url}
                alt={selectedImage.alt}
                fill
                sizes="100vw"
                className="object-contain rounded-lg shadow-2xl"
              />
            </motion.div>

            {/* Image Info */}
            <div className="absolute bottom-4 left-4 right-4 text-white bg-black/60 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-lg tabular-nums">
                    {selectedIndex + 1} / {galleryImages.length}
                  </span>
                  <a
                    href={selectedImage.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/20 rounded-full p-3 hover:bg-white/30 transition-all"
                    aria-label="Download image">
                    <Download className="h-6 w-6" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Gallery;