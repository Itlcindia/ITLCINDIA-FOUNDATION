'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Home as HomeIcon, PawPrint, Users, Stethoscope } from 'lucide-react';
import { PageHero } from '@/components/layout/page-hero';
import { PlaceHolderImages } from '@/lib/placeholder-images';
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

const programs = [
  {
    icon: <PawPrint className="w-8 h-8 text-[#168039]" />,
    title: 'Animal Rescue in Lucknow',
    description: 'Our team provides 24/7 animal rescue services in Lucknow for stray, injured, or abandoned animals, giving them a safe haven for recovery.',
  },
  {
    icon: <HomeIcon className="w-8 h-8 text-[#168039]" />,
    title: 'Shelter & Adoption Drives',
    description: 'We operate clean, safe shelters and run adoption programs in Lucknow to find loving forever homes for rescued animals.',
  },
  {
    icon: <Stethoscope className="w-8 h-8 text-[#168039]" />,
    title: 'Veterinary Care & Treatment',
    description: 'Our NGO offers regular checkups, vaccinations, spaying/neutering, and emergency medical treatments for animals in need.',
  },
];

const impactStats = [
    {
        icon: <PawPrint className="size-12 text-[#168039]" />,
        value: "800+",
        label: "Animals Rescued in Lucknow"
    },
    {
        icon: <Heart className="size-12 text-[#168039]" />,
        value: "300+",
        label: "Animals Adopted"
    },
    {
        icon: <Users className="size-12 text-[#168039]" />,
        value: "500+",
        label: "Volunteers Engaged"
    }
];

const animalGalleryImages = PlaceHolderImages.filter(img => img.id.startsWith('gallery-animal'));


export default function AnimalWelfarePage() {
  const { openDonationModal } = useDonationModal();
  return (
    <div className="bg-[#dff0e6] min-h-screen text-gray-900">
      <PageHero
        title="Animal Welfare NGO in Lucknow"
        subtitle="Join our mission to rescue, protect, and provide a better life for animals in need across Uttar Pradesh."
        imageUrl="/pro/ab.png"
        imageHint="rescue dog hand"
      />

      <div className="container mx-auto px-4 py-16 md:py-24 space-y-16 md:space-y-24">
        
        <motion.section
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={sectionVariants}
        >
          <span className="text-[#168039] font-bold text-xs md:text-sm tracking-widest uppercase block font-headline mb-1.5">
            RESCUE &amp; REHABILITATION —
          </span>
          <h2 className="font-headline text-2xl md:text-4xl font-extrabold tracking-tight">
            <span className="text-[#0f5b9e]">Our Commitment to</span> <span className="text-[#168039]">Animal Welfare in Uttar Pradesh</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            At ITLC Foundation, we are a leading animal welfare NGO in Lucknow, dedicated to changing lives through rescue, rehabilitation, awareness campaigns, and community support. Your help allows us to be a voice for the voiceless.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <Card>
                <CardHeader>
                    <CardTitle className="text-primary">Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">To rescue every stray and abandoned animal in Lucknow, provide them with shelter, food, and medical care, and find them loving forever homes. Your support can make this possible.</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="text-primary">Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">A world where every animal is treated with compassion, and communities in Uttar Pradesh are educated on animal rights and responsible ownership. Join our movement.</p>
                </CardContent>
            </Card>
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={sectionVariants}
        >
          <div className="text-center mb-12">
            <span className="text-[#168039] font-bold text-xs md:text-sm tracking-widest uppercase block font-headline mb-1.5">
              FIELD INTERVENTIONS —
            </span>
            <h2 className="font-headline text-2xl md:text-4xl font-extrabold tracking-tight">
              <span className="text-[#0f5b9e]">Our Animal</span> <span className="text-[#168039]">Welfare Programs</span>
            </h2>
            <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">Our work covers everything from 24/7 animal rescue in Lucknow to adoption drives and community awareness.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <Card key={program.title} className="text-center">
                <CardHeader className="items-center">
                   <div className="bg-[#168039]/10 p-4 rounded-full mb-4">
                     {program.icon}
                   </div>
                  <CardTitle className="font-headline text-xl text-[#168039]">{program.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{program.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="bg-secondary/50 p-8 md:p-16 rounded-2xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={sectionVariants}
        >
            <div className="max-w-4xl mx-auto text-center">
                <span className="text-[#168039] font-bold text-xs md:text-sm tracking-widest uppercase block font-headline mb-1.5">
                  MEASURABLE OUTCOMES —
                </span>
                <h2 className="font-headline text-2xl md:text-4xl font-extrabold tracking-tight">
                  <span className="text-[#0f5b9e]">Our Ground Impact</span> <span className="text-[#168039]">in Numbers</span>
                </h2>
                <p className="mt-4 text-muted-foreground">The numbers speak for themselves, but the wagging tails and happy purrs tell the real story of our success as an animal welfare NGO in Lucknow.</p>
            </div>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
                {impactStats.map(stat => (
                    <div key={stat.label} className="text-center">
                        {stat.icon}
                        <p className="text-4xl md:text-5xl font-bold text-primary mt-2">{stat.value}</p>
                        <p className="text-lg font-medium text-foreground mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={sectionVariants}
        >
            <div className="text-center mb-12">
                <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-primary">
                    Glimpses of Our Work
                </h2>
                <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
                    Moments that capture the heart of our mission in action. See our animal rescue work in Lucknow.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {animalGalleryImages.map((image: any) => (
                    <div key={image.id} className="overflow-hidden rounded-lg shadow-soft group">
                      <Image
                          src={image.imageUrl}
                          alt={image.description}
                          width={600}
                          height={450}
                          className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-105"
                          data-ai-hint={image.imageHint}
                      />
                    </div>
                ))}
            </div>
        </motion.section>

        <motion.section
          className="bg-primary text-primary-foreground p-8 md:p-12 rounded-xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={sectionVariants}
        >
          <span className="inline-block text-emerald-300 font-bold text-xs md:text-sm uppercase tracking-widest font-headline mb-2">
            STAND WITH US —
          </span>
          <h2 className="text-2xl md:text-4xl font-black font-headline">
            <span>Help Us Build a Better </span><span className="text-emerald-300">Future for Animals</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto opacity-90">Your support can provide a safe haven and a second chance for an animal in need in Lucknow. Donate or volunteer with our NGO today.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button size="lg" className="rounded-full bg-white text-primary hover:bg-gray-100 cursor-pointer" onClick={() => openDonationModal()}>
              Donate for Animal Welfare
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-white text-white hover:bg-white hover:text-primary">
                <Link href="/contact">Volunteer for Animals</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-white/70">Your donation is secure and tax-deductible.</p>
        </motion.section>
      </div>
    </div>
  );
}
