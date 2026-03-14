import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card.js';
import { Button } from '@/components/ui/button.js';
import { Badge } from '@/components/ui/badge.js';
import { X, ChevronLeft, ChevronRight, ZoomIn, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryImages = [
    {
      id: 1,
      url: "/gallery/Picture1.jpg",
      category: "All"
    },
    {
      id: 2,
      url: "/gallery/Picture2.jpg",
      category: "All"
    },
    {
      id: 3,
      url: "/gallery/Picture3.png",
      category: "All"
    },
    {
      id: 4,
      url: "/gallery/Picture4.png",
      category: "All"
    },
    {
      id: 5,
      url: "/gallery/Picture5.jpg",
      category: "All"
    },
    {
      id: 6,
      url: "/gallery/Picture6.jpg",
      category: "All"
    },
    {
      id: 7,
      url: "/gallery/Picture7.jpg",
      category: "All"
    },
    {
      id: 8,
      url: "/gallery/Picture8.jpg",
      category: "All"
    },
    {
      id: 9,
      url: "/gallery/Picture9.jpg",
      category: "All"
    },
    {
      id: 10,
      url: "/gallery/Picture10.jpg",
      category: "All"
    },
    {
      id: 11,
      url: "/gallery/Picture11.jpg",
      category: "All"
    }
  ];

  const openLightbox = (image, index) => {
    setSelectedImage({ ...image, index });
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    if (!selectedImage) return;
    
    const currentIndex = selectedImage.index;
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : galleryImages.length - 1;
    } else {
      newIndex = currentIndex < galleryImages.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedImage({ ...galleryImages[newIndex], index: newIndex });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-24">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Our Fleet
          </motion.h1>
          <motion.p initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Take a look at our modern fleet, professional operations, and state-of-the-art 
            facilities that make us India's trusted logistics partner.
          </motion.p>
        </div>
      </motion.section>

      {/* Gallery Grid */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryImages.map((image, index) => (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: index * 0.1 }} key={image.id}>
                <Card 
                  className="overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 group rounded-xl transform hover:-translate-y-2"
                  onClick={() => openLightbox(image, index)}>
                  <CardContent className="p-0 relative">
                    <div className="relative overflow-hidden h-64">
                                            <Image
                                              src={image.url}
                                              alt="Gallery Image"
                                              fill
                                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                                            />                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                        <ZoomIn className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white bg-transparent rounded-full p-2 hover:bg-white/20 transition-all z-10">
              <X className="h-8 w-8" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={() => navigateImage('prev')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 rounded-full p-3 hover:bg-black/70 transition-all z-10">
              <ChevronLeft className="h-8 w-8" />
            </button>
            
            <button
              onClick={() => navigateImage('next')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 rounded-full p-3 hover:bg-black/70 transition-all z-10">
              <ChevronRight className="h-8 w-8" />
            </button>

            {/* Image */}
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }} className="w-full h-full flex items-center justify-center">
                            <Image
                              src={selectedImage.url}
                              alt="Gallery Image"
                              fill
                              sizes="100vw"
                              className="object-contain rounded-lg shadow-2xl"
                            />            </motion.div>

            {/* Image Info */}
            <div className="absolute bottom-4 left-4 right-4 text-white bg-black/60 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-lg">
                    {selectedImage.index + 1} / {galleryImages.length}
                  </span>
                  <a
                    href={selectedImage.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/20 rounded-full p-3 hover:bg-white/30 transition-all">
                    <Download className="h-6 w-6" />
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