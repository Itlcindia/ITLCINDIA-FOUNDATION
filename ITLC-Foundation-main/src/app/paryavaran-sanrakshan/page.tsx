'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Users, CheckCircle, Map, Leaf, Sprout, Wind, Recycle } from 'lucide-react';
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
    icon: <Sprout className="w-10 h-10 text-[#168039]" />,
    title: 'Tree Plantation in Lucknow',
    description: 'We conduct large-scale afforestation drives in villages and cities across Uttar Pradesh to increase green cover and fight climate change.',
  },
  {
    icon: <Recycle className="w-10 h-10 text-[#168039]" />,
    title: 'Cleanliness Campaigns',
    description: 'Our volunteers actively participate in river and public area cleaning programs in Lucknow to promote a healthier environment.',
  },
  {
    icon: <Wind className="w-10 h-10 text-[#168039]" />,
    title: 'Waste Management Workshops',
    description: 'Our environmental NGO holds recycling workshops & awareness sessions in communities about proper waste disposal.',
  },
  {
    icon: <Leaf className="w-10 h-10 text-[#168039]" />,
    title: 'Climate Change Awareness',
    description: 'We organize seminars and school awareness programs on climate change, inspiring the next generation of environmental leaders in UP.',
  },
];

const impactStats = [
    {
        icon: <Leaf className="size-12 text-[#168039]" />,
        value: "5,000+",
        label: "Trees Planted in UP"
    },
    {
        icon: <Users className="size-12 text-[#168039]" />,
        value: "500+",
        label: "Volunteers"
    },
    {
        icon: <CheckCircle className="size-12 text-[#168039]" />,
        value: "15+",
        label: "Awareness Programs"
    },
    {
        icon: <Map className="size-12 text-[#168039]" />,
        value: "10+",
        label: "Cities & Villages Covered"
    }
];

const environmentGalleryImages = PlaceHolderImages.filter(img => img.id.startsWith('gallery-plantation'));

export default function ParyavaranSanrakshanPage() {
  const { openDonationModal } = useDonationModal();
  return (
    <div className="bg-[#dff0e6] min-h-screen text-gray-900">
      <PageHero
        title="Leading Environmental NGO in Lucknow"
        subtitle="Protecting Nature, Planting Trees, and Creating Climate Awareness Across Uttar Pradesh. Join Our Green Mission."
        imageUrl="/pro/ab.png"
        imageHint="hands planting sapling"
      >
        <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="rounded-full cursor-pointer" onClick={() => openDonationModal()}>
              <Sprout className="mr-2 size-5" /> Donate for Environment
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full bg-transparent text-white hover:bg-white hover:text-primary border-white hover:border-white">
                <Link href="/contact">
                    <Users className="mr-2 size-5" /> Volunteer for Green Lucknow
                </Link>
            </Button>
          </div>
      </PageHero>

      <div className="container mx-auto px-4 py-16 md:py-24 space-y-16 md:space-y-24">
        
        <motion.section
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={sectionVariants}
        >
          <span className="text-[#168039] font-bold text-xs md:text-sm tracking-widest uppercase block font-headline mb-1.5">
            CLIMATE ACTION &amp; AFFORESTATION —
          </span>
          <h2 className="font-headline text-2xl md:text-4xl font-extrabold tracking-tight">
            <span className="text-[#0f5b9e]">About Our</span> <span className="text-[#168039]">Environmental Mission in UP</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            ITLC Foundation is a dedicated environmental NGO in Lucknow, working towards tree plantation, cleanliness drives, waste management, and climate awareness campaigns. Our mission is to create a sustainable future for generations to come by protecting and preserving our natural resources in Uttar Pradesh.
          </p>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={sectionVariants}
        >
          <div className="text-center mb-12">
            <span className="text-[#168039] font-bold text-xs md:text-sm tracking-widest uppercase block font-headline mb-1.5">
              FIELD INITIATIVES —
            </span>
            <h2 className="font-headline text-2xl md:text-4xl font-extrabold tracking-tight">
              <span className="text-[#0f5b9e]">Our Environmental</span> <span className="text-[#168039]">Conservation Programs</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programs.map((program) => (
              <Card key={program.title} className="text-center shadow-soft border-0">
                <CardHeader className="items-center p-8">
                   <div className="bg-[#168039]/10 p-4 rounded-full mb-4 text-[#168039]">
                     {program.icon}
                   </div>
                  <CardTitle className="font-headline text-2xl text-[#168039]">{program.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <p className="text-muted-foreground">{program.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="bg-secondary p-8 md:p-16 rounded-2xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={sectionVariants}
        >
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-primary">Our Environmental Impact</h2>
                <p className="mt-4 text-muted-foreground">We measure our success by the positive change we bring to the environment and communities in Lucknow and beyond.</p>
            </div>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {impactStats.map(stat => (
                    <div key={stat.label} className="flex flex-col items-center text-center">
                        {stat.icon}
                        <p className="text-5xl md:text-6xl font-bold text-primary mt-4">{stat.value}</p>
                        <p className="text-lg font-medium text-foreground mt-2">{stat.label}</p>
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
                    Plantation Drive Gallery
                </h2>
                <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
                    Real photos of our environmental initiatives in action. See our environmental NGO at work in Lucknow.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {environmentGalleryImages.map((image: any) => (
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
          <h2 className="text-3xl font-bold">Help Us Build a Greener Uttar Pradesh</h2>
          <p className="mt-4 max-w-2xl mx-auto opacity-90">Your support can help us plant more trees, clean our rivers, and create a greener tomorrow. Join the best environmental NGO in Lucknow.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button size="lg" className="rounded-full bg-white text-primary hover:bg-gray-100 cursor-pointer" onClick={() => openDonationModal()}>
              Donate for a Green Future
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-white text-white hover:bg-white hover:text-primary">
                <Link href="/contact">Become an Environment Volunteer</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-white/70">Your secure donation helps us make Lucknow greener.</p>
        </motion.section>
      </div>
    </div>
  );
}
