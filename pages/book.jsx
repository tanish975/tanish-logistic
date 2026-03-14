import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Package, Truck, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';

const Book = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    pickupLocation: '',
    pickupAddress: '',
    dropLocation: '',
    dropAddress: '',
    cargoType: '',
    cargoWeight: '',
    cargoValue: '',
    cargoDescription: '',
    preferredDate: '',
    preferredTime: '',
    serviceType: '',
    specialInstructions: ''
  });

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const bookingPayload = {
        companyName: bookingData.companyName,
        contactPerson: bookingData.contactPerson,
        phone: bookingData.phone,
        email: bookingData.email,
        pickupLocation: bookingData.pickupLocation,
        pickupAddress: bookingData.pickupAddress,
        dropLocation: bookingData.dropLocation,
        dropAddress: bookingData.dropAddress,
        cargoType: bookingData.cargoType,
        cargoWeight: bookingData.cargoWeight,
        cargoValue: bookingData.cargoValue,
        cargoDescription: bookingData.cargoDescription,
        preferredDate: bookingData.preferredDate,
        serviceType: bookingData.serviceType,
        specialInstructions: bookingData.specialInstructions,
      };

      const response = await fetch('/api/add-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingPayload),
      });

      if (!response.ok) {
        throw new Error('Failed to submit booking');
      }

      setStep(5);
    } catch (error) {
      console.error("Could not save booking:", error);
      toast.error('Failed to submit booking. Please try again.');
      return; // Prevent proceeding to the next step
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Company Info', icon: Package },
    { number: 2, title: 'Service Details', icon: Truck },
    { number: 3, title: 'Cargo Info', icon: Package },
    { number: 4, title: 'Review', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster richColors />
      {/* Header */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
            Book Your Cargo Transport
          </h1>
          
          {/* Progress Steps */}
          <div className="flex justify-center items-center space-x-4 md:space-x-8">
            {steps.map((stepItem, index) => {
              const IconComponent = stepItem.icon;
              const isActive = step === stepItem.number;
              const isCompleted = step > stepItem.number;
              
              return (
                <React.Fragment key={stepItem.number}>
                  <div className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 border-4 ${isCompleted ? 'bg-green-500 border-green-600' : isActive ? 'bg-blue-500 border-blue-600' : 'bg-gray-600 border-gray-700'}`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <span className={`text-lg font-semibold ${isActive ? 'text-white' : 'text-gray-400'}`}>
                      {stepItem.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden md:block w-24 h-1 ${step > stepItem.number ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Form Content */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gray-100 p-8">
              <CardTitle className="text-3xl font-bold text-gray-800">
                Step {step}: {steps[step - 1]?.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-8">
                    {/* Step 1 content as before */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <Label htmlFor="companyName" className="text-lg">Company Name *</Label>
                        <Input id="companyName" value={bookingData.companyName} onChange={(e) => handleInputChange('companyName', e.target.value)} placeholder="Enter your company name" required className="p-4 text-lg" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPerson" className="text-lg">Contact Person *</Label>
                        <Input id="contactPerson" value={bookingData.contactPerson} onChange={(e) => handleInputChange('contactPerson', e.target.value)} placeholder="Contact person name" required className="p-4 text-lg" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-lg">Phone Number *</Label>
                        <Input id="phone" type="tel" value={bookingData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} placeholder="+91-XXXXXXXXXX" required className="p-4 text-lg" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-lg">Email Address *</Label>
                        <Input id="email" type="email" value={bookingData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="your@email.com" required className="p-4 text-lg" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <Label htmlFor="pickupLocation" className="text-lg">Pickup Location *</Label>
                        <Input id="pickupLocation" value={bookingData.pickupLocation} onChange={(e) => handleInputChange('pickupLocation', e.target.value)} placeholder="e.g., City, State" required className="p-4 text-lg" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dropLocation" className="text-lg">Drop Location *</Label>
                        <Input id="dropLocation" value={bookingData.dropLocation} onChange={(e) => handleInputChange('dropLocation', e.target.value)} placeholder="e.g., City, State" required className="p-4 text-lg" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pickupAddress" className="text-lg">Pickup Address *</Label>
                      <Textarea id="pickupAddress" value={bookingData.pickupAddress} onChange={(e) => handleInputChange('pickupAddress', e.target.value)} placeholder="Full pickup address" required className="p-4 text-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dropAddress" className="text-lg">Drop Address *</Label>
                      <Textarea id="dropAddress" value={bookingData.dropAddress} onChange={(e) => handleInputChange('dropAddress', e.target.value)} placeholder="Full drop-off address" required className="p-4 text-lg" />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <Label htmlFor="preferredDate" className="text-lg">Preferred Date *</Label>
                            <Input id="preferredDate" type="date" value={bookingData.preferredDate} onChange={(e) => handleInputChange('preferredDate', e.target.value)} required className="p-4 text-lg" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="serviceType" className="text-lg">Service Type *</Label>
                            <Select onValueChange={(value) => handleInputChange('serviceType', value)} value={bookingData.serviceType}>
                                <SelectTrigger className="p-4 text-lg"><SelectValue placeholder="Select a service type" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="intercity-interstate-freight">Intercity & Interstate Freight</SelectItem>
                                    <SelectItem value="b2b-cargo-movement">B2B Cargo Movement</SelectItem>
                                    <SelectItem value="fleet-based-transport">Fleet-based Transport</SelectItem>
                                    <SelectItem value="contract-logistics">Contract Logistics</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <Label htmlFor="cargoType" className="text-lg">Cargo Type *</Label>
                                <Input id="cargoType" value={bookingData.cargoType} onChange={(e) => handleInputChange('cargoType', e.target.value)} placeholder="e.g., Electronics, Textiles" required className="p-4 text-lg" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cargoWeight" className="text-lg">Cargo Weight (kg) *</Label>
                                <Input id="cargoWeight" type="number" value={bookingData.cargoWeight} onChange={(e) => handleInputChange('cargoWeight', e.target.value)} placeholder="e.g., 500" required className="p-4 text-lg" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cargoValue" className="text-lg">Cargo Value (INR)</Label>
                            <Input id="cargoValue" type="number" value={bookingData.cargoValue} onChange={(e) => handleInputChange('cargoValue', e.target.value)} placeholder="e.g., 100000" className="p-4 text-lg" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cargoDescription" className="text-lg">Cargo Description</Label>
                            <Textarea id="cargoDescription" value={bookingData.cargoDescription} onChange={(e) => handleInputChange('cargoDescription', e.target.value)} placeholder="Briefly describe the cargo" className="p-4 text-lg" />
                        </div>
                    </motion.div>
                )}

                {step === 4 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Review Your Booking</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 p-6 border rounded-lg bg-gray-50">
                            <div><Label className="font-semibold">Company:</Label><p className="text-gray-700">{bookingData.companyName}</p></div>
                            <div><Label className="font-semibold">Contact:</Label><p className="text-gray-700">{bookingData.contactPerson}</p></div>
                            <div><Label className="font-semibold">Phone:</Label><p className="text-gray-700">{bookingData.phone}</p></div>
                            <div><Label className="font-semibold">Email:</Label><p className="text-gray-700">{bookingData.email}</p></div>
                            <div className="md:col-span-2"><hr/></div>
                            <div><Label className="font-semibold">Pickup:</Label><p className="text-gray-700">{bookingData.pickupLocation}</p></div>
                            <div><Label className="font-semibold">Drop-off:</Label><p className="text-gray-700">{bookingData.dropLocation}</p></div>
                            <div className="md:col-span-2"><Label className="font-semibold">Pickup Address:</Label><p className="text-gray-700">{bookingData.pickupAddress}</p></div>
                            <div className="md:col-span-2"><Label className="font-semibold">Drop-off Address:</Label><p className="text-gray-700">{bookingData.dropAddress}</p></div>
                            <div className="md:col-span-2"><hr/></div>
                            <div><Label className="font-semibold">Service Type:</Label><p className="text-gray-700">{bookingData.serviceType}</p></div>
                            <div><Label className="font-semibold">Preferred Date:</Label><p className="text-gray-700">{bookingData.preferredDate}</p></div>
                            <div className="md:col-span-2"><hr/></div>
                            <div><Label className="font-semibold">Cargo Type:</Label><p className="text-gray-700">{bookingData.cargoType}</p></div>
                            <div><Label className="font-semibold">Weight:</Label><p className="text-gray-700">{bookingData.cargoWeight} kg</p></div>
                            <div><Label className="font-semibold">Value:</Label><p className="text-gray-700">₹{bookingData.cargoValue}</p></div>
                            <div className="md:col-span-2"><Label className="font-semibold">Description:</Label><p className="text-gray-700">{bookingData.cargoDescription}</p></div>
                        </div>
                    </motion.div>
                )}

                {step === 5 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="text-center space-y-4">
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                        <h2 className="text-2xl font-bold">Booking Submitted!</h2>
                        <p className="text-lg text-gray-600">Thank you for your booking. We will get back to you shortly with a confirmation and further details.</p>
                    </motion.div>
                )}

                {step < 5 && (
                  <div className="flex justify-between mt-12 pt-8 border-t">
                    {step > 1 && step < 5 && (
                      <Button type="button" variant="outline" onClick={prevStep} size="lg" className="px-8 py-4 text-lg">
                        Previous
                      </Button>
                    )}
                    {step < 4 && (
                      <Button type="button" onClick={nextStep} className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                        Next Step
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    )}
                    {step === 4 && (
                      <Button type="submit" disabled={isSubmitting} className="ml-auto bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg">
                          Confirm Booking
                          <CheckCircle className="ml-2 h-5 w-5" />
                      </Button>
                    )}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </motion.section>
    </div>
  );
};

export default Book;