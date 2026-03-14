import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, Package, Car, Handshake, CheckCircle, ArrowRight, X } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const Services = () => {
  const [expandedId, setExpandedId] = useState(null);

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const staggerItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    },
    exit: { y: -20, opacity: 0 }
  };

  const services = [
    {
      id: 1,
      title: "Intercity & Interstate Freight",
      description: "Reliable freight transport across cities and states with competitive pricing.",
      icon: Truck,
      features: ["Competitive rates", "Safe handling", "Insurance coverage"],
      color: "from-blue-500 to-blue-600",
      iconColor: "text-white",
      detailedDescription: "Our Intercity & Interstate Freight service is the backbone of your supply chain. We provide seamless transportation of goods between major metropolitan areas and across state lines. Our advanced logistics network ensures that your shipment, whether a single pallet or a full truckload, is handled with the utmost care and efficiency.",
      keyBenefits: ["Extensive Network Coverage", "Flexible Booking & Scheduling", "Cost-Effective & Transparent Pricing"]
    },
    {
      id: 2,
      title: "B2B Cargo Movement",
      description: "Specialized business-to-business cargo solutions for manufacturers, wholesalers, and enterprises.",
      icon: Package,
      features: ["Business solutions", "Bulk handling", "Contract rates", "Dedicated support"],
      color: "from-green-500 to-green-600",
      iconColor: "text-white",
      detailedDescription: "We specialize in B2B cargo movements, providing tailored solutions for your business needs. From raw materials to finished products, we ensure your cargo reaches its destination on time, every time. Our services are designed to integrate with your production and distribution schedules seamlessly.",
      keyBenefits: ["Scheduled & On-Demand Pickups", "Handling of Specialized & Bulk Cargo", "Dedicated Account Management", "Streamlined Invoicing & Reporting"]
    },
    {
      id: 3,
      title: "Fleet-based Transport",
      description: "Modern fleet of vehicles ensuring safe and timely delivery of your valuable cargo nationwide.",
      icon: Car,
      features: ["Modern fleet", "Professional drivers", "Regular maintenance"],
      color: "from-orange-500 to-orange-600",
      iconColor: "text-white",
      detailedDescription: "Our diverse and modern fleet is equipped to handle a wide variety of cargo types and sizes. All our vehicles undergo rigorous maintenance schedules and are driven by trained, professional drivers to guarantee the safety and security of your goods during transit.",
      keyBenefits: ["Wide Range of Vehicle Types", "Adherence to Safety Standards", "Nationwide Reach"]
    },
    {
      id: 4,
      title: "Contract Logistics",
      description: "Long-term logistics partnerships with customized solutions for your specific business needs.",
      icon: Handshake,
      features: ["Custom solutions", "Long-term contracts", "Dedicated support", "Cost optimization"],
      color: "from-purple-500 to-purple-600",
      iconColor: "text-white",
      detailedDescription: "Forge a long-term strategic partnership with us through our Contract Logistics services. We act as an extension of your team, managing your entire supply chain from warehousing to final-mile delivery. This allows you to focus on your core business while we handle the complexities of logistics.",
      keyBenefits: ["End-to-End Supply Chain Management", "Custom-Tailored Logistics Strategy", "Warehousing & Inventory Management", "Significant Cost & Time Savings"]
    }
  ];

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const handleCardClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative bg-gray-900 text-white py-24 overflow-hidden"
      >

        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Our Core Services
          </motion.h1>
          <motion.p initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Comprehensive logistics solutions designed to meet your business needs. 
            From intercity freight to contract logistics, we've got you covered.
          </motion.p>
        </div>
      </motion.section>

      {/* Services Grid */}
      <motion.section style={{ y }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional and reliable logistics services tailored for your business success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              const isExpanded = service.id === expandedId;
              return (
                <motion.div
                  layout
                  key={service.id}
                  transition={{ layout: { type: "spring", stiffness: 300, damping: 30, duration: 0.5 } }}
                >
                  <Card className="group bg-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden">
                    <div className={`bg-gradient-to-br ${service.color} p-8 text-center`}>
                      <IconComponent className={`h-12 w-12 ${service.iconColor} mx-auto mb-4`} />
                      <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                    </div>
                    <CardContent className="p-8">
                      <p className="text-gray-600 text-center mb-6">{service.description}</p>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            variants={staggerContainerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="overflow-hidden"
                          >
                            <div className="border-t pt-6 mt-6 text-left">
                              <motion.p variants={staggerItemVariants} className="text-gray-700 mb-4">{service.detailedDescription}</motion.p>
                              <motion.h4 variants={staggerItemVariants} className="font-bold text-lg mb-2 text-gray-800">Key Benefits:</motion.h4>
                              <motion.ul variants={staggerContainerVariants} className="list-disc list-inside space-y-1 text-gray-600">
                                {service.keyBenefits.map(benefit => <motion.li variants={staggerItemVariants} key={benefit}>{benefit}</motion.li>)}
                              </motion.ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <Button onClick={() => handleCardClick(service.id)} className="w-full mt-6 bg-gray-800 text-white hover:bg-gray-900 transition-colors duration-300 group-hover:bg-blue-600">
                        {isExpanded ? 'Show Less' : 'Learn More'}
                        {isExpanded ? <X className="ml-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}
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
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }} className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </motion.h2>
          <motion.p initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.8 }} className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Contact us today for a customized quote tailored to your logistics needs.
          </motion.p>
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 1.0 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 text-white hover:bg-blue-700 px-10 py-5 text-lg shadow-lg transform hover:scale-105 transition-all duration-300">
              <Link href="/contact">
                Get Quote Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white px-10 py-5 text-lg shadow-lg transform hover:scale-105 transition-all duration-300">
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Services;

