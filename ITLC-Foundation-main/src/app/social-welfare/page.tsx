'use client';

import Image from 'next/image';
import { PageHero } from '@/components/layout/page-hero';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DollarSign,
  HeartPulse,
  BookOpen,
  Home as HomeIcon,
  Users,
  Accessibility,
  Megaphone,
  Heart,
  Users2,
  Sprout,
  Eye,
} from 'lucide-react';
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

// Section 2 Data
const aboutData = {
    mission: {
        icon: <Sprout className="w-10 h-10 text-[#168039]" />,
        title: "Our Mission",
        description: "To empower communities in Lucknow through holistic social welfare programs focusing on health, education, and women empowerment. We strive to create a society where everyone has the opportunity to thrive.",
    },
    vision: {
        icon: <Eye className="w-10 h-10 text-[#168039]" />,
        title: "Our Vision",
        description: "We envision a self-reliant Uttar Pradesh where every individual has access to health, education, and a dignified life. Our NGO works to turn this vision into reality.",
    }
}

// Section 3 Data
const programs = [
  {
    icon: <DollarSign className="w-8 h-8 text-[#168039]" />,
    title: 'Women Empowerment',
    description: 'We run women empowerment programs in Lucknow, providing financial aid and skill development to foster independence.',
  },
  {
    icon: <HeartPulse className="w-8 h-8 text-[#168039]" />,
    title: 'Health & Sanitation',
    description: 'Our health awareness NGO conducts free health checkups, vaccination drives, and nutrition awareness camps in UP.',
  },
  {
    icon: <BookOpen className="w-8 h-8 text-[#168039]" />,
    title: 'Education Support',
    description: 'As an education support NGO in Lucknow, we offer scholarships and literacy programs for children and adults.',
  },
  {
    icon: <HomeIcon className="w-8 h-8 text-[#168039]" />,
    title: 'Housing & Shelter',
    description: 'Our NGO operates an Old Age Home and provides temporary shelters for the homeless in Lucknow.',
  },
  {
    icon: <Users className="w-8 h-8 text-[#168039]" />,
    title: 'Child Welfare Programs',
    description: 'We focus on child welfare through nutrition programs, educational support, and safety workshops.',
  },
  {
    icon: <Accessibility className="w-8 h-8 text-[#168039]" />,
    title: 'Elderly & Disabled Welfare',
    description: 'Our social welfare organization provides dedicated pension schemes, care facilities, and support for the elderly.',
  },
];

// Section 4 Data
const awarenessCampaigns = [
    {
      icon: <Megaphone className="w-8 h-8 text-[#168039]" />,
      title: 'Health & Hygiene',
      description: 'Campaigns on sanitation, nutrition, and vaccine importance to improve community health in Lucknow.',
    },
    {
      icon: <Megaphone className="w-8 h-8 text-[#168039]" />,
      title: 'Women Safety & Empowerment',
      description: 'Conducting workshops and programs in Uttar Pradesh to promote women\'s safety and empowerment.',
    },
    {
      icon: <Megaphone className="w-8 h-8 text-[#168039]" />,
      title: 'Community Workshops',
      description: 'Engaging the community on various social and environmental issues to foster collective growth.',
    },
]

// Section 5 Data (Gallery)
const galleryImages = [
    PlaceHolderImages.find(img => img.id === 'gallery-welfare-1'),
    PlaceHolderImages.find(img => img.id === 'gallery-event-1'),
    PlaceHolderImages.find(img => img.id === 'gallery-welfare-3'),
    PlaceHolderImages.find(img => img.id === 'gallery-event-2'),
    PlaceHolderImages.find(img => img.id === 'gallery-welfare-2'),
].filter(Boolean) as any[];


export default function SocialWelfarePage() {
  const { openDonationModal } = useDonationModal();
  return (
    <div className="bg-[#dff0e6] min-h-screen text-gray-900">
      {/* 1. Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] w-full flex items-center justify-center">
        <Image
          src="/pro/ab.png"
          alt="Empowering Communities in Lucknow for a Better Tomorrow"
          fill
          className="object-cover"
          data-ai-hint="volunteers planting trees"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center text-primary-foreground p-4">
          <h1 className="font-headline text-4xl md:text-6xl font-extrabold drop-shadow-lg">
            Social Welfare &amp; Community Care in Lucknow
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-primary-foreground/90 drop-shadow-md">
            Supporting health, education, women empowerment, and the elderly through our dedicated welfare programs in Uttar Pradesh.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="rounded-full cursor-pointer" onClick={() => openDonationModal()}>
              Donate for Social Welfare <Heart className="ml-2 size-5" />
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full bg-transparent text-white hover:bg-white hover:text-primary border-white hover:border-white">
                <Link href="/contact">
                    Join Our Welfare Campaign <Users2 className="ml-2 size-5" />
                </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 md:py-24 space-y-16 md:space-y-24">
        {/* 2. About Our Work Section */}
        <motion.section
          className="max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={sectionVariants}
        >
          <div className="text-center">
            <span className="text-[#168039] font-bold text-xs md:text-sm tracking-widest uppercase block font-headline mb-1.5">
              GRASSROOTS UPLIFTMENT —
            </span>
            <h2 className="font-headline text-2xl md:text-4xl font-extrabold tracking-tight">
              <span className="text-[#0f5b9e]">About Our</span> <span className="text-[#168039]">Social Welfare Work</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              As a top social welfare organization in Lucknow, ITLC FOUNDATION is committed to uplifting communities. We focus on education support, women empowerment, and health awareness to build a stronger Uttar Pradesh.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="rounded-xl border-0 shadow-soft">
                <CardContent className="p-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-2xl text-accent">{aboutData.mission.title}</h3>
                            <p className="mt-4 text-muted-foreground">{aboutData.mission.description}</p>
                        </div>
                        {aboutData.mission.icon}
                    </div>
                </CardContent>
            </Card>
            <Card className="rounded-xl border-0 shadow-soft">
                 <CardContent className="p-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-2xl text-accent">{aboutData.vision.title}</h3>
                            <p className="mt-4 text-muted-foreground">{aboutData.vision.description}</p>
                        </div>
                        {aboutData.vision.icon}
                    </div>
                </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* 3. Our Programs & Works Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={sectionVariants}
        >
          <div className="text-center mb-12">
            <span className="text-[#168039] font-bold text-xs md:text-sm tracking-widest uppercase block font-headline mb-1.5">
              WELFARE DRIVES —
            </span>
            <h2 className="font-headline text-2xl md:text-4xl font-extrabold tracking-tight">
              <span className="text-[#0f5b9e]">Our Social</span> <span className="text-[#168039]">Welfare Programs</span>
            </h2>
            <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">We run a variety of programs to address the diverse needs of our community in Lucknow and across UP.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <Card key={program.title} className="shadow-soft hover:shadow-deep border-0 transition-all duration-300 bg-white">
                <CardHeader className="flex flex-row items-center gap-4 p-6">
                  <div className="w-12 h-12 rounded-full bg-[#168039]/10 flex items-center justify-center shrink-0">
                    {program.icon}
                  </div>
                  <CardTitle className="font-headline text-xl text-[#168039]">{program.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-0">
                  <p className="text-muted-foreground">{program.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* 4. Jagrukata Abhiyan Section */}
        <motion.section
          className="relative py-24 -mx-4 sm:-mx-8 md:-mx-16 lg:-mx-24 xl:-mx-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={sectionVariants}
        >
          <Image
            src="https://picsum.photos/seed/awareness-bg/1920/1080"
            alt="Community meeting for women empowerment in Uttar Pradesh"
            fill
            className="object-cover"
            data-ai-hint="office meeting"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-white drop-shadow-md">
                Jagrukata Abhiyan (Awareness Campaign<span className="text-accent">s</span>)
              </h2>
              <p className="mt-2 max-w-2xl mx-auto text-white/90 drop-shadow-sm">
                Spreading knowledge on health, education, and women empowerment is key to long-lasting change in our society.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {awarenessCampaigns.map((program) => (
                <Card key={program.title} className="bg-white/95 backdrop-blur-sm border-0 shadow-none hover:shadow-none hover:-translate-y-0">
                  <CardHeader className="flex flex-row items-start gap-4 p-6">
                    <div className="w-12 h-12 rounded-full bg-[#168039]/10 flex items-center justify-center shrink-0">
                      {program.icon}
                    </div>
                    <div>
                      <CardTitle className="font-headline text-xl text-[#168039]">
                        {program.title}
                      </CardTitle>
                      <p className="mt-2 text-muted-foreground">
                        {program.description}
                      </p>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </motion.section>
        
        {/* 5. Glimpses of Our Work Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={sectionVariants}
        >
            <div className="text-center mb-12">
                <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-foreground">
                    Glimpses of Our Welfare Work
                </h2>
                <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
                    Moments that capture the heart of our NGO's mission in action in Lucknow.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {galleryImages.map((image: any) => (
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

        {/* 6. Final CTA Section */}
        <motion.section
          className="bg-primary p-8 md:p-12 rounded-xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={sectionVariants}
        >
            <div className="text-center text-primary-foreground max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold">Together, We Can Make a Difference</h2>
                <p className="mt-4 opacity-90">
                    Support Our Cause. Your small contribution can provide education, health, and empowerment to those who need it most in Lucknow. Join the best NGO in Uttar Pradesh today.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <Button size="lg" className="rounded-full bg-white text-primary hover:bg-gray-100 cursor-pointer" onClick={() => openDonationModal()}>
                      Donate for a Better Future <Heart className="ml-2 size-5" />
                    </Button>
                    <Button asChild size="lg" variant="outline" className="rounded-full border-white text-white hover:bg-white hover:text-primary">
                        <Link href="/contact">Become a Volunteer <Users className="ml-2 size-5" /></Link>
                    </Button>
                </div>
            </div>
        </motion.section>
      </div>
    </div>
  );
}
