import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, Clock, Award, Target, Truck, Users, MapPin, CheckCircle, 
  ArrowRight, Star, Phone, Zap, DollarSign, Headphones 
} from 'lucide-react';
import { motion } from 'framer-motion';

const WhyUs = () => {
  const advantages = [
    {
      icon: Shield,
      title: 'Trusted & Reliable',
      description: '5+ years of proven track record with 98% on-time delivery rate',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Clock,
      title: 'On-Time Delivery',
      description: 'Guaranteed delivery schedules and proactive updates',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Award,
      title: 'Pan-India Network',
      description: 'Comprehensive coverage across 100+ cities with strategic hub locations',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: DollarSign,
      title: 'Transparent Pricing',
      description: 'No hidden costs, competitive rates with clear quotations upfront',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Truck,
      title: 'Modern Fleet',
      description: 'vehicles with professional drivers and regular maintenance',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Round-the-clock customer support with dedicated account managers',
      color: 'from-red-500 to-red-600'
    }
  ];

  const comparisons = [
    { feature: 'Pan-India Coverage', us: true, others: 'Limited' },

    { feature: '24/7 Support', us: true, others: 'Business Hours' },
    { feature: 'Transparent Pricing', us: true, others: 'Hidden Costs' },
    { feature: 'Professional Drivers', us: true, others: 'Varies' },
    { feature: 'Modern Fleet', us: true, others: 'Mixed' },
    { feature: 'On-time Guarantee', us: '98%', others: '80-85%' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-24">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Why Choose Tanish Logistic?
          </motion.h1>
          <motion.p initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Discover what makes us India's most trusted logistics partner. 
            From reliability to innovation, we deliver excellence in every shipment.
          </motion.p>
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }} className="flex justify-center space-x-8 text-lg">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-400 mr-2" />
              <span>5+ Years Experience</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-400 mr-2" />
              <span>2,500+ Deliveries</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-400 mr-2" />
              <span>98% On-time Rate</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Key Advantages */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Competitive Advantages
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Six reasons why businesses across India trust us with their logistics needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {advantages.map((advantage, index) => {
              const IconComponent = advantage.icon;
              return (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: index * 0.2 }} whileHover={{ scale: 1.03 }} key={index}>
                  <Card className="group bg-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden transform hover:-translate-y-2">
                    <div className={`bg-gradient-to-br ${advantage.color} p-8`}>
                      <IconComponent className="h-12 w-12 text-white mx-auto" />
                    </div>
                    <CardContent className="p-8 text-center">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{advantage.title}</h3>
                      <p className="text-gray-600 text-lg">{advantage.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Comparison Table */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How We Compare
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See the difference that sets us apart from other logistics providers.
            </p>
          </div>
          
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
            <Card className="shadow-2xl rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-lg">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="px-8 py-5 text-left font-semibold">Features</th>
                      <th className="px-8 py-5 text-center font-semibold bg-blue-600">
                        Tanish Logistic
                      </th>
                      <th className="px-8 py-5 text-center font-semibold">Others</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {comparisons.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-8 py-5 font-medium text-gray-900">{item.feature}</td>
                        <td className="px-8 py-5 text-center">
                          {item.us === true ? (
                            <CheckCircle className="h-7 w-7 text-green-500 mx-auto" />
                          ) : (
                            <Badge className="bg-green-100 text-green-800 text-base px-3 py-1 rounded-full">{item.us}</Badge>
                          )}
                        </td>
                        <td className="px-8 py-5 text-center text-gray-600">{item.others}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }} className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.8 }} className="text-4xl md:text-5xl font-bold text-white mb-4">
            Experience the Tanish Logistic Difference
          </motion.h2>
          <motion.p initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 1.0 }} className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied customers who trust us with their logistics needs. 
            Get your free quote today and see why we're India's preferred logistics partner.
          </motion.p>
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 1.2 }} className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-5 text-lg shadow-lg transform hover:scale-105 transition-all duration-300">
              <Link href="/contact">
                Get Free Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-10 py-5 text-lg shadow-lg transform hover:scale-105 transition-all duration-300">
              <Link href="/services">
                Explore Services
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default WhyUs;