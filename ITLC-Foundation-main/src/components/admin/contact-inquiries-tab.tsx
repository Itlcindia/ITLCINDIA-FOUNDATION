'use client';

import React, { useState, useEffect } from 'react';
import { Mail, RefreshCw, Trash2, CheckCircle2, Clock, Check, X, Search, Phone, User, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  admin_notes?: string;
  created_at: string;
}

export function ContactInquiriesTab() {
  const { toast } = useToast();
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      if (data.inquiries) setInquiries(data.inquiries);
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to load inquiries.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const updateStatus = async (inq: ContactInquiry, newStatus: string, notes?: string) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: inq.id, status: newStatus, admin_notes: notes !== undefined ? notes : inq.admin_notes }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Updated', description: `Status changed to ${newStatus}` });
        fetchInquiries();
        if (selectedInquiry?.id === inq.id) {
          setSelectedInquiry({ ...selectedInquiry, status: newStatus as any, admin_notes: notes !== undefined ? notes : inq.admin_notes });
        }
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Deleted', description: 'Inquiry removed.' });
        setSelectedInquiry(null);
        fetchInquiries();
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(search.toLowerCase()) ||
      inq.email.toLowerCase().includes(search.toLowerCase()) ||
      (inq.subject && inq.subject.toLowerCase().includes(search.toLowerCase())) ||
      inq.message.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusBadge = (st: string) => {
    switch (st) {
      case 'new':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">New</span>;
      case 'read':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">Read</span>;
      case 'replied':
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-200">Replied</span>;
      case 'closed':
        return <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-200">Closed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[#168039] font-bold text-xs uppercase tracking-widest block font-headline mb-1">
            COMMUNICATION INBOX —
          </span>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#168039]" />
            <h3 className="text-lg font-bold font-headline tracking-tight">
              <span className="text-[#0f5b9e]">Contact Inquiries</span>{' '}
              <span className="text-[#168039]">Inbox</span>
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Review and respond to messages, collaboration requests, and questions received from the website.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchInquiries}
          className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inquiries by sender name, subject, or keywords..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#168039]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['all', 'new', 'read', 'replied', 'closed'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                statusFilter === st ? 'bg-[#168039] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-4 px-6">Sender</th>
                <th className="py-4 px-6">Subject &amp; Message</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInquiries.map((inq) => (
                <tr
                  key={inq.id}
                  onClick={() => {
                    setSelectedInquiry(inq);
                    if (inq.status === 'new') updateStatus(inq, 'read');
                  }}
                  className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-6">
                    <div className="font-bold text-gray-900">{inq.name}</div>
                    <div className="text-gray-500 text-[11px]">{inq.email}</div>
                    {inq.phone && <div className="text-gray-400 text-[10px]">{inq.phone}</div>}
                  </td>
                  <td className="py-4 px-6 max-w-md">
                    <div className="font-bold text-gray-900 truncate">{inq.subject || 'No Subject'}</div>
                    <p className="text-gray-500 text-xs truncate mt-0.5">{inq.message}</p>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">{statusBadge(inq.status)}</td>
                  <td className="py-4 px-6 text-gray-500 font-mono text-[11px] whitespace-nowrap">
                    {inq.created_at.substring(0, 10)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(inq.id);
                      }}
                      className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-gray-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-base">{selectedInquiry.subject || 'Inquiry Details'}</h3>
                <p className="text-xs text-gray-500">{selectedInquiry.created_at}</p>
              </div>
              <button onClick={() => setSelectedInquiry(null)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div>
                  <span className="text-gray-400 block text-[10px]">From:</span>
                  <span className="font-bold text-gray-900">{selectedInquiry.name}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Phone:</span>
                  <span className="font-medium text-gray-700">{selectedInquiry.phone || 'N/A'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400 block text-[10px]">Email:</span>
                  <a href={`mailto:${selectedInquiry.email}`} className="text-[#168039] font-bold underline">
                    {selectedInquiry.email}
                  </a>
                </div>
              </div>

              <div>
                <span className="text-gray-400 block text-[10px] mb-1">Message Content:</span>
                <div className="bg-gray-50 p-4 rounded-xl text-gray-800 leading-relaxed whitespace-pre-wrap border border-gray-100">
                  {selectedInquiry.message}
                </div>
              </div>

              <div>
                <span className="text-gray-700 font-bold block text-xs mb-1">Change Status:</span>
                <div className="flex items-center gap-2">
                  {(['read', 'replied', 'closed'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => updateStatus(selectedInquiry, st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                        selectedInquiry.status === st ? 'bg-[#168039] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Mark {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDelete(selectedInquiry.id)}
                className="text-red-600 font-bold text-xs hover:underline"
              >
                Delete Message
              </button>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
