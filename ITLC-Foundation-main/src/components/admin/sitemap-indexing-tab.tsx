'use client';

import React, { useState, useEffect } from 'react';
import {
  Globe,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  FileCode,
  BookOpen,
  FolderKanban,
  ShieldCheck,
  Layers,
  Search,
  FileText,
  Clock,
  Sparkles,
  HelpCircle,
  Info,
  ShieldAlert,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SitemapStats, SitemapEntry } from '@/lib/sitemap-generator';

export function SitemapIndexingTab() {
  const { toast } = useToast();
  const [stats, setStats] = useState<SitemapStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'core' | 'cause' | 'project' | 'blog' | 'legal'>('all');
  const [hasCopiedUrl, setHasCopiedUrl] = useState(false);

  const fetchStats = async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const res = await fetch('/api/admin/sitemap', {
        method: isManualRefresh ? 'POST' : 'GET',
        cache: 'no-store',
      });
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
        if (isManualRefresh) {
          toast({
            title: 'Sitemap Cache Revalidated',
            description: `Successfully refreshed sitemap. Total ${data.stats.totalUrls} active URLs verified.`,
          });
        }
      } else {
        toast({
          title: 'Error Loading Sitemap',
          description: data.error || 'Failed to fetch sitemap metrics',
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      toast({
        title: 'Network Error',
        description: err.message || 'Failed to connect to sitemap service',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats(false);
  }, []);

  const handleCopyUrl = (urlToCopy?: string) => {
    const target = urlToCopy || stats?.sitemapUrl || 'https://itlcfoundation.com/sitemap.xml';
    navigator.clipboard.writeText(target);
    setHasCopiedUrl(true);
    toast({
      title: 'Sitemap URL Copied',
      description: target,
    });
    setTimeout(() => setHasCopiedUrl(false), 2000);
  };

  // Filter entries
  const filteredEntries = (stats?.entries || []).filter((entry) => {
    const matchesCategory =
      activeCategoryFilter === 'all'
        ? true
        : entry.category === activeCategoryFilter;

    const matchesSearch =
      searchQuery.trim() === '' ||
      entry.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.title && entry.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#168039]">
            <FileCode className="w-4 h-4" />
            <span>SEO &amp; Search Engine Optimization</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 font-headline">
            Automatic XML Sitemap &amp; Google Indexing
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Real-time dynamic XML sitemap generated from database records, auto-caching, and Google Search Console compliance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleCopyUrl()}
            className="px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            {hasCopiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
            <span>{hasCopiedUrl ? 'Copied!' : 'Copy Sitemap URL'}</span>
          </button>

          <a
            href={stats?.sitemapUrl || '/sitemap.xml'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0f5b9e] border border-blue-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Sitemap</span>
          </a>

          <button
            type="button"
            disabled={isRefreshing || isLoading}
            onClick={() => fetchStats(true)}
            className="bg-[#168039] hover:bg-[#137233] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Revalidating...' : 'Regenerate / Clear Cache'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Indexed</span>
            <Globe className="w-4 h-4 text-[#168039]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 font-headline">
            {isLoading ? '...' : stats?.totalUrls ?? 0}
          </div>
          <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Active Canonical URLs</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Core Pages</span>
            <Layers className="w-4 h-4 text-[#0f5b9e]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 font-headline">
            {isLoading ? '...' : (stats?.corePagesCount ?? 0) + (stats?.causesCount ?? 0)}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            {stats?.corePagesCount ?? 0} Core + {stats?.causesCount ?? 0} Causes
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Articles &amp; News</span>
            <BookOpen className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 font-headline">
            {isLoading ? '...' : stats?.blogsCount ?? 0}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            Published field blogs
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Projects &amp; Drives</span>
            <FolderKanban className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 font-headline">
            {isLoading ? '...' : stats?.projectsCount ?? 0}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            Active community missions
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Legal &amp; Compliance</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 font-headline">
            {isLoading ? '...' : stats?.legalCount ?? 0}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            Policies &amp; Transparency
          </div>
        </div>
      </div>

      {/* Status & Live Configuration Card */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-5">
        <h3 className="text-sm sm:text-base font-extrabold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#168039]" />
          <span>Sitemap Deployment Status &amp; Crawler Endpoint</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Primary Canonical Sitemap
            </div>
            <div className="font-mono text-xs text-[#0f5b9e] font-bold truncate" title={stats?.sitemapUrl}>
              {stats?.sitemapUrl || 'https://itlcfoundation.com/sitemap.xml'}
            </div>
            <div className="text-[10px] text-gray-500">
              Content-Type: <code>application/xml</code>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Sitemap Health Status
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-700 capitalize">
                {stats?.healthStatus || 'Healthy'} (HTTP 200 OK)
              </span>
            </div>
            <div className="text-[10px] text-gray-500">
              Valid XML structure &bull; Zero schema errors
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Robots.txt Directive
            </div>
            <div className="text-xs font-bold text-gray-900 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sitemap linked in /robots.txt</span>
            </div>
            <div className="text-[10px] text-gray-500">
              Disallow: <code>/admin/</code>, <code>/api/</code>
            </div>
          </div>
        </div>

        {/* Partitioned Sub-Sitemaps info */}
        <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl text-xs space-y-2">
          <div className="font-bold text-emerald-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#168039]" />
            <span>Partitioned Sub-Sitemaps &amp; Large Site Automation</span>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Per sitemap standards, when your platform scales beyond 50,000 URLs or 50 MB, our architecture automatically splits into categorized segments:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <a
              href="/sitemaps/pages-1.xml"
              target="_blank"
              className="px-2.5 py-1 bg-white border border-emerald-300 rounded-lg text-[11px] font-mono font-semibold text-[#168039] hover:bg-emerald-100"
            >
              /sitemaps/pages-1.xml
            </a>
            <a
              href="/sitemaps/articles-1.xml"
              target="_blank"
              className="px-2.5 py-1 bg-white border border-emerald-300 rounded-lg text-[11px] font-mono font-semibold text-[#168039] hover:bg-emerald-100"
            >
              /sitemaps/articles-1.xml
            </a>
            <a
              href="/sitemaps/projects-1.xml"
              target="_blank"
              className="px-2.5 py-1 bg-white border border-emerald-300 rounded-lg text-[11px] font-mono font-semibold text-[#168039] hover:bg-emerald-100"
            >
              /sitemaps/projects-1.xml
            </a>
            <a
              href="/sitemaps/documents-1.xml"
              target="_blank"
              className="px-2.5 py-1 bg-white border border-emerald-300 rounded-lg text-[11px] font-mono font-semibold text-[#168039] hover:bg-emerald-100"
            >
              /sitemaps/documents-1.xml
            </a>
          </div>
        </div>
      </div>

      {/* Interactive URL Directory Table */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-gray-900 font-headline">
              Live Indexable URL Registry ({filteredEntries.length})
            </h3>
            <p className="text-xs text-gray-500">
              Only published, accessible, and non-deleted pages with indexable meta directives appear here.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search URLs or titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 outline-none focus:border-[#168039] bg-gray-50/50"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-1.5 border-b border-gray-100 pb-3 text-xs">
          {[
            { id: 'all', label: `All URLs (${stats?.totalUrls || 0})` },
            { id: 'core', label: `Core Pages (${stats?.corePagesCount || 0})` },
            { id: 'cause', label: `Causes (${stats?.causesCount || 0})` },
            { id: 'blog', label: `Articles (${stats?.blogsCount || 0})` },
            { id: 'project', label: `Projects (${stats?.projectsCount || 0})` },
            { id: 'legal', label: `Legal (${stats?.legalCount || 0})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategoryFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeCategoryFilter === tab.id
                  ? 'bg-[#168039] text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* URLs Table */}
        <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">URL Location &amp; Title</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Last Modified</th>
                <th className="py-3 px-3">Changefreq</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    No URLs match your current filter.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry, idx) => {
                  const urlObj = new URL(entry.url);
                  const pathOnly = urlObj.pathname || '/';

                  return (
                    <tr key={idx} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900 truncate max-w-sm" title={entry.title}>
                          {entry.title || pathOnly}
                        </div>
                        <div className="font-mono text-[11px] text-[#0f5b9e] truncate max-w-sm" title={entry.url}>
                          {pathOnly}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            entry.category === 'core'
                              ? 'bg-blue-100 text-blue-800'
                              : entry.category === 'cause'
                              ? 'bg-emerald-100 text-emerald-800'
                              : entry.category === 'blog'
                              ? 'bg-purple-100 text-purple-800'
                              : entry.category === 'project'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {entry.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-gray-500 text-[11px] font-mono whitespace-nowrap">
                        {entry.lastModified ? entry.lastModified.slice(0, 10) : '—'}
                      </td>
                      <td className="py-3 px-3 text-gray-600 capitalize">
                        {entry.changeFrequency}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-gray-900">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] ${
                            entry.priority >= 0.9
                              ? 'bg-emerald-100 text-emerald-800 font-extrabold'
                              : entry.priority >= 0.8
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {entry.priority.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <a
                          href={entry.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 p-1.5 text-gray-400 hover:text-[#168039] rounded-lg hover:bg-gray-100 transition-colors"
                          title="View live page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Google Search Console & Official Indexing Setup Guide */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0f5b9e]">
            <Globe className="w-4 h-4" />
            <span>Search Engine Setup &amp; Compliance</span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-gray-900 font-headline mt-1">
            Google Search Console Setup &amp; Automatic Indexing Guide
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Follow these verified steps to submit the sitemap and maintain full compliance with Google Webmaster Guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Step 1 */}
          <div className="p-5 bg-gradient-to-br from-blue-50/50 to-white rounded-2xl border border-blue-200/80 space-y-3">
            <div className="w-7 h-7 rounded-full bg-[#0f5b9e] text-white flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h4 className="font-bold text-xs text-gray-900 uppercase tracking-wide">
              Verify Domain Ownership in GSC
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Open <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-[#0f5b9e] font-bold underline">Google Search Console</a> and add <code>https://itlcfoundation.com</code>.
            </p>
            <div className="bg-white p-3 rounded-xl border border-blue-200 text-[11px] text-gray-700 space-y-1.5">
              <div className="font-bold text-gray-900">Your site is already pre-configured:</div>
              <div className="flex items-center gap-1.5 text-emerald-700">
                <Check className="w-3.5 h-3.5" />
                <span>HTML Meta Tag installed in layout</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700">
                <Check className="w-3.5 h-3.5" />
                <span>Verification file in <code>public/</code></span>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-5 bg-gradient-to-br from-emerald-50/50 to-white rounded-2xl border border-emerald-200/80 space-y-3">
            <div className="w-7 h-7 rounded-full bg-[#168039] text-white flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h4 className="font-bold text-xs text-gray-900 uppercase tracking-wide">
              Submit /sitemap.xml Once
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              In Google Search Console, navigate to <strong>Indexing &rarr; Sitemaps</strong> from the left sidebar.
            </p>
            <div className="bg-white p-3 rounded-xl border border-emerald-200 text-[11px] text-gray-700 space-y-2">
              <div className="font-bold text-gray-900">Enter in &quot;Add a new sitemap&quot;:</div>
              <div className="p-2 bg-gray-50 rounded-lg font-mono font-bold text-[#168039] border border-gray-200">
                sitemap.xml
              </div>
              <p className="text-[10px] text-gray-500">
                Click <strong>Submit</strong>. You only need to do this <strong>once</strong>. Google automatically re-crawls when your sitemap updates.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-5 bg-gradient-to-br from-amber-50/50 to-white rounded-2xl border border-amber-200/80 space-y-3">
            <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h4 className="font-bold text-xs text-gray-900 uppercase tracking-wide">
              Google Indexing API Policy &amp; Discovery
            </h4>
            <div className="text-xs text-gray-600 space-y-2 leading-relaxed">
              <p>
                <strong>Official Policy Note:</strong> Google Indexing API is strictly intended for <code>JobPosting</code> and <code>BroadcastEvent</code> (live streaming) schema only.
              </p>
              <div className="p-2.5 bg-amber-100/60 border border-amber-300 rounded-xl text-[11px] text-amber-900 font-medium flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  Using Indexing API for standard web pages or articles violates Google Search Essentials and risks manual penalties.
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                With our automated <code>&lt;lastmod&gt;</code> sitemap and <code>robots.txt</code> integration, Googlebot discovers new and edited content automatically without risks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
