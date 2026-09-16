'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Linkedin, 
  ArrowRight,
  Leaf,
  PawPrint,
  Sparkles,
  GraduationCap,
  Droplets,
  HeartHandshake,
  Mail,
  MapPin
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export function Footer() {
  const pathname = usePathname();
  const [logo, setLogo] = useState<string>('/ref/logo.png');
  const [email, setEmail] = useState<string>('info@itlcfoundation.com');
  const [address, setAddress] = useState<string>('G1/0049, Olive Wood Villa, Golf City, Lucknow, Uttar Pradesh – 226030');
  const [social, setSocial] = useState<any>({});

  useEffect(() => {
    fetch('/api/content/cms', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data?.site?.logo) setLogo(data.site.logo);
        if (data?.site?.email || data?.contact?.email) setEmail(data.site?.email || data.contact?.email);
        if (data?.site?.address || data?.contact?.address) setAddress(data.site?.address || data.contact?.address);
        if (data?.footer?.social) setSocial(data.footer.social);
      })
      .catch(() => {});
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="relative w-full overflow-hidden">
      {/* Top Multi-Layer Organic Curved/Wavy Top Border */}
      <div className="w-full overflow-hidden leading-none pointer-events-none select-none -mb-[1px]">
        <svg
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
          className="relative block w-full h-10 sm:h-12 md:h-14 lg:h-16"
        >
          {/* Layer 1: Vibrant Green Wave Layer (#168039) */}
          <path
            d="M0,36 C60,14 110,10 180,10 C270,10 360,42 480,44 C570,46 640,22 720,22 C800,22 870,44 960,42 C1040,40 1120,20 1200,28 L1200,80 L0,80 Z"
            fill="#168039"
          />

          {/* Layer 2: Main Dark Green Footer Wave Layer (#083a27) */}
          <path
            d="M0,46 C60,24 110,20 180,20 C270,20 360,52 480,54 C570,56 640,32 720,32 C800,32 870,54 960,52 C1040,50 1120,30 1200,38 L1200,80 L0,80 Z"
            fill="#083a27"
          />

          {/* Layer 3: Thin Light-Green Decorative Accent Wave Line (#a3e6c0) */}
          <path
            d="M0,45 C60,23 110,19 180,19 C270,19 360,51 480,53 C570,55 640,31 720,31 C800,31 870,53 960,51 C1040,49 1120,29 1200,37"
            fill="none"
            stroke="#a3e6c0"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Main Dark Green Footer Body */}
      <div className="bg-[#083a27] text-white pt-2 sm:pt-4 pb-8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-4">
        {/* Main 4 Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 pb-12">
          
          {/* Column 1: Brand Info */}
          <div className="flex flex-col items-start space-y-4">
            <div className="flex flex-col items-center gap-3.5">
              <Link href="/" className="inline-flex items-center justify-center group cursor-pointer" aria-label="ITLC Foundation Home">
                <div className="bg-white rounded-full p-2 sm:p-2.5 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-md">
                  <Image
                    src={logo || '/ref/logo.png'}
                    alt="ITLC Foundation Logo"
                    width={96}
                    height={96}
                    className="h-16 w-16 md:h-20 md:w-20 object-contain"
                  />
                </div>
              </Link>

              {/* Social Icons Row */}
              <div className="flex items-center justify-center gap-3">
                <Link
                  href={social?.facebook || "https://facebook.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </Link>
                <Link
                  href={social?.instagram || "https://instagram.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </Link>
                <Link
                  href={social?.youtube || "https://youtube.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                </Link>
                <Link
                  href={social?.linkedin || "https://linkedin.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </Link>
                <Link
                  href={social?.twitter || "https://x.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <span className="font-bold text-xs">𝕏</span>
                </Link>
              </div>

              {/* Dynamic Email Display */}
              <div className="text-center sm:text-left space-y-1 text-xs text-white/80 pt-1">
                <p className="flex items-center gap-1.5 justify-center sm:justify-start">
                  <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-emerald-300 transition-colors underline font-medium">
                    {email}
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-white transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog &amp; Insights
                </Link>
              </li>
              <li>
                <Link href="/volunteer" className="hover:text-white transition-colors text-emerald-300 font-medium">
                  Volunteer
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/donate" className="hover:text-white transition-colors text-emerald-200 font-semibold">
                  Donate Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Our Focus */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide mb-3 flex items-center gap-2">
              <span>Our Focus Areas</span>
              <span className="w-6 h-[2px] bg-emerald-400/60 rounded-full" />
            </h3>
            <ul className="space-y-2.5 text-xs text-white/85">
              <li>
                <Link
                  href="/paryavaran-sanrakshan"
                  prefetch={true}
                  className="group inline-flex items-center gap-2.5 hover:text-white transition-all py-0.5"
                >
                  <span className="w-6 h-6 rounded-md bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.35)] transition-all duration-200 group-hover:scale-110 group-hover:bg-[#168039] group-hover:text-white group-hover:border-emerald-300">
                    <Leaf className="w-3.5 h-3.5" />
                  </span>
                  <span className="group-hover:translate-x-0.5 transition-transform duration-150">Environment Protection</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/animal-welfare"
                  prefetch={true}
                  className="group inline-flex items-center gap-2.5 hover:text-white transition-all py-0.5"
                >
                  <span className="w-6 h-6 rounded-md bg-amber-500/25 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.35)] transition-all duration-200 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-300">
                    <PawPrint className="w-3.5 h-3.5" />
                  </span>
                  <span className="group-hover:translate-x-0.5 transition-transform duration-150">Animal Welfare &amp; Rescue</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/women-empowerment"
                  prefetch={true}
                  className="group inline-flex items-center gap-2.5 hover:text-white transition-all py-0.5"
                >
                  <span className="w-6 h-6 rounded-md bg-pink-500/25 border border-pink-400/40 text-pink-300 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(236,72,153,0.35)] transition-all duration-200 group-hover:scale-110 group-hover:bg-pink-500 group-hover:text-white group-hover:border-pink-300">
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                  <span className="group-hover:translate-x-0.5 transition-transform duration-150">Women Empowerment</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/education"
                  prefetch={true}
                  className="group inline-flex items-center gap-2.5 hover:text-white transition-all py-0.5"
                >
                  <span className="w-6 h-6 rounded-md bg-sky-500/25 border border-sky-400/40 text-sky-300 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(14,165,233,0.35)] transition-all duration-200 group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-300">
                    <GraduationCap className="w-3.5 h-3.5" />
                  </span>
                  <span className="group-hover:translate-x-0.5 transition-transform duration-150">Education Support</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/clean-water"
                  prefetch={true}
                  className="group inline-flex items-center gap-2.5 hover:text-white transition-all py-0.5"
                >
                  <span className="w-6 h-6 rounded-md bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.35)] transition-all duration-200 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white group-hover:border-cyan-300">
                    <Droplets className="w-3.5 h-3.5" />
                  </span>
                  <span className="group-hover:translate-x-0.5 transition-transform duration-150">Clean Water Campaign</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/social-welfare"
                  prefetch={true}
                  className="group inline-flex items-center gap-2.5 hover:text-white transition-all py-0.5"
                >
                  <span className="w-6 h-6 rounded-md bg-emerald-400/25 border border-emerald-300/40 text-emerald-200 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.35)] transition-all duration-200 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-300">
                    <HeartHandshake className="w-3.5 h-3.5" />
                  </span>
                  <span className="group-hover:translate-x-0.5 transition-transform duration-150">Community Welfare in UP</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white tracking-wide">
              Newsletter
            </h3>
            <p className="text-xs text-white/80">
              Stay updated with our work.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-white text-gray-900 placeholder:text-gray-400 text-xs px-3.5 py-2 rounded-l-md w-full outline-none h-9"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="bg-[#168039] hover:bg-[#137233] text-white px-3.5 h-9 rounded-r-md flex items-center justify-center transition-colors shrink-0"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar Separator & AdSense Legal Links */}
        <div className="border-t border-emerald-900/60 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/75">
          <p>© 2026 ITLC Foundation. Registered NGO Lucknow, UP. All rights reserved.</p>
          
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 text-[11px] text-white/70">
            <Link href="/privacy-policy" className="hover:text-emerald-300 transition-colors hover:underline">
              Privacy Policy
            </Link>
            <span>&bull;</span>
            <Link href="/terms-and-conditions" className="hover:text-emerald-300 transition-colors hover:underline">
              Terms &amp; Conditions
            </Link>
            <span>&bull;</span>
            <Link href="/disclaimer" className="hover:text-emerald-300 transition-colors hover:underline">
              Disclaimer
            </Link>
            <span>&bull;</span>
            <Link href="/cookie-policy" className="hover:text-emerald-300 transition-colors hover:underline">
              Cookie Policy
            </Link>
            <span>&bull;</span>
            <Link href="/refund-policy" className="hover:text-emerald-300 transition-colors hover:underline">
              Refund Policy
            </Link>
            <span>&bull;</span>
            <Link href="/sitemap" className="hover:text-emerald-300 transition-colors hover:underline">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
}
