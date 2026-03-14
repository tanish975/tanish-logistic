import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Truck, Package, CheckCircle, ArrowRight, Star, MapPin, Clock, Shield, Zap, Award, Users } from 'lucide-react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { mockFaqs } from "../src/faq";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from 'framer-motion';
import { useSettings } from '@/lib/SettingsContext';

const Home = () => {
  const settings = useSettings();
  const siteName = settings.siteName || 'Tanish Logistic';
  const slogan = settings.slogan || 'Driven by Trust, Powered by Roads';
  const primaryColor = settings.primaryColor || '#3b82f6';
  
  const heroContent = [
    {
      video: '/hero-video.mp4/mixkit-52428-video-52428-full-hd.mp4',
      slogan: slogan
    },
    {
      video: '/hero-video.mp4/mixkit-cars-and-trucks-crossing-on-a-highway-in-nature-44284-full-hd.mp4',
      slogan: 'Your Cargo, Our Commitment'
    },
    {
      video: '/hero-video.mp4/mixkit-large-truck-driving-along-a-rural-highway-45488-hd-ready.mp4',
      slogan: 'Connecting India, One Delivery at a Time'
    },
    {
      video: '/hero-video.mp4/mixkit-various-vehicles-traverse-the-asphalt-highway-beside-the-breathtaking-desert-52014-full-hd.mp4',
      slogan: 'The Future of Logistics is Here'
    }
  ];
  const [currentHeroIndex, setCurrentHeroIndex] = React.useState(0);

  const handleVideoEnd = () => {
    setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % heroContent.length);
  };

  const hubStations = [
    { name: 'Mumbai, Maharashtra', image: 'https://images.pexels.com/photos/2234638/pexels-photo-2234638.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', description: 'Our main hub, connecting the financial capital to the rest of India.' },
    { name: 'Delhi, NCR', image: 'https://images.pexels.com/photos/931007/pexels-photo-931007.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', description: 'Serving the entire Northern region from the heart of the capital.' },
    { name: 'Bengaluru, Karnataka', image: 'https://images.pexels.com/photos/38326/pexels-photo-38326.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', description: 'Connecting the Silicon Valley of India to our national network.' },
    { name: 'Jaipur, Rajasthan', image: 'https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', description: 'Our strategic hub in the Pink City, catering to the western region.' },
    { name: 'Kolkata, West Bengal', image: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', description: 'Connecting the eastern part of India to our logistics network.' },
    { name: 'Pune, Maharashtra', image: 'https://images.pexels.com/photos/2234638/pexels-photo-2234638.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', description: 'A key hub in the automotive and manufacturing belt of western India.' },
    { name: 'Goa', image: 'https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', description: 'Serving the coastal region and supporting the tourism industry.' },
    { name: 'Chennai, Tamil Nadu', image: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', description: 'Our gateway to Southern India, with strong connectivity to ports.' },
  ];

  return (
    <>
    <style jsx="true" global="true">{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        @keyframes scroll-reverse {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .scrolling-wrapper {
          animation: scroll 40s linear infinite;
        }
        .scrolling-wrapper-reverse {
          animation: scroll-reverse 40s linear infinite;
        }
      `}</style>
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="relative h-screen flex items-center justify-center text-white">
        <video
          key={currentHeroIndex}
          autoPlay
          muted
          onEnded={handleVideoEnd}
          className="absolute z-0 w-full h-full object-cover"
        >
          <source
            src={heroContent[currentHeroIndex].video}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-full mx-auto px-2 sm:px-4 lg:px-6 text-center">
          <motion.h1 initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            {heroContent[currentHeroIndex].slogan}
          </motion.h1>
          <motion.p initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed">
            Reliable B2B logistics across India with expert road transport solutions. {slogan}
          </motion.p>
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }} className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" style={{ backgroundColor: primaryColor }} className="hover:opacity-90 text-white px-10 py-5 text-lg shadow-lg transform hover:scale-105 transition-all duration-300">
              <Link href="/contact">
                Get Quote Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 px-10 py-5 text-lg shadow-lg transform hover:scale-105 transition-all duration-300">
              <Link href="/services">
                Our Services
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Quick Stats */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="py-20 bg-white">
        <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} whileHover={{ scale: 1.05 }} className="text-center">
              <div className="text-5xl font-extrabold mb-3" style={{ color: primaryColor }}>
                <CountUp end={5} duration={3} />+
              </div>
              <div className="text-xl font-medium text-gray-700">Years of Experience</div>
            </motion.div>
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }} whileHover={{ scale: 1.05 }} className="text-center">
              <div className="text-5xl font-extrabold mb-3" style={{ color: primaryColor }}>
                <CountUp end={100} duration={3} />+
              </div>
              <div className="text-xl font-medium text-gray-700">Cities Covered</div>
            </motion.div>
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.8 }} whileHover={{ scale: 1.05 }} className="text-center">
              <div className="text-5xl font-extrabold mb-3" style={{ color: primaryColor }}>
                <CountUp end={1000} duration={3} />+
              </div>
              <div className="text-xl font-medium text-gray-700">Happy Clients</div>
            </motion.div>
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 1.0 }} whileHover={{ scale: 1.05 }} className="text-center">
              <div className="text-5xl font-extrabold mb-3" style={{ color: primaryColor }}>
                <CountUp end={98} duration={3} />%
              </div>
              <div className="text-xl font-medium text-gray-700">On-Time Delivery</div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Hub Stations Section */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="py-20 bg-gray-100">
        <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Hub Stations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">We have a strong presence in major industrial and commercial hubs across the nation.</p>
          </div>
          <div className="overflow-hidden">
            <div className="flex scrolling-wrapper">
              {[...Array(2)].map((_, i) => (
                <React.Fragment key={i}>
                  <div className="flex-shrink-0 w-full mx-4">
                    <h3 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.2)'}}>North to South, East to West – We’re Always on the Move.</h3>
                  </div>
                  <div className="flex-shrink-0 w-full mx-4">
                    <h3 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.2)'}}>Logistics that Reach Every Business Hub Across India.</h3>
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div className="flex scrolling-wrapper-reverse">
              {[...hubStations, ...hubStations].map((hub, index) => (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: index * 0.1 }} key={index} className="flex-shrink-0 w-80 mx-4">
                  <div className="relative rounded-xl overflow-hidden group transform hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-2xl h-80">
                    <Image
                      src={hub.image}
                      alt={hub.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-60 transition-all duration-300"></div>
                    <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                      <h3 className="text-3xl font-bold mb-2">{hub.name}</h3>
                      <p className="text-lg">{hub.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>


      {/* FAQ Section */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }} className="py-20 bg-white">
        <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Here are some of the most common questions we get from our clients.</p>
          </div>
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.8 }}>
            <Accordion type="single" collapsible className="w-full">
              {mockFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg font-semibold">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-base text-gray-700">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.8 }} style={{ backgroundColor: primaryColor }} className="py-24">
        <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 text-center">
          <motion.h2 initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 1.0 }} className="text-4xl font-bold text-white mb-4">Ready to Get Started?</motion.h2>
          <motion.p initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 1.2 }} className="text-xl mb-10 max-w-3xl mx-auto" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Join thousands of satisfied customers who trust {siteName} for their logistics needs. Get a free, no-obligation quote today!
          </motion.p>
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 1.4 }} className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-5 text-lg shadow-lg transform hover:scale-105 transition-transform">
              <Link href="/contact">
                Get Free Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

          </motion.div>
        </div>
      </motion.section>
    </div>
    </>
  );
};

export default Home;
