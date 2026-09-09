'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Users, Plus, Edit, Trash2, Check, X, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ImageUploadField } from '@/components/admin/image-upload-field';

interface TeamMember {
  id: string;
  name: string;
  designation: string;
  image: string;
  bio: string;
  sort_order: number;
  is_active: boolean;
}

export function TeamMembersTab() {
  const { toast } = useToast();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form
  const [formName, setFormName] = useState('');
  const [formDesignation, setFormDesignation] = useState('');
  const [formImage, setFormImage] = useState('/pro/ab.png');
  const [formBio, setFormBio] = useState('');
  const [formSortOrder, setFormSortOrder] = useState(1);
  const [formActive, setFormActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/team');
      const data = await res.json();
      if (data.team) setTeam(data.team);
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to fetch team.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormName('');
    setFormDesignation('');
    setFormImage('/pro/ab.png');
    setFormBio('');
    setFormSortOrder(team.length + 1);
    setFormActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (member: TeamMember) => {
    setIsEditing(true);
    setEditingId(member.id);
    setFormName(member.name);
    setFormDesignation(member.designation);
    setFormImage(member.image || '/pro/ab.png');
    setFormBio(member.bio || '');
    setFormSortOrder(member.sort_order || 1);
    setFormActive(member.is_active);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/team', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          name: formName,
          designation: formDesignation,
          image: formImage,
          bio: formBio,
          sort_order: formSortOrder,
          is_active: formActive,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Saved', description: 'Team member saved successfully.' });
        setIsModalOpen(false);
        fetchTeam();
      } else {
        alert(data.error || 'Failed to save');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      const res = await fetch(`/api/admin/team?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Deleted', description: 'Member removed.' });
        fetchTeam();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[#168039] font-bold text-xs uppercase tracking-widest block font-headline mb-1">
            LEADERSHIP DIRECTORY —
          </span>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#168039]" />
            <h3 className="text-lg font-bold font-headline tracking-tight">
              <span className="text-[#0f5b9e]">Foundation Leadership</span>{' '}
              <span className="text-[#168039]">&amp; Team</span>
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Manage executive directors, board trustees, and field coordinators displayed on the About Us page.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchTeam}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="bg-[#168039] hover:bg-[#137233] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Team Member</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {team.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden flex flex-col justify-between p-5"
          >
            <div>
              <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 bg-gray-100">
                <Image src={member.image || '/pro/ab.png'} alt={member.name} fill sizes="300px" className="object-cover" />
              </div>
              <h4 className="font-bold text-gray-900 text-base">{member.name}</h4>
              <p className="text-xs text-[#168039] font-bold mt-0.5">{member.designation}</p>
              <p className="text-xs text-gray-600 line-clamp-3 mt-3 leading-relaxed">{member.bio}</p>
            </div>

            <div className="pt-4 border-t border-gray-100 mt-5 flex items-center justify-between">
              <span className="text-[11px] text-gray-400 font-mono">Order: #{member.sort_order}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(member)}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs cursor-pointer flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(member.id, member.name)}
                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-gray-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-base">
                {isEditing ? 'Edit Team Member' : 'Add Team Member'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#168039]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Designation / Role *</label>
                <input
                  type="text"
                  required
                  value={formDesignation}
                  onChange={(e) => setFormDesignation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#168039]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Photo Upload</label>
                <ImageUploadField label="Profile Photo" value={formImage} onChange={setFormImage} />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Short Biography</label>
                <textarea
                  rows={3}
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#168039]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={formSortOrder}
                    onChange={(e) => setFormSortOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#168039]"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="teamActive"
                    checked={formActive}
                    onChange={(e) => setFormActive(e.target.checked)}
                    className="rounded text-[#168039]"
                  />
                  <label htmlFor="teamActive" className="text-gray-700 font-bold">
                    Visible on About Page
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#168039] hover:bg-[#137233] text-white px-5 py-2 rounded-xl font-bold shadow transition-all flex items-center gap-1.5"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Save Member</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
