'use client';

import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw, Filter, Search, ShieldCheck } from 'lucide-react';

interface AuditLog {
  id: string;
  admin_username: string;
  role: string;
  action: string;
  entity_type: string;
  entity_title: string;
  ip_address: string;
  created_at: string;
}

export function ActivityLogsTab() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/logs');
      const data = await res.json();
      if (data.logs) setLogs(data.logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.entity_title.toLowerCase().includes(search.toLowerCase()) ||
      log.admin_username.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === 'all' || log.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[#168039] font-bold text-xs uppercase tracking-widest block font-headline mb-1">
            AUDIT &amp; COMPLIANCE —
          </span>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#168039]" />
            <h3 className="text-lg font-bold font-headline tracking-tight">
              <span className="text-[#0f5b9e]">Admin Activity</span>{' '}
              <span className="text-[#168039]">Audit Logs</span>
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Complete timestamped history of actions taken by administrators, content editors, and accountants.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchLogs}
          className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action, title, or username..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#168039]"
          />
        </div>

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="w-full sm:w-48 px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none bg-white"
        >
          <option value="all">All Roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="sub_admin">Sub Admin</option>
          <option value="content_editor">Content Editor</option>
          <option value="accountant">Accountant</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-4 px-6">Timestamp</th>
                <th className="py-4 px-6">Admin User</th>
                <th className="py-4 px-6">Action</th>
                <th className="py-4 px-6">Target Entity</th>
                <th className="py-4 px-6">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-6 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                    {log.created_at}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="font-bold text-gray-900">{log.admin_username}</span>
                    <span className="text-[10px] text-gray-400 block">{log.role}</span>
                  </td>
                  <td className="py-3.5 px-6 font-mono font-bold text-[11px] text-[#168039]">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="text-gray-900 font-medium block truncate max-w-xs">{log.entity_title || '-'}</span>
                    <span className="text-[10px] text-gray-400">{log.entity_type}</span>
                  </td>
                  <td className="py-3.5 px-6 font-mono text-[11px] text-gray-400">
                    {log.ip_address}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
