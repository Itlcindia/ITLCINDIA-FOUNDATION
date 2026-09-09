import React from 'react';
import { PageHero } from '@/components/layout/page-hero';
import { Scale, CheckCircle2, AlertCircle, FileCheck, ShieldAlert, MapPin, Mail } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions | ITLC Foundation Lucknow',
  description: 'Terms and Conditions governing the use of ITLC Foundation website, donations, 80G tax exemptions, and volunteer engagements.',
};

export default function TermsAndConditionsPage() {
  const lastUpdated = 'September 8, 2026';

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen">
      <PageHero
        title="Terms & Conditions"
        subtitle="Please read these terms carefully before accessing or donating through the ITLC Foundation platform."
        imageUrl="/pro/ab.png"
        imageHint="terms legal document"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-10">
          
          <div className="border-b border-slate-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
            <span><strong>Effective Date:</strong> {lastUpdated}</span>
            <span><strong>Governing Law:</strong> Laws of the Republic of India</span>
          </div>

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5 font-headline">
              <Scale className="w-6 h-6 text-[#168039]" />
              <span>1. Agreement to Terms</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              These Terms and Conditions constitute a legally binding agreement between you and <strong>ITLC Foundation</strong>, a non-profit non-governmental organization headquartered in Lucknow, Uttar Pradesh. By accessing our website, donating, or participating as a volunteer, you agree to be bound by these terms. If you disagree with any part of these terms, please do not use our services.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5 font-headline">
              <FileCheck className="w-6 h-6 text-[#168039]" />
              <span>2. Charitable Donations &amp; Section 80G Receipts</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              All voluntary donations contributed to ITLC Foundation are deployed strictly towards charitable purposes including environmental protection, animal welfare, underprivileged education, and community relief in Uttar Pradesh.
            </p>
            <ul className="space-y-2 text-sm sm:text-base text-slate-600 list-disc list-inside pl-2">
              <li><strong>Tax Benefit Eligibility:</strong> Eligible donations qualify for tax deductions under Section 80G of the Indian Income Tax Act, 1961, as amended by the Finance Act.</li>
              <li><strong>Receipt Dispatch:</strong> Official 80G tax-exemption receipts are generated electronically upon successful transaction verification and dispatched to the donor&apos;s registered email address.</li>
              <li><strong>PAN Requirement:</strong> To ensure deduction validity under Indian Income Tax rules (Form 10BD/10BE), donors are encouraged to provide their valid Permanent Account Number (PAN).</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5 font-headline">
              <AlertCircle className="w-6 h-6 text-[#168039]" />
              <span>3. Donation Cancellation &amp; Refund Policy</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              As a charitable non-profit organization utilizing funds immediately for ongoing on-ground social projects (such as food distribution, animal medical aid, and tree saplings), donations once made are generally non-refundable. However, in the rare event of a technical error (such as erroneous duplicate debit or incorrect amount entered due to payment gateway glitch), donors may submit a refund request within <strong>7 days</strong> of the transaction date with supporting bank proof to <a href="mailto:donation@itlcfoundation.com" className="text-[#168039] font-medium underline">donation@itlcfoundation.com</a>. Upon administrative review, verified excess deductions will be refunded via original payment mode within 7–10 business days.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5 font-headline">
              <CheckCircle2 className="w-6 h-6 text-[#168039]" />
              <span>4. Intellectual Property Rights</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              All original text, high-definition photographs, emblems, campaign graphics, and software scripts displayed on this website are the intellectual property of ITLC Foundation. Visitors are permitted to share articles, reports, and photos for non-commercial awareness creation and social advocacy, provided proper attribution is given to ITLC Foundation with a hyperlink to our official portal.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5 font-headline">
              <ShieldAlert className="w-6 h-6 text-[#168039]" />
              <span>5. Volunteer Engagement &amp; Code of Conduct</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              Individuals registering through our Volunteer Portal agree to uphold the dignity, non-discrimination ethics, and safety guidelines of ITLC Foundation. Volunteers are expected to treat all community members, children, and animal life with respect, empathy, and care. ITLC Foundation reserves the right to terminate volunteer association in the event of behavioral misconduct.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-headline">
              6. Governing Law &amp; Legal Jurisdiction
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              These Terms and Conditions shall be governed by and construed in accordance with the substantive laws of India. Any legal dispute, controversy, or claim arising out of or relating to this website or donations shall be subject to the exclusive jurisdiction of the competent courts in <strong>Lucknow, Uttar Pradesh, India</strong>.
            </p>
          </section>

          {/* Contact */}
          <section className="border-t border-slate-200 pt-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-headline">
              7. Questions Regarding Terms
            </h2>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 text-slate-700">
              <p className="font-bold text-slate-900 text-sm">ITLC Foundation &ndash; Administrative Headquarters</p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#168039] shrink-0" />
                <span>G1/0049, Olive Wood Villa, Golf City, Lucknow, Uttar Pradesh – 226030, India</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#168039] shrink-0" />
                <span>Email: <a href="mailto:info@itlcfoundation.org" className="text-[#168039] font-medium hover:underline">info@itlcfoundation.org</a></span>
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
