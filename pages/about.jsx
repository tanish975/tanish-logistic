import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, Users, Award, Target, CheckCircle, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const About = () => {
  const stats = [
    { number: "5+", label: "Years of Experience" },
    { number: "100+", label: "Cities Covered" },
    { number: "1000+", label: "Happy Clients" },
    { number: "98%", label: "On-Time Delivery" }
  ];

  const values = [
    {
      icon: Truck,
      title: "Reliability",
      description: "We deliver on our promises, every single time. Your trust is our foundation."
    },
    {
      icon: Users,
      title: "Customer Focus",
      description: "Your success is our success. We're committed to exceeding your expectations."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for the highest standards in everything we do."
    },
    {
      icon: Target,
      title: "Innovation",
      description: "We continuously improve our processes to serve you better."
    }
  ];

  const timeline = [
    {
      year: "2023",
      title: "Company Founded",
      description: "Started with a vision to revolutionize logistics in India"
    },
    {
      year: "2024",
      title: "Pan-India Presence",
      description: "Extended services to 100+ cities across India"
    },
    {
      year: "2025",
      title: "Digital Transformation",
      description: "Launched a new online booking platform"
    },
    {
      year: "2026",
      title: "Future Ready",
      description: "Continuing to innovate and serve with excellence"
    }
  ];

  const { scrollYProgress } = useScroll();
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-24">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            About Tanish Logistic
          </motion.h1>
          <motion.p initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            For over 5 years, we've been the trusted partner for businesses across India, 
            delivering reliable logistics solutions that drive success.
          </motion.p>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: index * 0.2 }} key={index}>
                <Card className="text-center bg-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl transform hover:-translate-y-2">
                  <CardContent className="p-8">
                    <div className="text-5xl font-extrabold text-blue-600 mb-3">{stat.number}</div>
                    <div className="text-xl font-medium text-gray-700">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Our Story */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }} className="order-2 lg:order-1">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Founded in 2023, Tanish Logistic began with a simple mission: to make logistics 
                simple, reliable, and accessible for businesses across India. What started as a 
                small fleet of trucks has grown into a comprehensive logistics solution provider.
              </p>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Today, we serve over 1000+ clients across 100+ cities, handling everything from 
                small packages to large industrial shipments. Our commitment to excellence and 
                customer satisfaction has made us a trusted name in the industry.
              </p>
            </motion.div>
            <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.8 }} className="order-1 lg:order-2 bg-gray-200 rounded-2xl h-96 flex items-center justify-center shadow-xl relative">
              <Image
                src="/gemini1.png"
                alt="Our Story Image"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain rounded-2xl"
              />
            </motion.div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-16">
            <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }} className="order-2 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Our mission is to provide seamless, reliable, and cost-effective logistics solutions to our clients. We are committed to leveraging technology and innovation to exceed our clients' expectations and build long-term partnerships.
              </p>
            </motion.div>
            <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.8 }} className="order-1 lg:order-1 bg-gray-200 rounded-2xl h-96 flex items-center justify-center shadow-xl relative">
              <Image
                src="/gemini2.png"
                alt="Our Mission Image"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover rounded-2xl"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Our Values */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do, ensuring we deliver the best for our clients.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: index * 0.2 }} key={index}>
                  <Card className="text-center bg-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden transform hover:-translate-y-2">
                    <CardContent className="p-10">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <IconComponent className="h-10 w-10 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                      <p className="text-gray-600 text-lg">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Timeline */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.8 }} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key milestones in our growth story, showcasing our commitment to progress.
            </p>
          </div>
          
          <div className="relative">
            <motion.svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full">
              <motion.path
                d="M 50,0 L 50,100"
                stroke="#3b82f6"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                style={{ pathLength: scrollYProgress }}
              />
            </motion.svg>
            <div className="space-y-16">
              {timeline.map((item, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-center ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -200 : 200 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 100, damping: 10 }}
                    viewport={{ once: true }}
                  >
                    <div className={`w-1/2 flex ${index % 2 === 0 ? 'justify-end pr-8' : 'justify-start pl-8'}`}>
                      <motion.div whileHover={{ scale: 1.05, rotateY: 5 }} transition={{ duration: 0.3 }} className="w-full">
                        <Card className="max-w-md shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl">
                          <CardContent className="p-8">
                            <div className="text-3xl font-bold text-blue-600 mb-3">{item.year}</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                            <p className="text-gray-600 text-lg">{item.description}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center relative z-10 shadow-lg">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                    <div className="w-1/2"></div>
                  </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1.0 }} className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 1.2 }} className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Work With Us?
          </motion.h2>
          <motion.p initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 1.4 }} className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join our growing family of satisfied clients and experience the difference 
            that 5+ years of expertise can make.
          </motion.p>
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 1.6 }} className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-5 text-lg shadow-lg transform hover:scale-105 transition-all duration-300">
              <Link href="/contact">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-10 py-5 text-lg shadow-lg transform hover:scale-105 transition-all duration-300">
              <Link href="/services">
                Learn More
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;
