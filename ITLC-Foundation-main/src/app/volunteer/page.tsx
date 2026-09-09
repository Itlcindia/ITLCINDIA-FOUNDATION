'use client';

import React, { useState } from 'react';
import { PageHero } from '@/components/layout/page-hero';
import {
  Heart,
  Users,
  Award,
  Sparkles,
  TreePine,
  Cat,
  BookOpen,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Smile,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

export default function VolunteerPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: 'Lucknow',
    age: '',
    causeArea: 'Environment & Tree Plantation',
    availability: 'Weekends Only',
    message: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [volunteerId, setVolunteerId] = useState('');

  const causeOptions = [
    'Environment & Tree Plantation',
    'Animal Welfare & Stray Care',
    'Child Education & Mentorship',
    'Women Empowerment & Skill Drives',
    'Social Welfare & Winter Relief',
    'Media, Photography & Storytelling',
    'All Causes / Wherever Needed',
  ];

  const availabilityOptions = [
    'Weekends Only (Saturday/Sunday)',
    'Weekdays (Morning or Evening)',
    'Flexible / On-call for Drives',
    'Virtual / Remote Support (Content/Design)',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSuccess(true);
        setVolunteerId(data.volunteerId || '');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          city: 'Lucknow',
          age: '',
          causeArea: 'Environment & Tree Plantation',
          availability: 'Weekends Only',
          message: '',
        });
      } else {
        setErrorMessage(data.error || 'Failed to submit application. Please check your details.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#dff0e6] min-h-screen text-gray-900">
      <PageHero
        eyebrow="BE A PART OF THE CHANGE —"
        title={
          <>
            <span>Become a Grassroots </span>
            <span className="text-[#168039]">ITLC Volunteer</span>
          </>
        }
        subtitle="Join our passionate community of changemakers in Uttar Pradesh. Lend a helping hand to children, stray animals, and the environment."
        imageUrl="/pro/ab.png"
        imageHint="volunteers planting trees"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-16">
        
        {/* Why Volunteer Section */}
        <section className="space-y-8 text-center">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-[#168039] font-bold text-xs md:text-sm tracking-widest uppercase block font-headline mb-1.5">
              COMMUNITY EMPOWERMENT —
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-headline tracking-tight">
              <span className="text-[#0f5b9e]">Why Become an</span> <span className="text-[#168039]">ITLC Volunteer?</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Volunteering is not just about giving back—it is about discovering purpose, learning ground reality, and leading positive transformation across Uttar Pradesh.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#168039] flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 font-headline">Direct Impact</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Feed stray animals, plant native shade trees, and teach underprivileged children right on the field in Lucknow.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0f5b9e] flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 font-headline">Official Certificate</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive an authorized Certificate of Volunteering &amp; Letter of Recommendation valuable for your career and admissions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 font-headline">Youth Community</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Network with compassionate students, doctors, engineers, and social workers who share your passion for social welfare.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 font-headline">Flexible Timings</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Participate on weekends, monthly drives, or manage social media campaigns remotely according to your schedule.
              </p>
            </div>
          </div>
        </section>

        {/* 4 Core Tracks */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[#168039] font-bold text-xs md:text-sm tracking-widest uppercase block font-headline mb-1">
              FIELD IMPACT TRACKS —
            </span>
            <h3 className="text-xl sm:text-3xl font-black font-headline tracking-tight">
              <span className="text-[#0f5b9e]">Choose Your</span> <span className="text-[#168039]">Volunteering Track</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Select the cause that moves your heart most. You can also participate across multiple tracks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#168039] text-white">
                  <TreePine className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Green Warrior</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Join our Saturday &amp; Sunday morning plantation drives, water saplings, and conduct environmental workshops in schools.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200/60 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#0f5b9e] text-white">
                  <Cat className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Animal Guardian</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Coordinate daily stray feeding drives, install clean water bowls, assist emergency vet visits, and promote humane pet care.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-600 text-white">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Education Mentor</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Teach basic literacy, arithmetic, and digital tools to children in underprivileged clusters, distributing school bags and stationery.
              </p>
            </div>
          </div>
        </section>

        {/* Application Form Section */}
        <section className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden" id="apply">
          <div className="bg-gradient-to-r from-[#083a27] via-[#0d4f34] to-[#083a27] text-white p-6 sm:p-10 text-center">
            <span className="inline-block text-emerald-300 font-bold text-xs md:text-sm uppercase tracking-widest font-headline mb-1.5">
              MAKE A DIFFERENCE TODAY —
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-headline tracking-wide">
              <span>Join Now as a </span><span className="text-emerald-300">Volunteer</span>
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 mt-2 max-w-lg mx-auto">
              Fill out this short form. Our volunteer coordination team will review your details and reach out within 24–48 hours.
            </p>
          </div>

          <div className="p-6 sm:p-10">
            {isSuccess ? (
              <div className="py-12 text-center space-y-5 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#168039] flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 font-headline">
                    Welcome to the Family! 🎉
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Thank you for applying. Your application reference ID is{' '}
                    <strong className="text-[#168039] font-mono">{volunteerId}</strong>. A confirmation email has been dispatched to you.
                  </p>
                </div>
                <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSuccess(false)}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Submit Another Application
                  </button>
                  <Link
                    href="/"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#168039] text-white text-xs font-bold hover:bg-[#137233] transition-colors inline-block"
                  >
                    Return to Home
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
                {errorMessage && (
                  <div className="flex items-center gap-2 p-4 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs sm:text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aditi Sharma"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:border-[#168039] focus:ring-1 focus:ring-[#168039] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="aditi@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:border-[#168039] focus:ring-1 focus:ring-[#168039] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Phone / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:border-[#168039] focus:ring-1 focus:ring-[#168039] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      City / District <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Lucknow"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:border-[#168039] focus:ring-1 focus:ring-[#168039] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Age
                    </label>
                    <input
                      type="number"
                      min="14"
                      max="90"
                      placeholder="22"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:border-[#168039] focus:ring-1 focus:ring-[#168039] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Preferred Cause Area
                    </label>
                    <select
                      value={formData.causeArea}
                      onChange={(e) => setFormData({ ...formData, causeArea: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:border-[#168039] focus:ring-1 focus:ring-[#168039] outline-none bg-white cursor-pointer"
                    >
                      {causeOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Availability
                    </label>
                    <select
                      value={formData.availability}
                      onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:border-[#168039] focus:ring-1 focus:ring-[#168039] outline-none bg-white cursor-pointer"
                    >
                      {availabilityOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Why do you want to volunteer? (Any specific skills or message)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us briefly about your motivation, college/profession, or any skills (e.g. photography, teaching, driving)..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:border-[#168039] focus:ring-1 focus:ring-[#168039] outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-xl bg-[#168039] hover:bg-[#137233] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Volunteer Application</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-center text-slate-500">
                  By submitting, you agree to our{' '}
                  <Link href="/privacy-policy" className="text-[#168039] underline">
                    Privacy Policy
                  </Link>{' '}
                  and{' '}
                  <Link href="/terms-and-conditions" className="text-[#168039] underline">
                    Volunteer Code of Conduct
                  </Link>.
                </p>
              </form>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
