import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Mail, MapPin, Clock, Send, Loader2, Star, ThumbsUp, Building2, CheckCircle2 } from 'lucide-react';
import { SiteMetadata } from '@/components/Layout/Metadata';
import { PublicPageHero, FinalCta } from '@/components/Layout/PublicPage';
import { MovingTruckLoader } from '@/components/Animations/MovingTruckLoader';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
    website: '',
    newsletter: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, service: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const phoneDigits = (formData.phone.match(/\p{Decimal_Number}/gu) || []).length;
    if (phoneDigits < 7 || phoneDigits > 20) {
      toast.error('Please enter a valid phone number (7–20 digits).');
      setIsSubmitting(false);
      return;
    }

    // Use the canonical trailing-slash URL so BotID signs the same path that
    // reaches the API instead of following a 308 redirect after signing.
    const promise = fetch('/api/send-email/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).then(async (response) => {
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || 'Could not send your inquiry. Please try again or call +91 99242 04744.');
      }
      return response.json();
    });

    try {
      await toast.promise(promise, {
        loading: 'Sending freight inquiry...',
        success: (result) => {
          setFormData({ name: '', email: '', phone: '', company: '', service: '', message: '', website: '', newsletter: false });
          return result.warning
            ? 'Inquiry sent, but we could not send a confirmation email.'
            : 'Inquiry sent! Our operations desk will respond shortly.';
        },
        error: (err) => err.message || 'Failed to send message. Please try again or call +91 99242 04744.',
      });
    } catch {
      // The toast already reports the error; keep the form contents for a retry.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans">
      <SiteMetadata
        title="Contact & Operating Hubs — Tanish Logistic | Freight Support"
        description="Contact Tanish Logistic. Direct dispatch lines in Vadodara (Gujarat) and Mandi Gobindgarh (Punjab). Request a freight quote or track your shipment."
      />
      <Toaster position="top-right" reverseOrder={false} />
      {isSubmitting && (
        <MovingTruckLoader
          text="Dispatching Freight Inquiry..."
          subtext="Connecting to Tanish Logistic operations desk..."
        />
      )}

      {/* Enterprise Page Hero */}
      <PublicPageHero
        eyebrow="Direct Communications"
        title="Connect With Our Transport Operations & Dispatch Desks."
        description="Whether booking new lane capacity, requesting a tailored freight quote, or coordinating an active highway shipment, our leadership team is readily accessible."
        primaryLabel="Call Dispatch Desk"
        primaryHref="tel:+919924204744"
        secondaryHref="/book"
        secondaryLabel="Book Transport Online"
      >
        <div className="rounded-2xl border border-white/15 bg-slate-900/80 p-6 backdrop-blur-md">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-400">Response Standards</p>
          <div className="mt-4 space-y-3.5 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Quotes delivered within 2 hours of inquiry</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Direct lines to commercial operations managers</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Dedicated dispatch hotline active 24/7 for shipments</span>
            </div>
          </div>
        </div>
      </PublicPageHero>

      {/* Main Contact Section: Hubs & Form Split */}
      <section className="py-20 sm:py-28 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            {/* Left: Operating Hubs & Direct Channels */}
            <div className="space-y-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-sky-700">Operating Offices</span>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                  Strategic Hub Locations in Punjab & Gujarat.
                </h2>
                <p className="mt-3 text-base text-slate-600 leading-relaxed">
                  Our dual hub structure connects the northern industrial heartland directly with western manufacturing and port corridors.
                </p>
              </div>

              {/* Head Office Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sky-400">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700">Registered Corporate Head Office</span>
                    <h3 className="mt-1 text-lg font-bold text-slate-950">Mandi Gobindgarh (Punjab)</h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      House No. 393, Sector 2, Block B, Adarsh Nagar, Near Mata Rani Mandir, Mandi Gobind Garh, FGS, Punjab, India
                    </p>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-bold text-slate-700">
                      <a href="tel:+919924204744" className="inline-flex items-center gap-1.5 hover:text-sky-700">
                        <Phone className="h-3.5 w-3.5 text-sky-600" />
                        +91 9924204744
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Branch Office Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-emerald-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Western Operations & Logistics Branch</span>
                    <h3 className="mt-1 text-lg font-bold text-slate-950">Vadodara (Gujarat)</h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      Shop No. 04, Udandeep Complex, B/h. Nityanand Complex, Opp. Essar Petrol Pump, Tarsali, Sussen Road, Vadodara - 390009, India
                    </p>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-bold text-slate-700">
                      <a href="tel:+919924204744" className="inline-flex items-center gap-1.5 hover:text-sky-700">
                        <Phone className="h-3.5 w-3.5 text-sky-600" />
                        +91 9924204744
                      </a>
                      <a href="mailto:tanishlogistic744@gmail.com" className="inline-flex items-center gap-1.5 hover:text-sky-700">
                        <Mail className="h-3.5 w-3.5 text-sky-600" />
                        tanishlogistic744@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Operating Hours & Dispatch Notice */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-950">Operating Hours & Support</h3>
                    <div className="mt-2 text-sm text-slate-600 space-y-1">
                      <p><strong>Commercial Desk:</strong> Mon &ndash; Sat: 9:00 AM &ndash; 6:00 PM</p>
                      <p><strong>Sunday Dispatch:</strong> 9:00 AM &ndash; 2:00 PM</p>
                      <p className="text-xs text-sky-700 font-semibold pt-1">
                        &bull; Active Highway Fleet Monitoring: Open 24 Hours / 7 Days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Clean Enterprise Inquiry Form */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-700">Inquiry Form</span>
                <h3 className="mt-1 text-2xl font-extrabold text-slate-950">Send a Commercial Freight Request</h3>
                <p className="mt-1.5 text-sm text-slate-600">Fill in your requirements and our route coordinators will follow up with competitive pricing.</p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {/* Hidden from people and assistive technology; never required. */}
                <div className="hidden" aria-hidden="true">
                  <Label htmlFor="contact-website">Website (leave empty)</Label>
                  <Input
                    id="contact-website"
                    name="website"
                    type="text"
                    value={formData.website}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-bold text-slate-900">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      maxLength={120}
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      className="h-12 border-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-bold text-slate-900">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      maxLength={254}
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      className="h-12 border-slate-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-bold text-slate-900">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      maxLength={60}
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="h-12 border-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-bold text-slate-900">Company Name</Label>
                    <Input
                      id="company"
                      name="company"
                      maxLength={200}
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="e.g. Acme Industrial Ltd."
                      className="h-12 border-slate-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service" className="text-sm font-bold text-slate-900">Service Category</Label>
                  <Select name="service" value={formData.service} onValueChange={handleSelectChange}>
                    <SelectTrigger className="h-12 border-slate-300">
                      <SelectValue placeholder="Select freight service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full Truck Load (FTL)">Full Truckload (FTL) Transport</SelectItem>
                      <SelectItem value="B2B Industrial Cargo">B2B Industrial & Bulk Cargo</SelectItem>
                      <SelectItem value="Dedicated Contract Fleet">Dedicated Contract Fleet</SelectItem>
                      <SelectItem value="Express Highway Dispatch">Express Highway Dispatch</SelectItem>
                      <SelectItem value="Other Logistics Request">Other Transport Inquiry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-bold text-slate-900">Freight Requirements & Route Details *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    maxLength={5000}
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Origin, destination, cargo type, tonnage, expected dispatch timeline..."
                    className="border-slate-300"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-sky-700 hover:bg-sky-800 text-white font-bold text-base shadow-sm transition"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <span>Transmitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      <span>Submit Freight Inquiry</span>
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-slate-500">
                  We treat all shipping and pricing data strictly confidentially. Having trouble with the form?{' '}
                  <a href="tel:+919924204744" className="font-semibold text-sky-700 underline">Call +91 99242 04744</a>.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Corporate Review Form Section */}
      <ReviewForm />

      {/* Final CTA */}
      <FinalCta
        eyebrow="Immediate Transport Assistance"
        title="Prefer to speak directly with an operations coordinator?"
        description="Call our Vadodara or Punjab hub desks to discuss immediate capacity, recurring routes, or corporate contract terms."
        primaryLabel="Call +91 9924204744"
        secondaryLabel="Book Transport Online"
      />
    </div>
  );
};

// Clean Corporate Review Form Component
const ReviewForm = () => {
  const [reviewData, setReviewData] = useState({
    name: '',
    rating: 5,
    comment: '',
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
          platform: 'Site',
        }),
      });

      if (!response.ok) throw new Error('Failed to submit review');

      setSubmitted(true);
      toast.success('Thank you for your rating & feedback!');
    } catch {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mx-auto mb-4">
              <ThumbsUp className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-950">Feedback Received</h3>
            <p className="mt-2 text-sm text-slate-600">Thank you for rating our road freight service. Your feedback helps maintain our high SLA standards.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-700">Client Feedback</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-950">Rate Your Experience With Us</h2>
            <p className="mt-2 text-sm text-slate-600">We appreciate insights from our corporate partners and shippers.</p>
          </div>

          <form onSubmit={handleSubmitReview} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="reviewName" className="text-sm font-bold text-slate-900">Your Name / Organization *</Label>
              <Input
                id="reviewName"
                type="text"
                maxLength={120}
                required
                value={reviewData.name}
                onChange={(e) => setReviewData({ ...reviewData, name: e.target.value })}
                placeholder="e.g. Ramesh Patel, Shreenath Metals"
                className="h-12 border-slate-300"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-900">Your Service Rating *</Label>
              <div className="flex items-center gap-1.5 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                    aria-label={`Rate ${star} out of 5 stars`}
                    className={`p-1.5 transition ${star <= reviewData.rating ? 'text-amber-400' : 'text-slate-200 hover:text-amber-300'}`}
                  >
                    <Star className="h-8 w-8 fill-current" />
                  </button>
                ))}
                <span className="ml-3 text-lg font-bold text-slate-800 tabular-nums">
                  {reviewData.rating} / 5 Stars
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reviewComment" className="text-sm font-bold text-slate-900">Feedback or Review Comments *</Label>
              <Textarea
                id="reviewComment"
                maxLength={5000}
                rows={4}
                required
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                placeholder="Share your experience regarding driver discipline, on-time delivery, route communication..."
                className="border-slate-300"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base transition"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Submitting Review...</span>
                </>
              ) : (
                <span>Submit Service Review</span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
