'use client';

import { AIStoryGenerator } from '@/components/ai-story-generator';
import { PageHero } from '@/components/layout/page-hero';
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

export default function AIToolPage() {
  return (
    <div className="bg-secondary/30">
      <PageHero
        title="AI-Powered Story Generator"
        subtitle="Transform your impact data into powerful narratives. This tool, powered by Google's Gemini, helps you craft compelling stories tailored to your audience, saving you time while maximizing your outreach."
        imageUrl="/pro/ab.png"
        imageHint="robot writing"
      />
      <motion.div
        className="container mx-auto px-4 py-16 md:py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto">
          <AIStoryGenerator />
        </div>
      </motion.div>
    </div>
  );
}
