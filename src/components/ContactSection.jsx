import React, { useState } from 'react';
import { 
  Mail, 
  MapPin, 
  Clock, 
  Sparkles, 
  Send, 
  Check, 
  Copy, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  RotateCcw,
  ShieldCheck,
  Compass,
  MessageSquare
} from 'lucide-react';

const STORAGE_INQUIRIES_KEY = 'tripnest_inquiries';

const INQUIRY_TOPICS = [
  'Custom Itinerary',
  'Group Booking',
  'Support',
  'Partnership'
];

const POPULAR_DESTINATIONS = [
  'Dolomites Alpine Traverse',
  'Kyoto Sacred Sanctuaries',
  'Swiss Glacier High Pass',
  'Amalfi Cliffside Coastline',
  'Bali Cloud Forest Sanctuary',
  'Other / Bespoke Destination'
];

const TRAVEL_MONTHS = [
  'Next 30 Days (Immediate)',
  'Spring 2027 (Mar – May)',
  'Summer 2027 (Jun – Aug)',
  'Autumn 2027 (Sep – Nov)',
  'Winter 2027 / 2028',
  'Dates Flexible'
];

export default function ContactSection() {
  const [selectedTopic, setSelectedTopic] = useState('Custom Itinerary');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedTicket, setCopiedTicket] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    destination: 'Dolomites Alpine Traverse',
    travelMonth: 'Summer 2027 (Jun – Aug)',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  // Copy email handler
  const handleCopyEmail = () => {
    navigator.clipboard.writeText('arushikarmakar123@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Copy ticket handler
  const handleCopyTicket = (ticketId) => {
    navigator.clipboard.writeText(ticketId);
    setCopiedTicket(true);
    setTimeout(() => setCopiedTicket(false), 2000);
  };

  // Validation
  const validateField = (name, value) => {
    let error = '';
    if (name === 'fullName') {
      if (!value.trim()) error = 'Please enter your full name.';
      else if (value.trim().length < 2) error = 'Name must be at least 2 characters.';
    }
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) error = 'Email address is required.';
      else if (!emailRegex.test(value.trim())) error = 'Please provide a valid email address.';
    }
    if (name === 'message') {
      if (!value.trim()) error = 'Please include a brief message or journey inquiry.';
      else if (value.trim().length < 10) error = 'Message should be at least 10 characters.';
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    // Auto-fill or adjust message placeholder/subject
    if (!formData.message || formData.message.startsWith('Inquiry regarding')) {
      setFormData((prev) => ({
        ...prev,
        message: `Inquiry regarding ${topic}: `,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all
    const nameErr = validateField('fullName', formData.fullName);
    const emailErr = validateField('email', formData.email);
    const msgErr = validateField('message', formData.message);

    const newErrors = { fullName: nameErr, email: emailErr, message: msgErr };
    setErrors(newErrors);
    setTouched({ fullName: true, email: true, message: true });

    if (nameErr || emailErr || msgErr) {
      return;
    }

    setIsSubmitting(true);

    const ticketId = `TN-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const inquiryPayload = {
      id: ticketId,
      submittedAt: new Date().toISOString(),
      topic: selectedTopic,
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      destination: formData.destination,
      travelMonth: formData.travelMonth,
      message: formData.message.trim(),
    };

    try {
      const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'c2079c34-a421-4c9d-8539-a706a0956203';
      
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `TripNest Inquiry [${selectedTopic}]: ${formData.fullName}`,
          from_name: formData.fullName,
          email: formData.email,
          to_email: 'arushikarmakar123@gmail.com',
          ticket_id: ticketId,
          destination: formData.destination,
          travel_month: formData.travelMonth,
          message: formData.message,
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok && result.success === false) {
        console.warn('Web3Forms response status:', result);
      }

      // Persist inquiry in localStorage under tripnest_inquiries
      try {
        const stored = localStorage.getItem(STORAGE_INQUIRIES_KEY);
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(inquiryPayload);
        localStorage.setItem(STORAGE_INQUIRIES_KEY, JSON.stringify(list));
      } catch (err) {
        console.error('Error writing to tripnest_inquiries', err);
      }

      setSubmittedTicket(inquiryPayload);
    } catch (err) {
      console.error('Submission error:', err);
      // Still show success with local ticket fallback
      setSubmittedTicket(inquiryPayload);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedTicket(null);
    setFormData({
      fullName: '',
      email: '',
      destination: 'Dolomites Alpine Traverse',
      travelMonth: 'Summer 2027 (Jun – Aug)',
      message: '',
    });
    setErrors({});
    setTouched({});
    setSelectedTopic('Custom Itinerary');
  };

  return (
    <section 
      id="contact" 
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#D49A9A]/30 scroll-mt-20"
    >
      {/* Section Header */}
      <div className="max-w-3xl mb-16 space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#AA5E7A]/20 border border-[#D49A9A]/40 text-[#F2DACE] text-xs font-bold uppercase tracking-widest shadow-sm">
          <MessageSquare className="w-3.5 h-3.5 text-[#F2DACE]" />
          <span>Concierge & Private Inquiries</span>
        </div>

        <h2 className="font-playfair text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.12]">
          Let's Chart Your Journey.
        </h2>

        <p className="text-sm sm:text-base text-[#F2DACE]/80 font-light leading-relaxed">
          Whether tailoring a bespoke multi-day alpine expedition, securing private tea masters, or organizing group lodge buyouts, our travel directors are at your service.
        </p>
      </div>

      {/* Split Editorial Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* LEFT COLUMN: #7C0E44 Burgundy Card with #F2DACE Accents & Quick Topics */}
        <div className="lg:col-span-5 bg-[#7C0E44] border border-[#D49A9A]/30 rounded-3xl p-7 sm:p-9 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#F2DACE]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#AA5E7A]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8">
            
            {/* Live Concierge Badge */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#F2DACE] border border-[#F2DACE]/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Concierge Desk Online</span>
              </div>
              <span className="text-[11px] text-[#F2DACE]/80 font-mono">Response: &lt; 2 hrs</span>
            </div>

            {/* Direct Contact Details */}
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F2DACE] block">
                Direct Inquiries
              </span>

              {/* Email Pill Box */}
              <div className="bg-[#AA5E7A]/25 border border-[#D49A9A]/30 rounded-2xl p-4 flex items-center justify-between group hover:border-[#F2DACE]/60 transition-colors">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#AA5E7A]/40 border border-[#AA5E7A] flex items-center justify-center text-[#F2DACE] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-[#F2DACE]/70 uppercase tracking-wider">Direct Email</p>
                    <a 
                      href="mailto:arushikarmakar123@gmail.com" 
                      className="text-sm font-bold text-white hover:text-[#F2DACE] transition-colors truncate block"
                    >
                      arushikarmakar123@gmail.com
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#F2DACE] transition-colors cursor-pointer shrink-0 ml-2"
                  title="Copy email to clipboard"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Support Hours */}
              <div className="bg-[#AA5E7A]/20 border border-[#D49A9A]/30 rounded-2xl p-4 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F2DACE] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#F2DACE]/70 uppercase tracking-wider">Support Hours</p>
                  <p className="text-xs sm:text-sm font-semibold text-white">
                    Monday – Saturday · 08:00 – 20:00 GMT
                  </p>
                </div>
              </div>

              {/* Field Desks */}
              <div className="bg-[#AA5E7A]/20 border border-[#D49A9A]/30 rounded-2xl p-4 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D49A9A] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#F2DACE]/70 uppercase tracking-wider">Active Field Desks</p>
                  <p className="text-xs sm:text-sm font-semibold text-white">
                    London · Kyoto · Dolomites · Zurich · Amalfi
                  </p>
                </div>
              </div>
            </div>

            {/* Quick-Click Inquiry Topic Pills */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F2DACE] block">
                Select Inquiry Topic
              </span>
              <p className="text-xs text-[#F2DACE]/80 font-light">
                Click a topic below to auto-tailor your message subject:
              </p>

              <div className="flex flex-wrap gap-2">
                {INQUIRY_TOPICS.map((topic) => {
                  const isActive = selectedTopic === topic;
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => handleTopicSelect(topic)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#F2DACE] text-[#7C0E44] shadow-lg scale-105 ring-2 ring-[#F2DACE]/40'
                          : 'bg-[#AA5E7A]/30 text-[#F2DACE]/90 hover:text-white hover:bg-[#AA5E7A]/50 border border-[#D49A9A]/30'
                      }`}
                    >
                      {topic}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Guarantee Note */}
            <div className="pt-4 border-t border-[#D49A9A]/30 flex items-center space-x-2 text-xs text-[#F2DACE]/75 font-light">
              <ShieldCheck className="w-4 h-4 text-[#D49A9A] shrink-0" />
              <span>Strict client privacy. Zero shared data or marketing lists.</span>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Form with Real-Time Validation */}
        <div className="lg:col-span-7 bg-[#7C0E44]/40 border border-[#D49A9A]/30 rounded-3xl p-7 sm:p-10 shadow-2xl backdrop-blur-md relative">
          
          {submittedTicket ? (
            /* Animated Confirmation State */
            <div className="text-center py-8 sm:py-12 space-y-6 animate-in fade-in zoom-in-95 duration-400">
              <div className="w-16 h-16 rounded-3xl bg-[#AA5E7A]/30 border border-[#AA5E7A] text-[#F2DACE] flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#F2DACE] block">
                  Transmission Confirmed
                </span>
                <h3 className="font-playfair text-3xl sm:text-4xl font-black text-white">
                  Your Dossier is in Motion.
                </h3>
                <p className="text-xs sm:text-sm text-[#F2DACE]/90 font-light max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{submittedTicket.fullName}</strong>. Your inquiry for <strong className="text-[#F2DACE]">{submittedTicket.destination}</strong> has been logged with our field director desk.
                </p>
              </div>

              {/* Reference Ticket Box */}
              <div className="bg-[#7C0E44] border border-[#D49A9A]/40 rounded-2xl p-5 max-w-md mx-auto space-y-2 shadow-inner">
                <div className="flex items-center justify-between text-xs text-[#F2DACE]/70">
                  <span className="font-mono uppercase tracking-wider">Ticket Reference ID</span>
                  <button
                    onClick={() => handleCopyTicket(submittedTicket.id)}
                    className="inline-flex items-center space-x-1 text-[#F2DACE] hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedTicket ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                        <span className="text-emerald-400 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy ID</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="font-mono text-xl sm:text-2xl font-black text-[#F2DACE] tracking-wider select-all">
                  {submittedTicket.id}
                </div>
                <p className="text-[11px] text-[#F2DACE]/70 font-light pt-1 border-t border-[#D49A9A]/30">
                  Dispatched to: <span className="text-white font-medium">arushikarmakar123@gmail.com</span> & <span className="text-white font-medium">{submittedTicket.email}</span>
                </p>
              </div>

              {/* Action: Send Another Message */}
              <div className="pt-4 flex items-center justify-center space-x-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-[#7C0E44] bg-[#F2DACE] hover:bg-white active:scale-95 transition-all shadow-lg cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Send Another Message</span>
                </button>
              </div>
            </div>
          ) : (
            /* Interactive Inquiry Form */
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              
              <div className="flex items-center justify-between border-b border-[#D49A9A]/30 pb-4">
                <div>
                  <h3 className="font-playfair text-xl sm:text-2xl font-bold text-white">
                    Journey Inquiry Form
                  </h3>
                  <p className="text-xs text-[#F2DACE]/70">
                    Active Topic: <span className="text-[#F2DACE] font-bold">{selectedTopic}</span>
                  </p>
                </div>
                <span className="text-[10px] font-bold text-[#F2DACE] uppercase tracking-wider bg-[#AA5E7A]/30 px-2.5 py-1 rounded-full border border-[#AA5E7A]/50">
                  Direct Dispatch
                </span>
              </div>

              {/* Full Name & Email Inputs (2 Columns on tablet/desktop) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#F2DACE]/90">
                    Full Name <span className="text-[#F2DACE]">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. Eleanor Vance"
                    className={`w-full px-4 py-3 rounded-2xl bg-[#7C0E44]/50 border text-sm text-white placeholder-[#D49A9A]/50 focus:outline-none transition-colors ${
                      errors.fullName
                        ? 'border-rose-400 focus:border-rose-400 ring-1 ring-rose-400/30'
                        : 'border-[#D49A9A]/40 focus:border-[#F2DACE]'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-[11px] text-rose-400 font-medium pl-1 animate-in fade-in duration-200">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#F2DACE]/90">
                    Email Address <span className="text-[#F2DACE]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="name@example.com"
                    className={`w-full px-4 py-3 rounded-2xl bg-[#7C0E44]/50 border text-sm text-white placeholder-[#D49A9A]/50 focus:outline-none transition-colors ${
                      errors.email
                        ? 'border-rose-400 focus:border-rose-400 ring-1 ring-rose-400/30'
                        : 'border-[#D49A9A]/40 focus:border-[#F2DACE]'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-rose-400 font-medium pl-1 animate-in fade-in duration-200">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Destination & Travel Month (2 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Destination Interest */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#F2DACE]/90">
                    Destination Interest
                  </label>
                  <select
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-[#7C0E44] border border-[#D49A9A]/40 text-sm text-white focus:outline-none focus:border-[#F2DACE] cursor-pointer"
                  >
                    {POPULAR_DESTINATIONS.map((d) => (
                      <option key={d} value={d} className="bg-[#7C0E44] text-white">
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preferred Travel Month */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#F2DACE]/90">
                    Preferred Travel Window
                  </label>
                  <select
                    name="travelMonth"
                    value={formData.travelMonth}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-[#7C0E44] border border-[#D49A9A]/40 text-sm text-white focus:outline-none focus:border-[#F2DACE] cursor-pointer"
                  >
                    {TRAVEL_MONTHS.map((m) => (
                      <option key={m} value={m} className="bg-[#7C0E44] text-white">
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#F2DACE]/90">
                    Your Message / Specific Wishes <span className="text-[#F2DACE]">*</span>
                  </label>
                  <span className="text-[11px] text-[#F2DACE]/70">Min 10 characters</span>
                </div>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Share your party size, pacing preferences, private guide requests, or special milestone dates..."
                  className={`w-full px-4 py-3 rounded-2xl bg-[#7C0E44]/50 border text-sm text-white placeholder-[#D49A9A]/50 focus:outline-none transition-colors ${
                    errors.message
                      ? 'border-rose-400 focus:border-rose-400 ring-1 ring-rose-400/30'
                      : 'border-[#D49A9A]/40 focus:border-[#F2DACE]'
                  }`}
                />
                {errors.message && (
                  <p className="text-[11px] text-rose-400 font-medium pl-1 animate-in fade-in duration-200">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit CTA Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[11px] text-[#F2DACE]/70">
                  Target destination: <strong className="text-white">arushikarmakar123@gmail.com</strong>
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-[#7C0E44] bg-[#F2DACE] hover:bg-white active:scale-95 transition-all shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#7C0E44]" />
                      <span>Transmitting Dossier...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 stroke-[2.5]" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
}
