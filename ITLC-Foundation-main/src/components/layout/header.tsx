'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Menu, Heart, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useDonationModal } from '@/context/donation-modal-context';

interface NavItem {
  label: string;
  href: string;
  sectionId?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/', sectionId: 'top' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Blog', href: '/blog' },
  { label: 'Volunteer', href: '/volunteer' },
  { label: 'Contact', href: '/contact' },
];

const CAUSE_ITEMS = [
  { label: 'All Causes & Services', href: '/services', desc: 'Comprehensive overview of all community missions' },
  { label: 'Women Empowerment', href: '/women-empowerment', desc: 'Sewing centers, SHGs & financial independence' },
  { label: 'Environment & Tree Plantation', href: '/paryavaran-sanrakshan', desc: 'Green afforestation & clean climate drives' },
  { label: 'Animal Welfare & Stray Care', href: '/animal-welfare', desc: 'Daily feeding, rescue & emergency veterinary aid' },
  { label: 'Clean Water & Sanitation', href: '/clean-water', desc: 'Water testing, storage kits & school WASH camps' },
  { label: 'Education Support', href: '/education', desc: 'School kits, remedial coaching & digital learning' },
  { label: 'Social Welfare', href: '/social-welfare', desc: 'Food distribution, winter relief & elderly care' },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isCausesOpen, setIsCausesOpen] = useState(false);
  const [isMobileCausesOpen, setIsMobileCausesOpen] = useState(false);
  const causesRef = useRef<HTMLDivElement>(null);
  const { openDonationModal } = useDonationModal();
  const [logo, setLogo] = useState<string>('/ref/logo.png');

  useEffect(() => {
    fetch('/api/content/cms', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data?.site?.logo) setLogo(data.site.logo);
      })
      .catch(() => {});
  }, []);

  // Pre-warm all key landing page routes for instant navigation transitions
  useEffect(() => {
    const coreRoutes = [
      '/',
      '/about',
      '/projects',
      '/gallery',
      '/blog',
      '/volunteer',
      '/contact',
      '/services',
      '/women-empowerment',
      '/paryavaran-sanrakshan',
      '/animal-welfare',
      '/clean-water',
      '/education',
      '/social-welfare',
    ];
    const timer = setTimeout(() => {
      coreRoutes.forEach((route) => {
        try {
          router.prefetch(route);
        } catch (e) {}
      });
    }, 150);
    return () => clearTimeout(timer);
  }, [router]);

  useEffect(() => {
    fetch('/api/content/cms')
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data?.site?.logo) setLogo(data.site.logo);
      })
      .catch(() => {});
  }, []);

  // Close causes dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (causesRef.current && !causesRef.current.contains(event.target as Node)) {
        setIsCausesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setIsCausesOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const isCauseActive =
    pathname === '/services' ||
    pathname === '/women-empowerment' ||
    pathname === '/paryavaran-sanrakshan' ||
    pathname === '/animal-welfare' ||
    pathname === '/clean-water' ||
    pathname === '/education' ||
    pathname === '/social-welfare';

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    if (pathname === '/' && item.sectionId) {
      if (item.sectionId === 'top') {
        e.preventDefault();
        window.scrollTo({ top: 0 });
        return;
      }
      const el = document.getElementById(item.sectionId);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
        return;
      }
    }
  };

  return (
    <header className="sticky top-0 z-[70] w-full bg-white/95 backdrop-blur-md text-[#0f5b9e] shadow-xs border-b border-slate-200/80 transition-all">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-[72px] md:h-[80px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" prefetch={true} className="flex items-center group cursor-pointer py-1" aria-label="ITLC Foundation Home">
          <div className="relative h-14 md:h-[72px] w-auto flex items-center shrink-0">
            <Image
              src={logo || '/ref/logo.png'}
              alt="ITLC Foundation Logo"
              width={200}
              height={72}
              className="h-[54px] md:h-[66px] w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium">
          {/* Home */}
          <Link
            href="/"
            prefetch={true}
            onMouseEnter={() => router.prefetch('/')}
            onTouchStart={() => router.prefetch('/')}
            onClick={(e) => handleNavClick(e, NAV_ITEMS[0])}
            className={cn(
              'relative py-1 text-sm tracking-normal transition-colors duration-150 cursor-pointer',
              pathname === '/' ? 'text-[#0f5b9e] font-bold' : 'text-[#0f5b9e]/80 hover:text-[#0f5b9e] font-medium'
            )}
          >
            Home
            {pathname === '/' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0f5b9e] rounded-full" />
            )}
          </Link>

          {/* About */}
          <Link
            href="/about"
            prefetch={true}
            onMouseEnter={() => router.prefetch('/about')}
            onTouchStart={() => router.prefetch('/about')}
            className={cn(
              'relative py-1 text-sm tracking-normal transition-colors duration-150 cursor-pointer',
              pathname === '/about' ? 'text-[#0f5b9e] font-bold' : 'text-[#0f5b9e]/80 hover:text-[#0f5b9e] font-medium'
            )}
          >
            About
            {pathname === '/about' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0f5b9e] rounded-full" />
            )}
          </Link>

          {/* Causes / Focus Areas Dropdown */}
          <div
            ref={causesRef}
            className="relative"
            onMouseEnter={() => setIsCausesOpen(true)}
            onMouseLeave={() => setIsCausesOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsCausesOpen(!isCausesOpen)}
              className={cn(
                'relative py-1 text-sm tracking-normal transition-colors duration-150 cursor-pointer flex items-center gap-1',
                isCauseActive ? 'text-[#0f5b9e] font-bold' : 'text-[#0f5b9e]/80 hover:text-[#0f5b9e] font-medium'
              )}
            >
              <span>Causes</span>
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', isCausesOpen && 'rotate-180')} />
              {isCauseActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0f5b9e] rounded-full" />
              )}
            </button>

            {/* Dropdown Menu */}
            {isCausesOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-72 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-200/80 p-2 overflow-hidden">
                  <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Focus Areas &amp; Campaigns
                    </span>
                  </div>
                  {CAUSE_ITEMS.map((c) => {
                    const isItemActive = pathname === c.href;
                    return (
                      <Link
                        key={c.href}
                        href={c.href}
                        prefetch={true}
                        onMouseEnter={() => router.prefetch(c.href)}
                        onTouchStart={() => router.prefetch(c.href)}
                        onClick={() => setIsCausesOpen(false)}
                        className={cn(
                          'block px-3 py-2 rounded-xl text-xs transition-colors',
                          isItemActive
                            ? 'bg-emerald-50 text-[#168039] font-bold'
                            : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                        )}
                      >
                        <div className="font-semibold">{c.label}</div>
                        <div className="text-[10px] text-slate-500 font-normal leading-tight truncate">{c.desc}</div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Projects */}
          <Link
            href="/projects"
            prefetch={true}
            onMouseEnter={() => router.prefetch('/projects')}
            onTouchStart={() => router.prefetch('/projects')}
            className={cn(
              'relative py-1 text-sm tracking-normal transition-colors duration-150 cursor-pointer',
              pathname === '/projects' ? 'text-[#0f5b9e] font-bold' : 'text-[#0f5b9e]/80 hover:text-[#0f5b9e] font-medium'
            )}
          >
            Projects
            {pathname === '/projects' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0f5b9e] rounded-full" />
            )}
          </Link>

          {/* Gallery */}
          <Link
            href="/gallery"
            prefetch={true}
            onMouseEnter={() => router.prefetch('/gallery')}
            onTouchStart={() => router.prefetch('/gallery')}
            className={cn(
              'relative py-1 text-sm tracking-normal transition-colors duration-150 cursor-pointer',
              pathname === '/gallery' ? 'text-[#0f5b9e] font-bold' : 'text-[#0f5b9e]/80 hover:text-[#0f5b9e] font-medium'
            )}
          >
            Gallery
            {pathname === '/gallery' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0f5b9e] rounded-full" />
            )}
          </Link>

          {/* Blog */}
          <Link
            href="/blog"
            prefetch={true}
            onMouseEnter={() => router.prefetch('/blog')}
            onTouchStart={() => router.prefetch('/blog')}
            className={cn(
              'relative py-1 text-sm tracking-normal transition-colors duration-150 cursor-pointer',
              pathname === '/blog' || pathname.startsWith('/blog/') ? 'text-[#0f5b9e] font-bold' : 'text-[#0f5b9e]/80 hover:text-[#0f5b9e] font-medium'
            )}
          >
            Blog
            {(pathname === '/blog' || pathname.startsWith('/blog/')) && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0f5b9e] rounded-full" />
            )}
          </Link>

          {/* Volunteer */}
          <Link
            href="/volunteer"
            prefetch={true}
            onMouseEnter={() => router.prefetch('/volunteer')}
            onTouchStart={() => router.prefetch('/volunteer')}
            className={cn(
              'relative py-1 text-sm tracking-normal transition-colors duration-150 cursor-pointer',
              pathname === '/volunteer' ? 'text-[#0f5b9e] font-bold' : 'text-[#0f5b9e]/80 hover:text-[#0f5b9e] font-medium'
            )}
          >
            Volunteer
            {pathname === '/volunteer' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0f5b9e] rounded-full" />
            )}
          </Link>

          {/* Contact */}
          <Link
            href="/contact"
            prefetch={true}
            onMouseEnter={() => router.prefetch('/contact')}
            onTouchStart={() => router.prefetch('/contact')}
            className={cn(
              'relative py-1 text-sm tracking-normal transition-colors duration-150 cursor-pointer',
              pathname === '/contact' ? 'text-[#0f5b9e] font-bold' : 'text-[#0f5b9e]/80 hover:text-[#0f5b9e] font-medium'
            )}
          >
            Contact
            {pathname === '/contact' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0f5b9e] rounded-full" />
            )}
          </Link>
        </nav>

        {/* Right CTA Button (Desktop) */}
        <div className="hidden lg:flex items-center">
          <button
            type="button"
            onClick={() => openDonationModal()}
            className="bg-[#168039] hover:bg-[#137233] text-white rounded-full px-5 py-2 text-xs md:text-sm font-medium flex items-center gap-1.5 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 fill-white text-white" />
            <span>Donate Now</span>
          </button>
        </div>

        {/* Mobile Navigation Sheet (Visible on screens < lg) */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => openDonationModal()}
            className="bg-[#168039] text-white rounded-full px-3 py-1.5 text-xs font-medium flex items-center gap-1 cursor-pointer"
          >
            <Heart className="w-3 h-3 fill-white text-white" />
            <span>Donate</span>
          </button>
          <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#0f5b9e] hover:bg-blue-50 hover:text-[#0f5b9e] cursor-pointer"
                aria-label="Open Menu"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-white text-slate-800 border-l border-slate-200 z-[80] overflow-y-auto">
              <SheetHeader className="text-left border-b border-slate-100 pb-4">
                <SheetTitle className="text-[#0f5b9e] font-bold text-base flex items-center">
                  <div className="relative h-13 w-auto flex items-center shrink-0">
                    <Image
                      src={logo || '/ref/logo.png'}
                      alt="ITLC Foundation Logo"
                      width={160}
                      height={56}
                      className="h-12 w-auto object-contain"
                    />
                  </div>
                </SheetTitle>
              </SheetHeader>

              <div className="py-5 flex flex-col gap-2">
                <Link
                  href="/"
                  prefetch={true}
                  onTouchStart={() => router.prefetch('/')}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                    pathname === '/' ? 'bg-blue-50 text-[#0f5b9e] font-bold' : 'text-[#0f5b9e]/80 hover:bg-blue-50/60 hover:text-[#0f5b9e]'
                  )}
                >
                  Home
                </Link>

                <Link
                  href="/about"
                  prefetch={true}
                  onTouchStart={() => router.prefetch('/about')}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                    pathname === '/about' ? 'bg-blue-50 text-[#0f5b9e] font-bold' : 'text-[#0f5b9e]/80 hover:bg-blue-50/60 hover:text-[#0f5b9e]'
                  )}
                >
                  About
                </Link>

                {/* Causes Accordion in Mobile */}
                <div className="rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setIsMobileCausesOpen(!isMobileCausesOpen)}
                    className={cn(
                      'w-full flex items-center justify-between py-2 px-3 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer',
                      isCauseActive ? 'bg-blue-50 text-[#0f5b9e] font-bold' : 'text-[#0f5b9e]/80 hover:bg-blue-50/60 hover:text-[#0f5b9e]'
                    )}
                  >
                    <span>Causes &amp; Focus Areas</span>
                    <ChevronDown className={cn('w-4 h-4 transition-transform duration-200', isMobileCausesOpen && 'rotate-180')} />
                  </button>

                  {isMobileCausesOpen && (
                    <div className="pl-4 pr-1 py-1 flex flex-col gap-1 border-l-2 border-[#0f5b9e]/20 ml-3 my-1">
                      {CAUSE_ITEMS.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          prefetch={true}
                          onTouchStart={() => router.prefetch(c.href)}
                          onClick={() => setMenuOpen(false)}
                          className={cn(
                            'py-1.5 px-2 rounded-md text-xs transition-colors',
                            pathname === c.href ? 'text-[#168039] font-bold bg-emerald-50' : 'text-slate-600 hover:text-[#0f5b9e]'
                          )}
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  href="/projects"
                  prefetch={true}
                  onTouchStart={() => router.prefetch('/projects')}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                    pathname === '/projects' ? 'bg-blue-50 text-[#0f5b9e] font-bold' : 'text-[#0f5b9e]/80 hover:bg-blue-50/60 hover:text-[#0f5b9e]'
                  )}
                >
                  Projects
                </Link>

                <Link
                  href="/gallery"
                  prefetch={true}
                  onTouchStart={() => router.prefetch('/gallery')}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                    pathname === '/gallery' ? 'bg-blue-50 text-[#0f5b9e] font-bold' : 'text-[#0f5b9e]/80 hover:bg-blue-50/60 hover:text-[#0f5b9e]'
                  )}
                >
                  Gallery
                </Link>

                <Link
                  href="/blog"
                  prefetch={true}
                  onTouchStart={() => router.prefetch('/blog')}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                    pathname === '/blog' || pathname.startsWith('/blog/') ? 'bg-blue-50 text-[#0f5b9e] font-bold' : 'text-[#0f5b9e]/80 hover:bg-blue-50/60 hover:text-[#0f5b9e]'
                  )}
                >
                  Blog
                </Link>

                <Link
                  href="/volunteer"
                  prefetch={true}
                  onTouchStart={() => router.prefetch('/volunteer')}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                    pathname === '/volunteer' ? 'bg-blue-50 text-[#0f5b9e] font-bold' : 'text-[#0f5b9e]/80 hover:bg-blue-50/60 hover:text-[#0f5b9e]'
                  )}
                >
                  Volunteer
                </Link>

                <Link
                  href="/contact"
                  prefetch={true}
                  onTouchStart={() => router.prefetch('/contact')}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                    pathname === '/contact' ? 'bg-blue-50 text-[#0f5b9e] font-bold' : 'text-[#0f5b9e]/80 hover:bg-blue-50/60 hover:text-[#0f5b9e]'
                  )}
                >
                  Contact
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    openDonationModal();
                  }}
                  className="mt-4 bg-[#168039] text-white rounded-full py-2.5 px-4 text-center font-semibold text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer w-full"
                >
                  <Heart className="w-4 h-4 fill-white text-white" />
                  <span>Donate Now</span>
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
