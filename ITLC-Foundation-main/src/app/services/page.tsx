'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartHandshake, Dog, Leaf } from 'lucide-react';
import { PageHero } from '@/components/layout/page-hero';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

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

const services = [
  {
    icon: <HeartHandshake className="h-12 w-12 text-[#168039]" />,
    title: 'Social Welfare Services',
    description: 'As a leading social welfare organization in Lucknow, hum needy families ko ration, food, education support, aur women empowerment programs provide karte hain.',
    details: [
      'Regular food distribution drives across Lucknow.',
      'Emergency relief kits during crises in Uttar Pradesh.',
      'Support for education for underprivileged children.',
      'Women empowerment and skill development workshops.'
    ],
    image: '/causes/social_welfare_hero.jpg',
    imageHint: 'food distribution',
    href: '/social-welfare',
  },
  {
    icon: <Leaf className="h-12 w-12 text-[#168039]" />,
    title: 'Paryavaran Sanrakshan (Environment)',
    description: 'Our environmental NGO wing in Lucknow organizes plantation drives, cleanliness campaigns, and awareness programs to protect our planet.',
    details: [
      'Tree plantation drives in urban and rural areas of UP.',
      'Cleanliness campaigns for rivers and public spaces.',
      'Waste management and recycling workshops in communities.',
      'Climate change awareness programs in schools.'
    ],
    image: '/causes/environment_hero.jpg',
    imageHint: 'tree plantation',
    href: '/paryavaran-sanrakshan',
  },
  {
    icon: <Dog className="h-12 w-12 text-[#168039]" />,
    title: 'Animal Welfare Services',
    description: 'As a trusted animal welfare NGO in Lucknow, hum stray animals ko feeding, rescue, aur medical treatment support dete hain.',
    details: [
      'Daily feeding programs for stray animals in Lucknow.',
      '24/7 animal rescue services for injured animals.',
      'Free medical treatment and vaccination camps.',
      'Adoption drives to find loving homes for rescued animals.'
    ],
    image: '/causes/animal_welfare_hero.jpg',
    imageHint: 'feeding dog',
    href: '/animal-welfare',
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-[#dff0e6] min-h-screen text-gray-900">
      <PageHero
        title="Our NGO Services in Lucknow"
        subtitle="Discover how our NGO contributes to social welfare, environment, and animal care in Lucknow and across Uttar Pradesh."
        imageUrl="/causes/social_welfare_hero.jpg"
        imageHint="helping hands"
      />
      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          className="space-y-16 md:space-y-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          transition={{ staggerChildren: 0.3 }}
        >
          {services.map((service, index) => (
            <motion.div key={service.title} variants={sectionVariants}>
              <Card className="overflow-hidden shadow-lg border-none">
                <div className="grid md:grid-cols-2 items-center">
                  <div className={`p-6 md:p-12 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                    <div className="flex items-center gap-4">
                      {service.icon}
                      <h2 className="font-headline text-3xl font-extrabold text-primary">
                        {service.title}
                      </h2>
                    </div>
                    <p className="mt-4 text-muted-foreground">
                      {service.description}
                    </p>
                    <ul className="mt-6 space-y-2">
                      {service.details.map((detail) => (
                        <li key={detail} className="flex items-start">
                          <svg className="w-5 h-5 mr-2 text-[#168039] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          <span className="text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="mt-8">
                      <Link href={service.href}>Learn More</Link>
                    </Button>
                  </div>
                  <div className={`relative h-64 sm:h-80 md:h-full ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                      data-ai-hint={service.imageHint}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
