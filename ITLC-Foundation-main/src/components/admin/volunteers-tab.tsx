'use client';

import React, { useState, useEffect } from 'react';
import {
  Users, Search, Filter, RefreshCw, Loader2, Phone, Mail, MapPin,
  Calendar, CheckCircle2, Clock, Trash2, ShieldCheck, Heart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function VolunteersTab() {
  const { toast } = useToast();
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [trackFilter, setTrackFilter] = useState('all');

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/volunteer');
      const data = await res.json();
      if (data.volunteers) {
        setVolunteers(data.volunteers);
      }
    } catch (err) {
      console.error('Failed to load volunteers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVolunteer = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the volunteer application for "${name}"?`)) return;
    try {
      const res = await fetch(`/api/volunteer?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Application Deleted', description: `Volunteer record for ${name} removed.` });
        fetchVolunteers();
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to delete application', variant: 'destructive' });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const tracks = [
    { id: 'all', label: 'All Tracks' },
    { id: 'plantation', label: 'Green Warriors (Plantation)' },
    { id: 'animal', label: 'Animal Guardians (Rescue & Feed)' },
    { id: 'education', label: 'Education Mentors (Teaching)' },
    { id: 'relief', label: 'Community Relief (Relief & Food)' },
  ];

  const filtered = volunteers.filter((v) => {
    const matchesTrack =
      trackFilter === 'all' ||
      (v.interestArea && v.interestArea.toLowerCase().includes(trackFilter));
    const matchesSearch =
      search.trim() === '' ||
      (v.fullName && v.fullName.toLowerCase().includes(search.toLowerCase())) ||
      (v.email && v.email.toLowerCase().includes(search.toLowerCase())) ||
      (v.phone && v.phone.includes(search));
    return matchesTrack && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[#168039] font-bold text-xs uppercase tracking-widest block font-headline mb-1">
            COMMUNITY ENGAGEMENT —
          </span>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="text-lg font-bold font-headline tracking-tight">
              <span className="text-[#0f5b9e]">Volunteer Applications</span>{' '}
              <span className="text-[#168039]">&amp; Network</span>
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Review and manage volunteer registrations submitted through the official portal.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchVolunteers}
          className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#168039]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {tracks.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTrackFilter(t.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                trackFilter === t.id
                  ? 'bg-[#168039] text-white font-bold shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-gray-200 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#168039] mb-3" />
          <p className="text-xs font-medium">Loading applications...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-gray-200 text-gray-500">
          <Users className="w-10 h-10 mx-auto text-gray-300 mb-2" />
          <p className="text-sm font-semibold">No volunteer submissions found.</p>
          <p className="text-xs text-gray-400 mt-1">Applications from the /volunteer page will automatically appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((vol, idx) => (
            <div
              key={vol.id || idx}
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs hover:border-emerald-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
            >
              {/* Left Details */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-sm">{vol.fullName}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#168039] border border-emerald-200">
                    {vol.interestArea || 'General Volunteer'}
                  </span>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(vol.submittedAt || Date.now()).toLocaleDateString()}</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-gray-600">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#168039]" />
                    <a href={`tel:${vol.phone}`} className="hover:underline">{vol.phone}</a>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[#168039]" />
                    <a href={`mailto:${vol.email}`} className="hover:underline">{vol.email}</a>
                  </span>
                  {vol.city && (
                    <>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#168039]" />
                        <span>{vol.city}</span>
                      </span>
                    </>
                  )}
                  {vol.availability && (
                    <>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{vol.availability}</span>
                      </span>
                    </>
                  )}
                </div>

                {vol.message && (
                  <p className="text-gray-500 bg-gray-50 p-2 rounded-xl mt-1 text-[11px] leading-relaxed">
                    &ldquo;{vol.message}&rdquo;
                  </p>
                )}
              </div>

              {/* Right Action */}
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`https://wa.me/91${vol.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
                >
                  WhatsApp
                </a>
                <a
                  href={`mailto:${vol.email}?subject=Welcome to ITLC Foundation Volunteer Network`}
                  className="px-3 py-1.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold transition-colors"
                >
                  Email
                </a>
                <button
                  type="button"
                  onClick={() => handleDeleteVolunteer(vol.id, vol.fullName || 'Volunteer')}
                  className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                  title="Delete Application"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
