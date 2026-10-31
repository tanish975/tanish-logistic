import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, CheckCircle2, ArrowRight, MapPin, Box, Loader2, Phone, ShieldCheck, Truck, Clock, ArrowLeft } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { SiteMetadata } from '@/components/Layout/Metadata';
import { ClickSuccessButton } from '@/components/Animations/ClickSuccessButton';
import { PublicPageHero } from '@/components/Layout/PublicPage';
import { MovingTruckLoader } from '@/components/Animations/MovingTruckLoader';

const steps = [
  { number: 1, title: 'Cargo Profile', icon: Box, sub: 'Weight & dimensions' },
  { number: 2, title: 'Route & Schedule', icon: MapPin, sub: 'Pickup & drop details' },
  { number: 3, title: 'Shipper Info', icon: User, sub: 'Company & contacts' },
  { number: 4, title: 'Review & Confirm', icon: CheckCircle2, sub: 'Verify dispatch request' }
];

const Book = () => {
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState({
    // Company Info
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    // Cargo Info
    cargoType: '',
    cargoWeight: '',
    cargoLength: '',
    cargoWidth: '',
    cargoHeight: '',
    cargoDescription: '',
    // Service Details
    pickupLocation: '',
    pickupAddress: '',
    dropLocation: '',
    dropAddress: '',
    preferredDate: '',
    preferredTime: '',
    serviceType: '',
    specialInstructions: '',
    website: ''
  });

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (step === 1) {
      if (!bookingData.cargoType.trim() || !bookingData.cargoWeight.trim()) {
        toast.error('Please enter cargo type and weight.');
        return;
      }
    } else if (step === 2) {
      if (
        !bookingData.pickupLocation.trim() ||
        !bookingData.dropLocation.trim() ||
        !bookingData.pickupAddress.trim() ||
        !bookingData.dropAddress.trim() ||
        !bookingData.preferredDate ||
        !bookingData.serviceType
      ) {
        toast.error('Please complete all required route and service fields.');
        return;
      }
    } else if (step === 3) {
      const phoneRegex = /^[0-9]{10,15}$/;
      if (
        !bookingData.companyName.trim() ||
        !bookingData.contactPerson.trim() ||
        !bookingData.phone.trim() ||
        !bookingData.email.trim()
      ) {
        toast.error('Please fill in your company and contact information.');
        return;
      }
      if (!phoneRegex.test(bookingData.phone.replace(/\D/g, ''))) {
        toast.error('Please enter a valid phone number (10-15 digits).');
        return;
      }
    }

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
        customerName: bookingData.companyName,
        contactPerson: bookingData.contactPerson,
        phone: bookingData.phone,
        email: bookingData.email,
        pickup: bookingData.pickupLocation,
        pickupAddress: bookingData.pickupAddress,
        drop: bookingData.dropLocation,
        dropAddress: bookingData.dropAddress,
        goodsType: bookingData.cargoType,
        weight: bookingData.cargoWeight,
        cargoLength: bookingData.cargoLength,
        cargoWidth: bookingData.cargoWidth,
        cargoHeight: bookingData.cargoHeight,
        cargoDescription: bookingData.cargoDescription,
        date: bookingData.preferredDate,
        serviceType: bookingData.serviceType,
        specialInstructions: bookingData.specialInstructions,
        website: bookingData.website
      };

      const response = await fetch('/api/add-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingPayload),
      });

      if (!response.ok) {
        let message = 'Failed to submit booking';
        try {
          const err = await response.json();
          if (err?.message) message = err.message;
        } catch {}
        throw new Error(message);
      }

      const result = await response.json();
      const confirmedId = result.bookingId || result.booking?.bookingId;
      const emailNotice = result.warning ? '&email=unavailable' : '';
      router.push(confirmedId ? `/thank-you?booking=${encodeURIComponent(confirmedId)}${emailNotice}` : '/thank-you');
    } catch (error) {
      console.error("Could not save booking:", error);
      toast.error(error.message || 'Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans">
      <SiteMetadata
        title="Book Cargo Transport — Tanish Logistic | Commercial Road Freight"
        description="Submit your commercial cargo shipment details online. Select cargo weight, pickup origin, drop destination, and company info for fast vehicle placement."
      />
      <Toaster richColors position="top-right" />
      {isSubmitting && (
        <MovingTruckLoader
          text="Verifying Vehicle Placement & Booking..."
          subtext="Transmitting shipment details to commercial dispatch..."
        />
      )}

      {/* Enterprise Page Hero */}
      <PublicPageHero
        eyebrow="Commercial Cargo Booking"
        title="Schedule Your Freight Movement in 4 Simple Steps."
        description="Provide your cargo specifications, pickup and delivery addresses, and preferred dispatch date. Our operations directors verify vehicle fit and confirm schedule."
        primaryHref="/contact"
        primaryLabel="Speak With Dispatch"
        secondaryHref="/services"
        secondaryLabel="View Vehicle Specs"
      >
        <div className="rounded-2xl border border-white/15 bg-slate-900/80 p-6 backdrop-blur-md">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-400">Booking Commitments</p>
          <div className="mt-4 space-y-3.5 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Vehicle confirmation within 2 hours of review</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Direct highway dispatch from verified carrier fleet</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>No advance booking fees required for preliminary quote</span>
            </div>
          </div>
        </div>
      </PublicPageHero>

      {/* Main 2-Column Booking Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Progress Stepper Bar */}
          {step < 5 && (
            <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {steps.map((s) => {
                  const isActive = step === s.number;
                  const isDone = step > s.number;
                  return (
                    <div
                      key={s.number}
                      className={`flex items-center gap-3 rounded-xl p-3 transition ${
                        isActive
                          ? 'bg-sky-50 border border-sky-200'
                          : isDone
                          ? 'bg-emerald-50/60 border border-emerald-100'
                          : 'opacity-60'
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-bold text-sm ${
                          isActive
                            ? 'bg-sky-700 text-white'
                            : isDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="h-5 w-5" /> : s.number}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold truncate ${isActive ? 'text-sky-950' : 'text-slate-900'}`}>
                          {s.title}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">{s.sub}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
            {/* Form Column */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
              <form onSubmit={handleSubmit}>
                <div aria-hidden="true" className="hidden">
                  <label htmlFor="booking-website">Website (leave empty)</label>
                  <input id="booking-website" name="website" type="text" tabIndex={-1} autoComplete="off"
                    value={bookingData.website} onChange={(event) => handleInputChange('website', event.target.value)} />
                </div>
                {/* Step 1: Cargo Info */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-sky-700">Step 01 / 04</span>
                      <h2 className="mt-1 text-2xl font-bold text-slate-950">Cargo Specifications & Dimensions</h2>
                      <p className="mt-1 text-sm text-slate-600">Provide load weight and character to match the ideal chassis and payload capacity.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="cargoType" className="text-sm font-bold text-slate-900">Cargo Type / Commodity *</Label>
                        <Input
                          id="cargoType"
                          value={bookingData.cargoType}
                          onChange={(e) => handleInputChange('cargoType', e.target.value)}
                          placeholder="e.g. Industrial Machinery, Steel Coils, Chemicals..."
                          required
                          className="h-12 border-slate-300 text-slate-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cargoWeight" className="text-sm font-bold text-slate-900">Approx. Weight (kg) *</Label>
                        <Input
                          id="cargoWeight"
                          type="number"
                          value={bookingData.cargoWeight}
                          onChange={(e) => handleInputChange('cargoWeight', e.target.value)}
                          placeholder="e.g. 5000 (for 5 MT)..."
                          required
                          className="h-12 border-slate-300 text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <Label className="text-sm font-bold text-slate-900">Dimensions in Feet (Length x Width x Height)</Label>
                      <div className="grid grid-cols-3 gap-4">
                        <Input
                          id="cargoLength"
                          type="number"
                          value={bookingData.cargoLength}
                          onChange={(e) => handleInputChange('cargoLength', e.target.value)}
                          placeholder="Length (ft)"
                          className="h-12 border-slate-300"
                        />
                        <Input
                          id="cargoWidth"
                          type="number"
                          value={bookingData.cargoWidth}
                          onChange={(e) => handleInputChange('cargoWidth', e.target.value)}
                          placeholder="Width (ft)"
                          className="h-12 border-slate-300"
                        />
                        <Input
                          id="cargoHeight"
                          type="number"
                          value={bookingData.cargoHeight}
                          onChange={(e) => handleInputChange('cargoHeight', e.target.value)}
                          placeholder="Height (ft)"
                          className="h-12 border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <Label htmlFor="cargoDescription" className="text-sm font-bold text-slate-900">Cargo Description & Packaging</Label>
                      <Textarea
                        id="cargoDescription"
                        value={bookingData.cargoDescription}
                        onChange={(e) => handleInputChange('cargoDescription', e.target.value)}
                        placeholder="e.g. Palletized wooden crates, fragile glass items, tarpaulin required..."
                        rows={3}
                        className="border-slate-300"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Route & Service Details */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-sky-700">Step 02 / 04</span>
                      <h2 className="mt-1 text-2xl font-bold text-slate-950">Origin, Destination & Service Type</h2>
                      <p className="mt-1 text-sm text-slate-600">Enter pickup and delivery points to estimate highway routing and transit timing.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="pickupLocation" className="text-sm font-bold text-slate-900">Pickup City / Hub *</Label>
                        <Input
                          id="pickupLocation"
                          value={bookingData.pickupLocation}
                          onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                          placeholder="e.g. Vadodara, Gujarat"
                          required
                          className="h-12 border-slate-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dropLocation" className="text-sm font-bold text-slate-900">Drop City / Destination *</Label>
                        <Input
                          id="dropLocation"
                          value={bookingData.dropLocation}
                          onChange={(e) => handleInputChange('dropLocation', e.target.value)}
                          placeholder="e.g. Mandi Gobindgarh, Punjab"
                          required
                          className="h-12 border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pickupAddress" className="text-sm font-bold text-slate-900">Detailed Pickup Address & Landmark *</Label>
                      <Textarea
                        id="pickupAddress"
                        value={bookingData.pickupAddress}
                        onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                        placeholder="Plant number, industrial estate, landmark, pin code..."
                        rows={2}
                        required
                        className="border-slate-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dropAddress" className="text-sm font-bold text-slate-900">Detailed Drop Address & Receiving Contact *</Label>
                      <Textarea
                        id="dropAddress"
                        value={bookingData.dropAddress}
                        onChange={(e) => handleInputChange('dropAddress', e.target.value)}
                        placeholder="Warehouse gate number, receiver name, contact number, pin code..."
                        rows={2}
                        required
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="preferredDate" className="text-sm font-bold text-slate-900">Preferred Loading Date *</Label>
                        <Input
                          id="preferredDate"
                          type="date"
                          value={bookingData.preferredDate}
                          onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                          required
                          className="h-12 border-slate-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="serviceType" className="text-sm font-bold text-slate-900">Service Category *</Label>
                        <Select onValueChange={(val) => handleInputChange('serviceType', val)} value={bookingData.serviceType}>
                          <SelectTrigger className="h-12 border-slate-300">
                            <SelectValue placeholder="Select service category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Full Truck Load (FTL)">Full Truckload (FTL) Dedicated</SelectItem>
                            <SelectItem value="B2B Industrial Cargo">B2B Industrial Cargo</SelectItem>
                            <SelectItem value="Fleet-based Transport">Dedicated Contract Fleet</SelectItem>
                            <SelectItem value="Express Highway Transit">Express Highway Transit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <Label htmlFor="specialInstructions" className="text-sm font-bold text-slate-900">Special Handling Instructions (Optional)</Label>
                      <Textarea
                        id="specialInstructions"
                        value={bookingData.specialInstructions}
                        onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                        placeholder="e.g. Loading by overhead crane only, strict morning delivery window..."
                        rows={2}
                        className="border-slate-300"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Company Info */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-sky-700">Step 03 / 04</span>
                      <h2 className="mt-1 text-2xl font-bold text-slate-950">Company & Contact Credentials</h2>
                      <p className="mt-1 text-sm text-slate-600">We use these details for billing, driver coordination, and dispatch status updates.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName" className="text-sm font-bold text-slate-900">Company Name / Registered Entity *</Label>
                        <Input
                          id="companyName"
                          value={bookingData.companyName}
                          onChange={(e) => handleInputChange('companyName', e.target.value)}
                          placeholder="e.g. Apex Industrial Solutions Ltd."
                          required
                          className="h-12 border-slate-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPerson" className="text-sm font-bold text-slate-900">Contact Person Name *</Label>
                        <Input
                          id="contactPerson"
                          value={bookingData.contactPerson}
                          onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                          placeholder="e.g. Rajesh Kumar"
                          required
                          className="h-12 border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-bold text-slate-900">Phone Number (with WhatsApp/SMS) *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={bookingData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+91 98765 43210"
                          required
                          className="h-12 border-slate-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-bold text-slate-900">Official Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={bookingData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="logistics@company.com"
                          required
                          className="h-12 border-slate-300"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Review Summary */}
                {step === 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-sky-700">Step 04 / 04</span>
                      <h2 className="mt-1 text-2xl font-bold text-slate-950">Review Your Dispatch Request</h2>
                      <p className="mt-1 text-sm text-slate-600">Please verify details before submitting to our commercial dispatch team.</p>
                    </div>

                    {/* Cargo Overview Card */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-sky-700">01. Cargo Specifications</p>
                        <button type="button" onClick={() => setStep(1)} className="text-xs font-bold text-sky-700 hover:underline">
                          Edit
                        </button>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:text-sm">
                        <div><span className="text-slate-500">Commodity:</span> <strong className="text-slate-900">{bookingData.cargoType}</strong></div>
                        <div><span className="text-slate-500">Weight:</span> <strong className="text-slate-900">{bookingData.cargoWeight} kg</strong></div>
                        {(bookingData.cargoLength || bookingData.cargoWidth || bookingData.cargoHeight) && (
                          <div className="col-span-2">
                            <span className="text-slate-500">Dimensions:</span> <strong className="text-slate-900">{bookingData.cargoLength || '-'} x {bookingData.cargoWidth || '-'} x {bookingData.cargoHeight || '-'} ft</strong>
                          </div>
                        )}
                        {bookingData.cargoDescription && (
                          <div className="col-span-2"><span className="text-slate-500">Notes:</span> <span className="text-slate-700">{bookingData.cargoDescription}</span></div>
                        )}
                      </div>
                    </div>

                    {/* Route Details Card */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-sky-700">02. Route & Schedule</p>
                        <button type="button" onClick={() => setStep(2)} className="text-xs font-bold text-sky-700 hover:underline">
                          Edit
                        </button>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:text-sm">
                        <div><span className="text-slate-500">Origin:</span> <strong className="text-slate-900">{bookingData.pickupLocation}</strong></div>
                        <div><span className="text-slate-500">Destination:</span> <strong className="text-slate-900">{bookingData.dropLocation}</strong></div>
                        <div className="col-span-2"><span className="text-slate-500">Pickup Address:</span> <span className="text-slate-700">{bookingData.pickupAddress}</span></div>
                        <div className="col-span-2"><span className="text-slate-500">Drop Address:</span> <span className="text-slate-700">{bookingData.dropAddress}</span></div>
                        <div><span className="text-slate-500">Loading Date:</span> <strong className="text-slate-900">{bookingData.preferredDate}</strong></div>
                        <div><span className="text-slate-500">Service:</span> <strong className="text-slate-900">{bookingData.serviceType}</strong></div>
                      </div>
                    </div>

                    {/* Company Info Card */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-sky-700">03. Shipper Entity</p>
                        <button type="button" onClick={() => setStep(3)} className="text-xs font-bold text-sky-700 hover:underline">
                          Edit
                        </button>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:text-sm">
                        <div><span className="text-slate-500">Company:</span> <strong className="text-slate-900">{bookingData.companyName}</strong></div>
                        <div><span className="text-slate-500">Contact:</span> <strong className="text-slate-900">{bookingData.contactPerson}</strong></div>
                        <div><span className="text-slate-500">Phone:</span> <strong className="text-slate-900">{bookingData.phone}</strong></div>
                        <div><span className="text-slate-500">Email:</span> <strong className="text-slate-900">{bookingData.email}</strong></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Form Buttons */}
                {step < 5 && (
                  <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
                    {step > 1 ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="h-11 px-5 border-slate-300 font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Previous
                      </Button>
                    ) : (
                      <div />
                    )}

                    {step < 4 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="h-11 px-7 font-bold text-white bg-sky-700 hover:bg-sky-800 ml-auto"
                      >
                        <span>Continue</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
<ClickSuccessButton
                        type="submit"
                        disabled={isSubmitting}
                        className="h-11 px-8 font-bold text-white bg-emerald-600 hover:bg-emerald-700 ml-auto shadow-md"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <span>Confirming Booking...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            <span>Submit Freight Booking</span>
                          </>
                        )}
                      </ClickSuccessButton>
                    )}
                  </div>
                )}
              </form>
            </div>

            {/* Right Sticky Booking Summary & SLA Column */}
            <div className="space-y-6">
              {/* Dynamic Live Shipment Summary Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-sky-700">Live Shipment Preview</p>
                <div className="mt-4 space-y-3.5 text-xs">
                  <div>
                    <span className="text-slate-400">Route:</span>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {bookingData.pickupLocation || 'Origin Hub'} &rarr; {bookingData.dropLocation || 'Destination Hub'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Cargo & Weight:</span>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {bookingData.cargoType || 'Not specified'} {bookingData.cargoWeight ? `(${bookingData.cargoWeight} kg)` : ''}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Service Category:</span>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {bookingData.serviceType || 'Standard FTL'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Loading Date:</span>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {bookingData.preferredDate || 'To be selected'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Institutional Transport Guarantees */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-900">Enterprise SLA Guarantees</p>
                <div className="mt-4 space-y-3 text-xs text-slate-600">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Commercial carrier verified driver & vehicle documentation</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Clock className="h-4 w-4 text-sky-700 shrink-0 mt-0.5" />
                    <span>98.2% on-time transit SLA along primary national highway corridors</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Truck className="h-4 w-4 text-sky-700 shrink-0 mt-0.5" />
                    <span>Pre-trip mechanical inspection and cargo tarpaulin lashing</span>
                  </div>
                </div>
              </div>

              {/* Direct Dispatch Support Contact */}
              <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-sky-900">Need Immediate Booking Help?</p>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Have unique dimensional cargo or urgent departure requirements? Call our dispatch desk directly:
                </p>
                <a
                  href="tel:+919924204744"
                  className="mt-3 inline-flex items-center gap-2 font-bold text-sky-800 text-sm hover:underline"
                >
                  <Phone className="h-4 w-4 text-sky-600" />
                  <span>+91 9924204744</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Book;
