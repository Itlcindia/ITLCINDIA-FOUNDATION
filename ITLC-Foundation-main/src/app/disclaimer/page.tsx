import React from 'react';
import { PageHero } from '@/components/layout/page-hero';
import { Info, AlertTriangle, ExternalLink, ShieldCheck, HeartPulse, MapPin, Mail } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Disclaimer | ITLC Foundation Lucknow',
  description: 'Official Disclaimer of ITLC Foundation regarding general information, Section 80G tax deductions, external links, and social welfare activities in Uttar Pradesh.',
};

export default function DisclaimerPage() {
  const lastUpdated = 'September 8, 2026';

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen">
      <PageHero
        title="Disclaimer"
        subtitle="Important regulatory and informational notices regarding the use of ITLC Foundation web services and charitable activities."
        imageUrl="/pro/ab.png"
        imageHint="disclaimer statement"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-10">
          
          <div className="border-b border-slate-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
            <span><strong>Effective Date:</strong> {lastUpdated}</span>
            <span><strong>Jurisdiction:</strong> Lucknow, Uttar Pradesh, India</span>
          </div>

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5 font-headline">
              <Info className="w-6 h-6 text-[#168039]" />
              <span>1. General Information &amp; Educational Purpose</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              The information provided on the ITLC Foundation website (<Link href="/" className="text-[#168039] font-medium hover:underline">itlcfoundation.org</Link>) is for general informational, educational, and philanthropic awareness purposes only. While we endeavor to keep all information, statistics, and project updates accurate and up to date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or availability with respect to the website or the information, programs, or related graphics contained on the website.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4 bg-amber-50/60 p-6 rounded-2xl border border-amber-200/80">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5 font-headline">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              <span>2. Section 80G Tax Exemption Disclaimer</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-700">
              Contributions made to ITLC Foundation are eligible for tax deduction benefits under Section 80G of the Indian Income Tax Act, 1961, subject to prevailing rules and limits stipulated by the Government of India.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 italic">
              <strong>Notice:</strong> The information provided on this platform does not constitute professional financial, tax, or legal advice. Donors are advised to consult their personal Chartered Accountant (CA) or financial tax consultant to ascertain specific deduction applicability based on their individual tax brackets, residential status, and filing regime.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5 font-headline">
              <HeartPulse className="w-6 h-6 text-[#168039]" />
              <span>3. Animal Welfare &amp; Health First-Aid Disclaimer</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              Articles and guidance published regarding stray dog feeding, street cattle hydration, rabies awareness, or animal emergency first aid are intended solely for basic community awareness and humanitarian assistance. They do not substitute professional veterinary examination, medical diagnosis, surgery, or prescription by licensed veterinary doctors. In any life-threatening animal emergency, always alert qualified local veterinary hospitals or civic animal control authorities.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5 font-headline">
              <ExternalLink className="w-6 h-6 text-[#168039]" />
              <span>4. External Third-Party Links</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              Through this website, you may link to other external websites or payment gateways (including Razorpay, Google Services, banking portals, and social media platforms) that are not under the direct control of ITLC Foundation. We have no control over the nature, content, uptime, and availability of those external sites. The inclusion of any third-party links does not necessarily imply a recommendation or endorse the views expressed within them.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5 font-headline">
              <ShieldCheck className="w-6 h-6 text-[#168039]" />
              <span>5. Limitation of Liability</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              In no event will ITLC Foundation, its trustees, executive members, or volunteers be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or funds arising out of, or in connection with, the use of this website or reliance on its contents.
            </p>
          </section>

          {/* Contact Section */}
          <section className="border-t border-slate-200 pt-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-headline">
              6. Contact for Inquiries
            </h2>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 text-slate-700">
              <p className="font-bold text-slate-900 text-sm">ITLC Foundation &ndash; Administrative &amp; Public Relations</p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#168039] shrink-0" />
                <span>G1/0049, Olive Wood Villa, Golf City, Lucknow, Uttar Pradesh – 226030, India</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#168039] shrink-0" />
                <span>Email: <a href="mailto:info@itlcfoundation.com" className="text-[#168039] font-medium hover:underline">info@itlcfoundation.com</a></span>
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
