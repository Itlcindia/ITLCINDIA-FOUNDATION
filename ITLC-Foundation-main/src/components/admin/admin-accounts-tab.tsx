'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Trash2, Edit, Check, X, UserCheck, UserX, Loader2, RefreshCw, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminAccount {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'sub_admin' | 'content_editor' | 'accountant';
  is_active: boolean;
  last_login_at?: string | null;
  last_login_ip?: string | null;
  created_at: string;
}

export function AdminAccountsTab() {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [formUsername, setFormUsername] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<'super_admin' | 'sub_admin' | 'content_editor' | 'accountant'>('sub_admin');
  const [formActive, setFormActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/accounts');
      const data = await res.json();
      if (data.accounts) setAccounts(data.accounts);
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to fetch admin accounts.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormUsername('');
    setFormEmail('');
    setFormPassword('');
    setFormRole('sub_admin');
    setFormActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (admin: AdminAccount) => {
    setIsEditing(true);
    setEditingId(admin.id);
    setFormUsername(admin.username);
    setFormEmail(admin.email);
    setFormPassword('');
    setFormRole(admin.role);
    setFormActive(admin.is_active);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/accounts', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          username: formUsername,
          email: formEmail,
          password: formPassword,
          role: formRole,
          is_active: formActive,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Success', description: isEditing ? 'Admin account updated.' : 'New admin account created.' });
        setIsModalOpen(false);
        fetchAccounts();
      } else {
        alert(data.error || 'Failed to save account');
      }
    } catch (err: any) {
      alert(err.message || 'Error saving account');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (admin: AdminAccount) => {
    if (admin.username === 'admin') {
      alert('Cannot delete primary SuperAdmin');
      return;
    }
    if (!confirm(`Are you sure you want to remove "${admin.username}"?`)) return;
    try {
      const res = await fetch(`/api/admin/accounts?id=${admin.id}&username=${admin.username}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Account Removed', description: 'Admin account removed successfully.' });
        fetchAccounts();
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const roleColors: Record<string, string> = {
    super_admin: 'bg-purple-100 text-purple-800 border-purple-200',
    sub_admin: 'bg-blue-100 text-blue-800 border-blue-200',
    content_editor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    accountant: 'bg-amber-100 text-amber-800 border-amber-200',
  };

  const roleLabels: Record<string, string> = {
    super_admin: 'Super Admin',
    sub_admin: 'Sub Admin',
    content_editor: 'Content Editor',
    accountant: 'Accountant',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[#168039] font-bold text-xs uppercase tracking-widest block font-headline mb-1">
            ACCESS CONTROL &amp; RBAC —
          </span>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#168039]" />
            <h3 className="text-lg font-bold font-headline tracking-tight">
              <span className="text-[#0f5b9e]">Admin Accounts</span>{' '}
              <span className="text-[#168039]">&amp; Security</span>
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Manage multi-tier admin roles, permissions (SuperAdmin, SubAdmin, Content Editor, Accountant) and active states.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchAccounts}
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
            <span>Create Admin User</span>
          </button>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-4 px-6">User &amp; Email</th>
                <th className="py-4 px-6">Assigned Role</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Last Login</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {accounts.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-gray-900 text-sm">{admin.username}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{admin.email}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-2.5 py-1 rounded-full font-bold text-[11px] border ${roleColors[admin.role] || 'bg-gray-100 text-gray-700'}`}>
                      {roleLabels[admin.role] || admin.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {admin.is_active ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600 font-bold text-xs">
                        <UserX className="w-3.5 h-3.5" />
                        <span>Inactive</span>
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-gray-500 font-mono text-[11px]">
                    {admin.last_login_at || 'Never'}
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(admin)}
                      className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                      title="Edit Account"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    {admin.username !== 'admin' && (
                      <button
                        type="button"
                        onClick={() => handleDelete(admin)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                        title="Delete Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-gray-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-base">
                {isEditing ? 'Edit Admin Account' : 'Create Admin Account'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Username *</label>
                <input
                  type="text"
                  required
                  disabled={isEditing}
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#168039]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#168039]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Password {isEditing ? '(Leave blank to keep unchanged)' : '*'}
                </label>
                <input
                  type="password"
                  required={!isEditing}
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#168039]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Role (Permissions)</label>
                <select
                  value={formRole}
                  onChange={(e: any) => setFormRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#168039] bg-white font-medium"
                >
                  <option value="super_admin">Super Admin (Full Access to Everything)</option>
                  <option value="sub_admin">Sub Admin (Manage Content &amp; Inquiries)</option>
                  <option value="content_editor">Content Editor (Manage Blogs &amp; Projects)</option>
                  <option value="accountant">Accountant (Donation Records &amp; 80G Receipts)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="adminActive"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  className="rounded text-[#168039]"
                />
                <label htmlFor="adminActive" className="text-gray-700 font-bold">
                  Account is Active (Can log in)
                </label>
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
                  <span>Save Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
