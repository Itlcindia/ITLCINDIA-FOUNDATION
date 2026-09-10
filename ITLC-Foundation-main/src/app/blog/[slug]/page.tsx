'use client';
import { DonateButton } from '@/components/ui/donate-button';

import React, { use, useState, useEffect } from 'react';
import { getBlogPostBySlug, getRelatedBlogPosts, getAllBlogs, BlogPost } from '@/data/blog-posts';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Sparkles,
  User,
  Share2,
  ArrowLeft,
  ArrowRight,
  Heart,
  CheckCircle2,
  Copy,
  Check,
  Tag,
  ShieldCheck,
  Layers,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';
import { useDonationModal } from '@/context/donation-modal-context';
import { BlogAdSlot } from '@/components/blog/blog-ad-slot';

export interface BlogFaq {
  question: string;
  answer: string;
}

export function getBlogFaqs(category: string, slug: string): BlogFaq[] {
  const cat = (category || '').toLowerCase();
  const s = (slug || '').toLowerCase();

  // 1. Women Empowerment
  if (cat.includes('women') || s.includes('women')) {
    return [
      {
        question: 'How does ITLC Foundation support women in rural and semi-urban Uttar Pradesh?',
        answer:
          'ITLC Foundation conducts grassroots vocational skill workshops including tailoring, computer literacy, organic farming, and handicrafts. We also facilitate the formation of Women Self-Help Groups (SHGs) to provide micro-finance literacy and market linkages.',
      },
      {
        question: 'Are the vocational skill training programs provided free of cost for underprivileged women?',
        answer:
          'Yes, all skill development workshops, toolkits (such as sewing machines, raw materials, and digital tools), and mentorship sessions provided by ITLC Foundation are 100% free for marginalized women and adolescent girls.',
      },
      {
        question: 'How does ITLC Foundation help women establish micro-enterprises or find steady employment?',
        answer:
          'Beyond classroom training, our ground teams connect skilled artisans with local cooperative federations, retail exhibitions, and bulk cottage industry orders, ensuring a dependable recurring monthly household income.',
      },
      {
        question: 'How can citizens and donors support the Women Empowerment initiative?',
        answer:
          'You can volunteer as a vocational trainer or mentor, donate sewing toolkits, or sponsor a woman’s complete 6-month skill training and certification cycle through our Section 80G tax-exempt donation portal.',
      },
    ];
  }

  // 2. Animal Welfare
  if (cat.includes('animal') || s.includes('animal') || s.includes('stray')) {
    return [
      {
        question: 'How does ITLC Foundation provide emergency rescue and medical care for injured strays in Lucknow?',
        answer:
          'We operate community feeding networks, on-site first aid treatment for road accident injuries, anti-rabies vaccination drives, and partner with local veterinary emergency clinics and shelters across urban and semi-urban Lucknow.',
      },
      {
        question: 'What should I do if I spot a critically injured or sick stray animal in my locality?',
        answer:
          'You can alert our local volunteer coordinators via the ITLC Foundation contact helpline or notify local veterinary rescue teams with precise GPS location details and photographs for prompt medical aid.',
      },
      {
        question: 'How do reflective safety collars protect street cattle and dogs from highway collisions?',
        answer:
          'During dense winter fog in Uttar Pradesh, highway visibility drops severely. Our volunteers install high-grade retro-reflective safety collars on stray dogs and cows, cutting nighttime vehicle collisions by more than 70%.',
      },
      {
        question: 'How can animal lovers contribute or sponsor stray feeding and sterilization drives?',
        answer:
          'Animal lovers can sponsor daily food supplies (rice, nutritional broth, boiled eggs), emergency surgical care, or foster recovered animals by contributing through our dedicated Animal Care tax-exempt fund.',
      },
    ];
  }

  // 3. Environment Protection / Tree Plantation
  if (cat.includes('environment') || s.includes('environment') || s.includes('tree') || s.includes('paryavaran')) {
    return [
      {
        question: 'Why does ITLC Foundation prioritize native trees like Neem, Peepal, and Banyan in plantation drives?',
        answer:
          'Native Indian tree species are drought-resilient, possess deep taproot systems suited to Uttar Pradesh soil, produce dense canopy shade, release copious amounts of oxygen, and thrive without depleting local groundwater.',
      },
      {
        question: 'What post-plantation care does ITLC Foundation provide to ensure high sapling survival?',
        answer:
          'Planting is only the first step. Through our "Adopt-a-Tree" initiative, we install protective tree guards, schedule weekly watering rounds, apply organic vermicompost, and monitor trees for 3 years, maintaining an 85%+ survival rate.',
      },
      {
        question: 'How does urban afforestation help reduce air pollution and winter smog in Lucknow?',
        answer:
          'Dense urban green belts capture toxic airborne particulate matter (PM 2.5 and PM 10) on leaf surfaces, buffer urban heat islands by 3-5°C, and create safe micro-habitats for birds and pollinators.',
      },
      {
        question: 'Can schools, colleges, or corporate teams participate in ITLC plantation campaigns?',
        answer:
          'Yes, we regularly host weekend plantation events across educational campuses, roadside green belts, and peri-urban parks where students, employees, and community members plant and name their own trees.',
      },
    ];
  }

  // 4. Education Support
  if (cat.includes('education') || s.includes('education') || s.includes('school') || s.includes('children')) {
    return [
      {
        question: 'How does ITLC Foundation support the education of slum and underprivileged children in Lucknow?',
        answer:
          'We establish free evening remedial learning centers, provide school bags, notebooks, and learning kits, and mentor first-generation learners to achieve foundational literacy and numeracy (FLN).',
      },
      {
        question: 'Does the foundation assist marginalized parents with formal school admissions under the RTE Act?',
        answer:
          'Yes, our field workers assist marginalized families in acquiring required documentation (such as Aadhaar, birth, and income certificates) and successfully enrolling children into formal schools under the Right to Education Act.',
      },
      {
        question: 'Can university students or professionals volunteer as tutors or guest mentors?',
        answer:
          'Yes! We welcome enthusiastic volunteers for weekend teaching, basic spoken English, foundational mathematics, computer literacy, and creative arts workshops across our community study centers.',
      },
      {
        question: 'How can I sponsor a child’s education through ITLC Foundation?',
        answer:
          'You can sponsor a child’s entire academic year—including tuition assistance, uniform, stationery, and daily nutritional snacks—through our Section 80G tax-exempt donation portal.',
      },
    ];
  }

  // 5. Clean Water & Sanitation
  if (cat.includes('water') || s.includes('water') || cat.includes('sanitation') || s.includes('sanitation')) {
    return [
      {
        question: 'What water purification initiatives does ITLC Foundation operate in rural Uttar Pradesh?',
        answer:
          'We conduct laboratory water testing for excess fluoride, iron, and microbial contamination, install community bio-sand and RO filtration systems, and restore defunct community hand pumps in water-stressed hamlets.',
      },
      {
        question: 'How does the foundation tackle waterborne illnesses among rural children and families?',
        answer:
          'By combining clean drinking water access with village-wide WASH (Water, Sanitation, and Hygiene) workshops, school hand-washing awareness campaigns, and safe water storage training.',
      },
      {
        question: 'How are community water systems maintained over the long term?',
        answer:
          'We train local village youth and women as "Jal Mitras" (Water Stewards) who handle routine maintenance, replace filtration media, and coordinate with local Panchayats for sustained operations.',
      },
      {
        question: 'How does safe water access improve school attendance for adolescent girls?',
        answer:
          'Access to clean water and private sanitation facilities relieves young girls of the daily burden of trekking miles for water and ensures hygienic menstrual health, significantly reducing dropout rates.',
      },
    ];
  }

  // 6. Social Welfare / Community Support
  if (cat.includes('social') || s.includes('social') || cat.includes('welfare') || s.includes('welfare')) {
    return [
      {
        question: 'What key community social welfare programs are operated by ITLC Foundation across Uttar Pradesh?',
        answer:
          'Our social welfare wing conducts emergency disaster relief, dry ration kit distribution for vulnerable daily-wage families, winter blanket distribution, and free medical checkup camps in underserved settlements.',
      },
      {
        question: 'How does ITLC Foundation verify genuine beneficiaries for social relief distribution?',
        answer:
          'Our volunteer teams conduct on-the-ground vulnerability assessments in coordination with local elders and ward heads, prioritizing senior citizens without support, widows, disabled individuals, and daily-wage laborers.',
      },
      {
        question: 'Are corporate CSR partnerships supported for mass community welfare drives?',
        answer:
          'Yes, ITLC Foundation partners with corporate CSR programs, educational institutions, and charitable trusts to execute impactful, audited social welfare projects across Uttar Pradesh.',
      },
      {
        question: 'Do contributions to ITLC Foundation qualify for income tax exemption?',
        answer:
          'Yes, all donations made to ITLC Foundation qualify for tax deductions under Section 80G of the Income Tax Act. Instant 80G receipts and certificates are issued to donors.',
      },
    ];
  }

  // 7. General / Universal Fallback FAQs
  return [
    {
      question: 'What is the primary mission of ITLC Foundation in Uttar Pradesh?',
      answer:
        'ITLC Foundation is a grassroots non-profit committed to sustainable rural and urban development across Uttar Pradesh, focusing on environmental conservation, stray animal protection, women empowerment, child education, and clean water access.',
    },
    {
      question: 'Are donations to ITLC Foundation 100% tax exempt under Section 80G?',
      answer:
        'Yes, every financial donation made to ITLC Foundation qualifies for 50% tax deduction under Section 80G of the Indian Income Tax Act. Donors receive an automated official receipt with 80G registration details immediately.',
    },
    {
      question: 'How can I join ITLC Foundation as an on-ground volunteer?',
      answer:
        'You can register online through our Volunteer page, select your preferred focus areas (such as tree plantation, animal feeding, or child tutoring), and join our active volunteer community in Lucknow and neighboring districts.',
    },
    {
      question: 'How does ITLC Foundation ensure financial transparency and accountability?',
      answer:
        'We practice total transparency through annual third-party financial audits, regular field impact reports, and publishing verified project updates so every donor knows exactly how their contribution is making a difference.',
    },
  ];
}

export default function BlogPostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const initialPost = getBlogPostBySlug(slug);

  const [post, setPost] = useState<BlogPost | undefined>(initialPost);
  const [loading, setLoading] = useState(!initialPost);
  const [blogAds, setBlogAds] = useState<any>(null);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const { openDonationModal } = useDonationModal();
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }

    // Fetch dynamic blog data and blogAds config
    async function loadData() {
      try {
        const blogRes = await fetch(`/api/content/blogs?slug=${slug}`);
        if (blogRes.ok) {
          const blogData = await blogRes.json();
          if (blogData.blog) {
            setPost(blogData.blog);
          }
        }
      } catch (e) {
        console.error('Error loading dynamic blog:', e);
      } finally {
        setLoading(false);
      }

      try {
        const cmsRes = await fetch('/api/content/cms');
        if (cmsRes.ok) {
          const cmsData = await cmsRes.json();
          if (cmsData.blogAds) {
            setBlogAds(cmsData.blogAds);
          }
        }
      } catch (e) {
        console.error('Error loading blog ads:', e);
      }
    }

    loadData();
  }, [slug]);

  // Set dynamic SEO title and meta description
  useEffect(() => {
    if (post) {
      if (post.metaTitle) {
        document.title = `${post.metaTitle} | ITLC Foundation`;
      } else if (post.title) {
        document.title = `${post.title} | ITLC Foundation`;
      }

      if (post.metaDescription) {
        let metaTag = document.querySelector('meta[name="description"]');
        if (!metaTag) {
          metaTag = document.createElement('meta');
          metaTag.setAttribute('name', 'description');
          document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', post.metaDescription);
      }
    }
  }, [post]);

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-[#168039] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  const images = post.images && post.images.length > 0 ? post.images : [post.image || '/pro/ab.png'];
  const allOtherPosts = getAllBlogs().filter((p: BlogPost) => p.slug !== post.slug);
  const relatedPosts: BlogPost[] = allOtherPosts;
  const bottomFourPosts: BlogPost[] = allOtherPosts.slice(0, 4);

  const faqs = (post as any)?.faqs && Array.isArray((post as any).faqs) && (post as any).faqs.length > 0
    ? (post as any).faqs
    : getBlogFaqs(post.category, post.slug);

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Convert markdown-style content to styled HTML elements with mid-article Ad Slot 3 insertion
  const renderContentWithAds = (content: string) => {
    const lines = content.trim().split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: string[] = [];

    const flushList = (key: string) => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={key} className="space-y-2.5 my-4 pl-4 list-disc text-slate-700">
            {currentList.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                <span dangerouslySetInnerHTML={{ __html: item }} />
              </li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    const midPoint = Math.floor(lines.length / 2);
    let ad3Inserted = false;

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Heading 2
      if (trimmed.startsWith('## ')) {
        flushList(`list-before-${index}`);
        elements.push(
          <h2
            key={`h2-${index}`}
            className="text-xl sm:text-2xl font-black text-slate-900 mt-8 mb-4 font-headline tracking-tight border-b border-slate-100 pb-2"
          >
            {trimmed.replace('## ', '')}
          </h2>
        );
        return;
      }

      // Heading 3
      if (trimmed.startsWith('### ')) {
        flushList(`list-before-${index}`);
        elements.push(
          <h3
            key={`h3-${index}`}
            className="text-lg sm:text-xl font-bold text-slate-900 mt-6 mb-3 font-headline"
          >
            {trimmed.replace('### ', '')}
          </h3>
        );
        return;
      }

      // Horizontal separator
      if (trimmed === '---') {
        flushList(`list-before-${index}`);
        elements.push(<hr key={`hr-${index}`} className="my-8 border-slate-200" />);
        return;
      }

      // Bullet item
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const itemText = trimmed.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        currentList.push(itemText);
        return;
      }

      // Numbered list item
      if (/^\d+\.\s/.test(trimmed)) {
        const itemText = trimmed.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        currentList.push(itemText);
        return;
      }

      // Regular paragraph
      if (trimmed.length > 0) {
        flushList(`list-before-${index}`);
        const formatted = trimmed
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>');
        elements.push(
          <p
            key={`p-${index}`}
            className="text-slate-700 leading-relaxed text-sm sm:text-base my-3.5"
            dangerouslySetInnerHTML={{ __html: formatted }}
          />
        );

        // Insert Mid-Article Ad Slot 3 roughly halfway through paragraphs
        if (!ad3Inserted && index >= midPoint) {
          ad3Inserted = true;
          elements.push(
            <BlogAdSlot
              key="in-article-ad-slot-3"
              slotKey="slot3"
              config={blogAds?.slot3}
              className="my-8"
            />
          );
        }
      }
    });

    flushList('list-final');
    return elements;
  };

  const shareText = encodeURIComponent(`${post.title} - Read this story on ITLC Foundation:`);
  const encodedUrl = encodeURIComponent(currentUrl);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 pb-20">
      
      {/* Top Breadcrumb & Return Bar */}
      <div className="bg-white border-b border-slate-200/80 sticky top-[72px] md:top-[80px] z-20">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#168039] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Articles &amp; Insights</span>
          </Link>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#168039] font-medium border border-emerald-200">
            {post.category}
          </span>
        </div>
      </div>

      {/* Article & Sidebar Container (2-Column Magazine Layout) */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Full Detailed Article */}
          <article className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm border border-slate-200/80 space-y-8">
          
          {/* Header Metadata */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#168039]" />
                <span>{post.date}</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#168039]" />
                <span>{post.readTime}</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#168039]" />
                <span>{post.author}</span>
                {post.authorRole && (
                  <span className="text-slate-400 font-medium">({post.authorRole})</span>
                )}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight font-headline tracking-tight">
              {post.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans italic border-l-4 border-[#168039] pl-4 py-1 bg-slate-50 rounded-r-xl">
              {post.excerpt}
            </p>
          </div>

          {/* ======================================================== */}
          {/* 📢 AD SLOT 1: Below Article Title & Meta                 */}
          {/* ======================================================== */}
          <BlogAdSlot slotKey="slot1" config={blogAds?.slot1} />

          {/* Multi-Image Gallery / Primary Featured Image */}
          <div className="space-y-3">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-md bg-slate-100 border border-slate-200">
              <Image
                src={images[activeImgIdx] || '/pro/ab.png'}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover"
              />
              {images.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{activeImgIdx + 1} / {images.length} Photos</span>
                </div>
              )}
            </div>

            {/* Thumbnails row if multiple images exist */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5">
                {images.map((imgUrl, idx) => (
                  <button
                    key={`img-thumb-${idx}`}
                    type="button"
                    onClick={() => setActiveImgIdx(idx)}
                    className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activeImgIdx === idx ? 'border-[#168039] scale-105 shadow-sm' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={imgUrl} alt="thumbnail" fill sizes="64px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Takeaways Box */}
          {post.keyPoints && post.keyPoints.length > 0 && (
            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-5 sm:p-6 space-y-3">
              <h3 className="text-sm font-bold text-[#168039] uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#168039]" />
                <span>Executive Summary &amp; Key Highlights</span>
              </h3>
              <ul className="space-y-2">
                {post.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-[#168039] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ======================================================== */}
          {/* 📢 AD SLOT 2: Above Article Body                         */}
          {/* ======================================================== */}
          <BlogAdSlot slotKey="slot2" config={blogAds?.slot2} />

          {/* Main Article Body */}
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
            {renderContentWithAds(post.content)}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="border-t border-slate-100 pt-6 space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Related Topics &amp; Hashtags
              </span>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    <Tag className="w-3 h-3 text-slate-400" />
                    <span>#{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author Profile Attribution Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#168039] flex items-center justify-center font-black text-base shrink-0">
              {post.author ? post.author.charAt(0) : 'I'}
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#168039]">Written &amp; Field-Verified By</div>
              <div className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                <span>{post.author}</span>
                {post.authorRole && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-[#168039] font-semibold">
                    {post.authorRole}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                ITLC Foundation Grassroots Research &amp; Community Development Team
              </p>
            </div>
          </div>

          {/* Share Buttons Strip */}
          <div className="border-t border-slate-100 pt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Share2 className="w-4 h-4" />
              <span>Share this Ground Story:</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors"
              >
                WhatsApp
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium transition-colors"
              >
                X / Twitter
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
              >
                Facebook
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-blue-800 hover:bg-blue-900 text-white text-xs font-medium transition-colors"
              >
                LinkedIn
              </a>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#168039]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 📢 AD SLOT 4: Bottom Pre-Footer Banner Ad                */}
          {/* ======================================================== */}
          <BlogAdSlot slotKey="slot4" config={blogAds?.slot4} />

          {/* ======================================================== */}
          {/* ❓ FREQUENTLY ASKED QUESTIONS (4 FAQs per Blog)          */}
          {/* ======================================================== */}
          <div className="border-t border-slate-100 pt-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#168039]">
              <HelpCircle className="w-4 h-4 text-[#168039]" />
              <span>Frequently Asked Questions</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-headline tracking-tight">
              Key Questions About Our {post.category || 'Focus'} Initiatives
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Find answers to the most common questions regarding our on-ground implementation, community beneficiaries, and support pathways.
            </p>

            <div className="space-y-3 pt-2">
              {faqs.map((faq: BlogFaq, fIdx: number) => {
                const isOpen = openFaqIdx === fIdx;
                return (
                  <div
                    key={`faq-${fIdx}`}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isOpen
                        ? 'border-[#168039]/50 bg-emerald-50/30 shadow-xs'
                        : 'border-slate-200/80 bg-slate-50/60 hover:bg-white'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(isOpen ? null : fIdx)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-colors ${
                            isOpen
                              ? 'bg-[#168039] text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {fIdx + 1}
                        </span>
                        <span
                          className={`text-xs sm:text-sm font-bold transition-colors ${
                            isOpen ? 'text-[#168039]' : 'text-slate-900'
                          }`}
                        >
                          {faq.question}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-[#168039]' : 'text-slate-400'
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed pl-13 sm:pl-14">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 80G Tax Exemption Donation Box */}
          <div className="bg-gradient-to-br from-[#083a27] to-[#125c3a] rounded-3xl p-6 sm:p-8 text-white space-y-4">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Support This Impact &bull; Section 80G Tax Exempt</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-headline">
              Help us expand our community welfare drives across Uttar Pradesh
            </h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-2xl">
              Every donation to ITLC Foundation directly funds native tree plantations, street animal feeding, educational kits, and clean water drives in Lucknow and surrounding rural clusters.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => openDonationModal()}
                className="bg-white hover:bg-emerald-50 text-[#083a27] font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>Donate to this Cause</span>
              </button>
              <Link
                href="/volunteer"
                className="border border-white/40 hover:bg-white/10 text-white font-medium text-xs sm:text-sm px-5 py-3 rounded-full transition-all"
              >
                Join as Volunteer
              </Link>
            </div>
          </div>
          </article>

          {/* Right Column: Static & Sticky Related Articles Sidebar (Filling height) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start">
            
            {/* 1. Related Stories Header & Compact Cards List */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 font-headline flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0f5b9e]" />
                  <span>Related Stories</span>
                </h3>
                <Link
                  href="/blog"
                  className="text-xs text-[#0f5b9e] font-semibold hover:underline"
                >
                  View All
                </Link>
              </div>

              {/* Compact cards of related blogs filling vertical height */}
              <div className="space-y-3">
                {relatedPosts.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/blog/${rel.slug}`}
                    className="group bg-slate-50/70 hover:bg-white rounded-xl p-3 border border-slate-200/70 hover:border-[#0f5b9e] hover:shadow-xs transition-all flex items-center gap-3.5 cursor-pointer"
                  >
                    {/* Thumbnail: 65px */}
                    <div className="relative w-16 h-16 rounded-[8px] overflow-hidden shrink-0 bg-slate-200">
                      <Image
                        src={rel.image || '/pro/ab.png'}
                        alt={rel.title}
                        fill
                        sizes="64px"
                        className="object-cover transition-transform duration-500 group-hover:scale-106"
                      />
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-[#0f5b9e] uppercase tracking-wider block mb-0.5 truncate">
                        {rel.category}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0f5b9e] transition-colors leading-snug line-clamp-2">
                        {rel.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{rel.date}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 2. Direct Section 80G Tax Benefit Donation Card */}
            <div className="bg-gradient-to-br from-[#0f5b9e] to-[#093c68] text-white rounded-3xl p-6 shadow-sm space-y-3.5">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Tax Exempt &bull; 80G</span>
              </div>
              <h4 className="text-base font-bold leading-snug">
                Support Ground Welfare Across Uttar Pradesh
              </h4>
              <p className="text-xs text-white/80 leading-relaxed">
                Your monthly or one-time donation funds native tree plantation, food drives, and emergency veterinary aid.
              </p>
              <DonateButton
                size="md"
                className="w-full"
                label="Donate to ITLC Foundation"
              />
            </div>

            {/* 3. Focus Areas / Causes Quick Chips */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Explore Focus Areas
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: 'Environment', href: '/paryavaran-sanrakshan' },
                  { name: 'Animal Care', href: '/animal-welfare' },
                  { name: 'Women Empowerment', href: '/women-empowerment' },
                  { name: 'Education', href: '/education' },
                  { name: 'Clean Water', href: '/clean-water' },
                  { name: 'Social Welfare', href: '/social-welfare' },
                ].map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="text-xs bg-slate-50 hover:bg-emerald-50 hover:text-[#168039] text-slate-700 font-medium px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

          </aside>

        </div>

        {/* ========================================================================= */}
        {/* 4 RECOMMENDED BLOGS (RIGHT ABOVE FOOTER)                                  */}
        {/* ========================================================================= */}
        <section className="mt-14 sm:mt-20 pt-10 border-t border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3">
            <div>
              <span className="text-[#168039] font-bold text-xs uppercase tracking-widest block font-headline mb-1">
                RECOMMENDED STORIES —
              </span>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 font-headline tracking-tight">
                More Ground Stories from ITLC Foundation
              </h3>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#168039] hover:text-[#137233] transition-colors group cursor-pointer"
            >
              <span>View All Stories</span>
              <ArrowRight className="w-4 h-4 text-[#168039] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {bottomFourPosts.map((bPost) => (
              <Link
                key={`bottom-rec-${bPost.slug}`}
                href={`/blog/${bPost.slug}`}
                className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-md hover:border-[#168039]/40 transition-all flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={bPost.image || '/pro/ab.png'}
                      alt={bPost.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-[#0f5b9e] text-white text-[10px] font-bold px-2.5 py-0.5 rounded shadow-2xs">
                      {bPost.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#168039] transition-colors line-clamp-2 leading-snug font-headline">
                      {bPost.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                      {bPost.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-50">
                  <span className="truncate max-w-[120px]">{bPost.date}</span>
                  <span className="text-[#168039] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>Read Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>

    </div>
  );
}
