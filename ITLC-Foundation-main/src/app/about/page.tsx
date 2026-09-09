'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHero } from '@/components/layout/page-hero';
import { FileText, ClipboardList, BadgeInfo, FileCheck2, Calendar, ShieldCheck, ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const sectionVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: 'easeOut',
    },
  },
};

const cardContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

const coreValues = [
  { name: 'Compassion', description: 'Driving our actions to help those in need across Lucknow.' },
  { name: 'Transparency', description: 'As a trusted NGO, ensuring every contribution is accounted for.' },
  { name: 'Dedication', description: 'Committing ourselves tirelessly to our social welfare cause.' },
  { name: 'Responsibility', description: 'Taking ownership of our role in creating a better Uttar Pradesh.' },
];

const registrationDetails = [
    { label: 'Document Identification Number', value: 'AACTI3479DE2024101', icon: <FileText className="h-6 w-6 text-primary" /> },
    { label: 'Application Number', value: '720535320211124', icon: <ClipboardList className="h-6 w-6 text-primary" /> },
    { label: 'Unique Registration Number', value: 'AACTI3479DE20241', icon: <BadgeInfo className="h-6 w-6 text-primary" /> },
    { label: 'Registration Section', value: '02-Item (A) of sub-clause (vi) of clause (ac) of sub-section (1) of section 12A', icon: <FileCheck2 className="h-6 w-6 text-primary" /> },
    { label: 'Date of Provisional Registration', value: '28-11-2024', icon: <Calendar className="h-6 w-6 text-primary" /> },
    { label: 'Validity', value: 'AY 2025–26 to AY 2027–28', icon: <ShieldCheck className="h-6 w-6 text-primary" /> },
];

export default function AboutPage() {
  return (
    <div className="bg-[#dff0e6] min-h-screen text-gray-900">
      <PageHero
        eyebrow="ABOUT ITLC FOUNDATION —"
        title={<><span>About Our Foundation — </span><span className="text-emerald-300">Leading NGO in Lucknow</span></>}
        subtitle="Creating real impact across Uttar Pradesh through compassion, action, and transparency."
        imageUrl="/pro/ab.png"
        imageHint="community working together"
      />
      <div className="container mx-auto px-4 py-16 md:py-24">
        
        <motion.div 
          className="grid md:grid-cols-2 gap-16 items-center"
          initial={false}
          animate="visible"
          variants={sectionVariants}
        >
            <div>
                <span className="text-[#168039] font-bold text-xs md:text-sm tracking-widest uppercase block font-headline mb-2">
                  ABOUT ITLC FOUNDATION —
                </span>
                <h2 className="mt-2 font-extrabold text-3xl leading-tight md:text-5xl font-headline tracking-tight">
                  <span className="text-[#0f5b9e] block">India&apos;s Trusted Social Welfare</span>
                  <span className="text-[#168039] block">Organization in Lucknow</span>
                </h2>
                <p className="mt-6 text-lg text-muted-foreground">
                ITLC Foundation is a top-rated non-profit organization in Lucknow, Uttar Pradesh, dedicated to creating tangible and lasting impact. We focus on critical areas like social welfare, women empowerment, environmental responsibility, and animal care, driven by a mission of compassion and a commitment to action. We believe in uplifting our community, one step at a time.
                </p>
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <h3 className="text-xl font-bold text-foreground">Our Mission</h3>
                    <p className="mt-2 text-muted-foreground">To serve humanity, protect nature, and save lives through dedicated, on-the-ground action across Uttar Pradesh.</p>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-foreground">Our Vision</h3>
                    <p className="mt-2 text-muted-foreground">A world where every being is treated with respect, and both people and planet thrive in harmony. We aim to be the best NGO in Lucknow.</p>
                </div>
                </div>
                <Button asChild size="lg" className="mt-10 rounded-full px-8">
                    <Link href="/contact">Get Involved with Our NGO</Link>
                </Button>
            </div>

            <div className="group relative h-full overflow-hidden rounded-2xl shadow-soft">
                <Image
                    src="/pro/1.png"
                    alt="Team of the best NGO in Lucknow working together"
                    width={600}
                    height={700}
                    className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    data-ai-hint="happy volunteers"
                />
            </div>
        </motion.div>

        <motion.div 
          className="mt-16 md:mt-24 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
          <span className="text-[#168039] font-bold text-xs md:text-sm tracking-widest uppercase block font-headline mb-1.5">
            FOUNDER&apos;S VISION —
          </span>
          <h3 className="font-headline text-3xl font-extrabold tracking-tight">
            <span className="text-[#0f5b9e]">Words From Our</span> <span className="text-[#168039]">Leadership</span>
          </h3>
          <blockquote className="relative mt-6 mx-auto max-w-3xl text-xl md:text-2xl font-body italic text-foreground">
            <span className="absolute -top-4 -left-8 font-serif text-6xl text-[#168039]/30">“</span>
            Hum believe karte hain ki choti choti madad bhi kisi ki zindagi badal sakti hai. Hamara maksad Lucknow aur pure UP mein ek positive change laana hai.
            <span className="absolute -bottom-8 -right-8 font-serif text-6xl text-[#168039]/30">”</span>
          </blockquote>
        </motion.div>

        <motion.div 
          className="mt-16 md:mt-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
          <div className="text-center">
            <span className="text-[#168039] font-bold text-xs md:text-sm tracking-widest uppercase block font-headline mb-1.5">
              TRANSPARENCY &amp; COMPLIANCE —
            </span>
            <h3 className="font-headline text-3xl font-extrabold tracking-tight">
              <span className="text-[#0f5b9e]">Government Approvals &amp;</span> <span className="text-[#168039]">12A/80G Certifications</span>
            </h3>
            <p className="mt-2 text-muted-foreground">Our commitment to transparency as a registered NGO in India.</p>
          </div>
          <motion.div 
            className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
            variants={cardContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
              {registrationDetails.map((detail) => (
                  <motion.div key={detail.label} variants={cardVariants}>
                    <Card className="text-center h-full">
                        <CardContent className="pt-6">
                          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                              {detail.icon}
                          </div>
                          <p className="mt-4 font-semibold text-lg text-foreground truncate" title={detail.label}>{detail.label}</p>
                          <p className="mt-1 text-muted-foreground break-words text-sm">{detail.value}</p>
                        </CardContent>
                    </Card>
                  </motion.div>
              ))}
          </motion.div>
        </motion.div>

        <motion.div 
          className="mt-16 md:mt-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
          <div className="text-center">
            <span className="text-[#168039] font-bold text-xs md:text-sm tracking-widest uppercase block font-headline mb-1.5">
              OUR GUIDING PRINCIPLES —
            </span>
            <h3 className="text-center font-headline text-3xl font-extrabold tracking-tight">
              <span className="text-[#0f5b9e]">Our Guiding</span> <span className="text-[#168039]">Core Values</span>
            </h3>
          </div>
          <motion.div 
            className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
            variants={cardContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {coreValues.map((value) => (
              <motion.div key={value.name} variants={cardVariants}>
                <Card className="text-center h-full">
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl text-primary">
                      {value.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          className="mt-16 md:mt-24 text-center bg-secondary p-8 md:p-12 rounded-xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
            <h2 className="text-3xl font-bold text-foreground mb-6">Join us in making a difference in Lucknow.</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">Your time and support can change lives. Become a part of the best NGO in Uttar Pradesh.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg" className="rounded-full">
                    <Link href="/donate">Donate to Our Cause <Heart className="ml-2" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full">
                    <Link href="/contact">Become a Volunteer</Link>
                </Button>
            </div>
        </motion.div>
      </div>
    </div>
  );
}
