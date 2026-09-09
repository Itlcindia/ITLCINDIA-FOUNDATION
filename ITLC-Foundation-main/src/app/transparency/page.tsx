'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/layout/page-hero";
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

const reports = [
  {
    title: "Expense Reports",
    description: "Detailed breakdown of our operational and project-related expenditures. As a top NGO in Lucknow, we ensure full transparency.",
    files: [
      { name: "Q1 2024 Expense Report.pdf", link: "#" },
      { name: "Q4 2023 Expense Report.pdf", link: "#" },
    ]
  },
  {
    title: "Donation Usage Reports",
    description: "Reports showing how every donation to our NGO has been allocated across different social welfare, education, and environmental projects in Uttar Pradesh.",
    files: [
      { name: "Donation Utilization Report - 2023.pdf", link: "#" },
    ]
  },
  {
    title: "Registration & Legal Certificates",
    description: "Official documents confirming our legal status as a registered non-profit organization in India, including our 80G certificate.",
    files: [
      { name: "NGO Registration Certificate.pdf", link: "#" },
      { name: "Tax Exemption Certificate (80G).pdf", link: "#" },
    ]
  },
  {
    title: "Annual NGO Reports",
    description: "Comprehensive yearly summaries of our activities, impact in Lucknow and UP, and financial health.",
    files: [
      { name: "Annual Report 2023.pdf", link: "#" },
      { name: "Annual Report 2022.pdf", link: "#" },
    ]
  }
];

export default function TransparencyPage() {
  return (
    <div className="bg-background">
      <PageHero
        title="Transparency & Trust at Our NGO"
        subtitle="We maintain complete transparency in all our activities and donations. Our supporters can view reports, legal documents, and impact updates anytime."
        imageUrl="https://picsum.photos/seed/transparency-hero/1920/1080"
        imageHint="magnifying glass documents"
      />
      <motion.div
        className="container mx-auto px-4 py-16 md:py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        variants={sectionVariants}
      >
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {reports.map((report) => (
              <AccordionItem key={report.title} value={report.title}>
                <AccordionTrigger className="text-xl font-headline hover:no-underline text-primary">
                  {report.title}
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-secondary/30 rounded-b-md">
                  <p className="text-muted-foreground">{report.description}</p>
                  <div className="mt-4 space-y-2">
                    {report.files.map((file) => (
                      <a 
                        key={file.name} 
                        href={file.link} 
                        download
                        className="flex items-center justify-between p-3 bg-background rounded-md hover:bg-secondary transition-colors"
                      >
                        <span className="font-medium text-foreground">{file.name}</span>
                        <Button variant="ghost" size="icon">
                          <Download className="h-5 w-5 text-[#168039]" />
                        </Button>
                      </a>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </motion.div>
    </div>
  );
}
