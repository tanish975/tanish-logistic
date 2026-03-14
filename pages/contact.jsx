import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Mail, MapPin, Clock, Send, Loader2, Star, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
    newsletter: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+91 6351255716", "+91 9924204744"],
      color: "text-blue-500"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["tanishlogistic744@gmail.com"],
      color: "text-green-500"
    },
    {
      icon: MapPin,
      title: "Address",
      details: ["Shop No. 04, Udandeep Complex", "B/h. Nityanand Complex, Opp. Essar Petrol Pump", "Tarsali, Sussen Road", "Vadodara - 390009, India"],
      color: "text-red-500"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Mon - Sat: 9:00 AM - 6:00 PM", "Sun: 9:00 AM - 2:00 PM"],
      color: "text-purple-500"
    }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, service: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const promise = fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).then(async (response) => {
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'An unexpected error occurred.');
      }
      return response.json();
    });

    toast.promise(promise, {
      loading: 'Sending your message...',
      success: (data) => {
        setFormData({ name: '', email: '', phone: '', company: '', service: '', message: '', newsletter: false });
        return 'Message sent successfully!';
      },
      error: (err) => err.message || 'Failed to send message. Please try again.',
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" reverseOrder={false} />
      {/* Hero Section */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-24">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Contact Us
          </motion.h1>
          <motion.p initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Get in touch with our team for any logistics needs, quotes, or inquiries. 
            We're here to help you succeed.
          </motion.p>
        </div>
      </motion.section>

      {/* Contact Information */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Multiple ways to reach us for your convenience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: index * 0.2 }} key={index}>
                  <Card className="text-center bg-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden transform hover:-translate-y-2">
                    <CardContent className="p-8">
                      <div className={`w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner`}>
                        <IconComponent className={`h-10 w-10 ${info.color}`} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{info.title}</h3>
                      <div className="space-y-2">
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-600 text-lg">{detail}</p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Contact Form */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
            <Card className="shadow-2xl rounded-2xl overflow-hidden">
              <CardHeader className="text-center bg-gray-800 text-white p-10">
                <CardTitle className="text-4xl font-bold">Send us a Message</CardTitle>
                <p className="text-gray-300 text-lg mt-2">We'll get back to you within 24 hours</p>
              </CardHeader>
              <CardContent className="p-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-lg font-medium">Full Name *</Label>
                      <Input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} className="p-4 text-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-lg font-medium">Email Address *</Label>
                      <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="p-4 text-lg" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-lg font-medium">Phone Number</Label>
                      <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} className="p-4 text-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-lg font-medium">Company Name</Label>
                      <Input id="company" name="company" type="text" value={formData.company} onChange={handleChange} className="p-4 text-lg" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service" className="text-lg font-medium">Service Interested In</Label>
                    <Select name="service" value={formData.service} onValueChange={handleSelectChange}>
                      <SelectTrigger className="p-4 text-lg">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="intercity">Intercity Freight</SelectItem>
                        <SelectItem value="b2b">B2B Cargo Movement</SelectItem>
                        <SelectItem value="fleet">Fleet Transport</SelectItem>
                        <SelectItem value="contract">Contract Logistics</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-lg font-medium">Message *</Label>
                    <Textarea id="message" name="message" rows={6} required value={formData.message} onChange={handleChange} placeholder="Tell us about your logistics needs..." className="p-4 text-lg" />
                  </div>

                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="newsletter" name="newsletter" checked={formData.newsletter} onChange={handleChange} className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500" />
                    <Label htmlFor="newsletter" className="text-lg text-gray-600">
                      Subscribe to our newsletter for logistics updates and tips
                    </Label>
                  </div>
                  
                  <Button type="submit" size="lg" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white p-5 text-xl font-bold shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? (
                      <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    ) : (
                      <Send className="mr-3 h-6 w-6" />
                    )}
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* Public Review Form - Rate Our Service */}
      <ReviewForm />
    </div>
  );
};

// Public Review Form Component
const ReviewForm = () => {
  const [reviewData, setReviewData] = useState({
    name: '',
    rating: 5,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reviewData,
          isPublic: true,
          platform: 'Site'
        })
      });

      if (!response.ok) throw new Error('Failed to submit review');

      setSubmitted(true);
      toast.success('Thank you for your review! It helps us improve our service.');
    } catch (error) {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="shadow-2xl rounded-2xl overflow-hidden">
            <CardContent className="p-12">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ThumbsUp className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h3>
              <p className="text-xl text-gray-600 mb-6">Your review has been submitted successfully.</p>
              <p className="text-gray-500">We appreciate your feedback and it helps us serve you better.</p>
            </CardContent>
          </Card>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <Card className="shadow-2xl rounded-2xl overflow-hidden border-2 border-blue-200">
            <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
              <CardTitle className="text-3xl font-bold">Rate Our Service</CardTitle>
              <p className="text-blue-100 text-lg mt-2">Share your experience with Tanish Logistic</p>
            </CardHeader>
            <CardContent className="p-10">
              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="reviewName" className="text-lg font-medium">Your Name</Label>
                  <Input 
                    id="reviewName" 
                    type="text" 
                    required 
                    value={reviewData.name} 
                    onChange={(e) => setReviewData({...reviewData, name: e.target.value})} 
                    placeholder="Enter your name" 
                    className="p-4 text-lg border-2 border-gray-200 focus:border-blue-500" 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-lg font-medium">Your Rating *</Label>
                  <div className="flex items-center gap-2 py-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewData({...reviewData, rating: star})}
                        className={`p-2 transition-transform hover:scale-110 ${star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        <Star className="h-10 w-10 fill-current" />
                      </button>
                    ))}
                    <span className="ml-4 text-2xl font-bold text-gray-700">
                      {reviewData.rating}/5
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reviewComment" className="text-lg font-medium">Your Review *</Label>
                  <Textarea 
                    id="reviewComment" 
                    rows={5} 
                    required 
                    value={reviewData.comment} 
                    onChange={(e) => setReviewData({...reviewData, comment: e.target.value})} 
                    placeholder="Tell us about your experience with our logistics services..." 
                    className="p-4 text-lg border-2 border-gray-200 focus:border-blue-500" 
                  />
                </div>
                
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isSubmitting} 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-5 text-xl font-bold shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                  ) : (
                    <ThumbsUp className="mr-3 h-6 w-6" />
                  )}
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>

                <p className="text-center text-gray-500 text-sm">
                  Your review will help us improve our services and help other customers make informed decisions.
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Contact;
