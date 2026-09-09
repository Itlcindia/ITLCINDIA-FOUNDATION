'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, ShieldCheck, Clock, Heart, Loader2, CheckCircle2 } from 'lucide-react';
import { PageHero } from "@/components/layout/page-hero";
import Image from "next/image";
import Link from "next/link";
import { motion } from 'framer-motion';
import { useDonationModal } from '@/context/donation-modal-context';

const sectionVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: 'easeOut',
    },
  },
};

const contactInfo = [
  {
    icon: <MapPin className="h-8 w-8 text-[#168039]" />,
    title: "Our NGO Address",
    content: "G1/0049,Olive Wood Villa, Golf City, Lucknow, Uttar Pradesh – 226030"
  },
  {
    icon: <Mail className="h-8 w-8 text-[#168039]" />,
    title: "Email",
    content: "info@itlcfoundation.org",
    href: "mailto:info@itlcfoundation.org"
  }
];

const ContactInfoCard = ({ icon, title, content, href }: { icon: React.ReactNode; title: string; content: string; href?: string; }) => {
    const contentEl = href ? <a href={href} className="hover:text-primary transition-colors">{content}</a> : <p>{content}</p>;
    return (
        <Card className="text-center rounded-xl bg-white border border-[#c8e2d3] shadow-xs">
            <CardContent className="pt-8">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#168039]/10 text-[#168039] mb-4">
                    {icon}
                </div>
                <h3 className="font-headline text-xl font-semibold text-foreground">{title}</h3>
                <div className="mt-1 text-muted-foreground">{contentEl}</div>
            </CardContent>
        </Card>
    );
};

export default function ContactPage() {
  const { openDonationModal } = useDonationModal();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSuccess(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setErrorMessage(data.error || 'Failed to send message. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#dff0e6] min-h-screen text-gray-900">
      <PageHero
        eyebrow="GET IN TOUCH WITH US —"
        title={
          <>
            <span>Contact Our Team in </span>
            <span className="text-[#168039]">Lucknow &amp; UP</span>
          </>
        }
        subtitle="We'd love to hear from you. Whether you want to volunteer, partner, or ask a question, we are here to help our community in Uttar Pradesh."
      />
      <div className="container mx-auto px-4 py-16 md:py-24 space-y-16 md:space-y-24">
        
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={sectionVariants}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {contactInfo.map(info => <ContactInfoCard key={info.title} {...info} />)}
            </div>
        </motion.div>

        <motion.div
          className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={sectionVariants}
        >
          <div className="relative h-full min-h-[300px] md:min-h-[500px] w-full rounded-2xl overflow-hidden shadow-sm border border-[#c8e2d3]">
            <Image
                src="/pro/d.png"
                alt="Volunteers at the best NGO in Lucknow"
                fill
                className="object-cover"
                data-ai-hint="volunteers helping"
              />
          </div>
          <Card className="p-6 md:p-8 shadow-sm rounded-2xl bg-white border border-[#c8e2d3]">
            <CardHeader className="p-0 mb-6">
                <span className="text-[#168039] font-bold text-xs md:text-sm tracking-widest uppercase block font-headline mb-1">
                  COMMUNICATION DESK —
                </span>
                <CardTitle className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight">
                  <span className="text-[#0f5b9e]">Volunteer or</span> <span className="text-[#168039]">Get in Touch</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {isSuccess ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#168039] flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 font-headline">Message Sent Successfully!</h3>
                    <p className="text-xs sm:text-sm text-gray-600 max-w-sm mx-auto">
                      Thank you for contacting ITLC Foundation. Our support desk has received your inquiry and will reply shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsSuccess(false)}
                      className="text-xs font-bold text-[#168039] underline cursor-pointer pt-2 block mx-auto"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {errorMessage && (
                      <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                        {errorMessage}
                      </div>
                    )}
                    <div className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-gray-700">Full Name</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your Name"
                          className="rounded-xl border-gray-300 focus:border-[#168039]"
                        />
                        </div>
                        <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-700">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="you@example.com"
                          className="rounded-xl border-gray-300 focus:border-[#168039]"
                        />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-gray-700">Phone Number (Optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Your phone number"
                        className="rounded-xl border-gray-300 focus:border-[#168039]"
                      />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-gray-700">Subject</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="e.g., Volunteering in Lucknow, Partnership"
                          className="rounded-xl border-gray-300 focus:border-[#168039]"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-gray-700">Message</Label>
                        <Textarea
                          id="message"
                          required
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Tell us how you'd like to get involved with our NGO..."
                          className="rounded-xl border-gray-300 focus:border-[#168039]"
                        />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="lg"
                      className="w-full rounded-full bg-[#168039] hover:bg-[#137233] text-white cursor-pointer"
                    >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            <span>Sending Message...</span>
                          </>
                        ) : (
                          <>
                            <span>Send Message</span>
                            <Send className="ml-2 h-4 w-4" />
                          </>
                        )}
                    </Button>
                  </form>
                )}
                 <div className="mt-6 text-center text-xs text-muted-foreground space-y-1.5">
                    <p className="flex items-center justify-center gap-2"><Clock className="size-3.5 text-[#168039]" /> We typically reply within 24 hours.</p>
                    <p className="flex items-center justify-center gap-2 font-semibold text-[#0f5b9e]"><ShieldCheck className="size-3.5 text-[#168039]" /> Registered NGO in Lucknow, UP</p>
                </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="text-center bg-white p-8 md:p-12 rounded-3xl border border-[#c8e2d3] shadow-xs"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={sectionVariants}
        >
            <span className="text-[#168039] font-bold text-xs md:text-sm tracking-widest uppercase block font-headline mb-1.5">
              COMMUNITY MOBILIZATION —
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-headline mb-4">
              <span className="text-[#0f5b9e]">Join Us in Making a</span> <span className="text-[#168039]">Difference Today.</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">Your support is vital for our social welfare, education, and environmental projects in Uttar Pradesh.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" className="rounded-full cursor-pointer bg-[#168039] hover:bg-[#137233] text-white" onClick={() => openDonationModal()}>
                  Donate Now <Heart className="ml-2 fill-current" />
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-[#c8e2d3]">
                    <Link href="/volunteer">Become a Volunteer in Lucknow</Link>
                </Button>
            </div>
        </motion.div>
      </div>
    </div>
  );
}
