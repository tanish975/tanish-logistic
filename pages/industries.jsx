import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Factory, Warehouse, Building, Briefcase, ArrowRight, CheckCircle,
  Truck, Package, Shield, Clock, Users, Target 
} from 'lucide-react';
import { motion } from 'framer-motion';

const Industries = () => {
  const industryDetails = [
    {
      id: 1,
      title: "Manufacturing",
      description: "Comprehensive logistics solutions for manufacturing units including raw material transport, finished goods distribution, and equipment movement.",
      icon: Factory,
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=400&fit=crop"
    },
    {
      id: 2,
      title: "Wholesale & Distribution",
      description: "Efficient bulk cargo movement and distribution network solutions for wholesalers and distribution centers across India.",
      icon: Warehouse,
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop"
    },
    {
      id: 3,
      title: "Corporate & Enterprises",
      description: "Dedicated logistics partnerships for large corporations and enterprises with customized solutions and dedicated account management.",
      icon: Building,
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop"
    },
    {
      id: 4,
      title: "SMEs",
      description: "Affordable and flexible transport solutions designed specifically for small and medium enterprises with scalable options.",
      icon: Briefcase,
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-24">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Industries We Serve
          </motion.h1>
          <motion.p initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Specialized logistics solutions tailored for diverse industries across India. 
            From manufacturing to SMEs, we understand your unique transportation needs.
          </motion.p>
        </div>
      </motion.section>

      {/* Industries Overview */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Industry Expertise
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive logistics solutions designed for your industry's unique requirements.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {industryDetails.map((industry, index) => {
              const IconComponent = industry.icon;
              return (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: index * 0.2 }} key={industry.id}>
                  <Card className="group bg-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden transform hover:-translate-y-2">
                    <div className="relative h-48">
                      <Image
                        src={industry.image}
                        alt={industry.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black opacity-40"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <IconComponent className="h-16 w-16 text-white" />
                      </div>
                    </div>
                    <CardContent className="p-8 text-center">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{industry.title}</h3>
                      <p className="text-gray-600 text-lg mb-6">{industry.description}</p>
                      <Button asChild className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 group-hover:bg-gray-800">
                        <Link href="/services">
                          Learn More
                          <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }} className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Transform Your Industry Logistics?
          </motion.h2>
          <motion.p initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.8 }} className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join hundreds of businesses in your industry who trust Tanish Logistic 
            for their transportation needs. Get a customized quote today.
          </motion.p>
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 1.0 }} className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-5 text-lg shadow-lg transform hover:scale-105 transition-all duration-300">
              <Link href="/contact">
                Get Industry Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-10 py-5 text-lg shadow-lg transform hover:scale-105 transition-all duration-300">
              <Link href="/services">
                View All Services
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Industries;