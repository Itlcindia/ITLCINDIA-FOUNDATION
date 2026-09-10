'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Check,
  Loader2,
  Image as ImageIcon,
  Trash2,
  Eye,
  Edit2,
  Copy,
  Search,
  AlertTriangle,
  FolderOpen,
  CheckCircle2,
} from 'lucide-react';

interface MediaItem {
  url: string;
  name: string;
  folder: string;
  size?: number;
  mtime?: number;
}

interface MediaGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  selectedUrl?: string;
}

export function MediaGalleryModal({
  isOpen,
  onClose,
  onSelect,
  selectedUrl,
}: MediaGalleryModalProps) {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterFolder, setFilterFolder] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // CRUD State
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<MediaItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [itemToRename, setItemToRename] = useState<MediaItem | null>(null);
  const [newNameInput, setNewNameInput] = useState('');
  const [renaming, setRenaming] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/content/media', { cache: 'no-store' });
      const data = await res.json();
      if (data.media) {
        setMediaList(data.media);
      }
    } catch (err) {
      console.error('Failed to load media list:', err);
      showToast('Failed to load media list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
      setSearchQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 1. CREATE: Upload new photo
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/content/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        await fetchMedia();
        showToast('Image uploaded successfully!');
        onSelect(data.url);
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // 2. DELETE: Delete media item
  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/content/media?url=${encodeURIComponent(itemToDelete.url)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMediaList((prev) => prev.filter((m) => m.url !== itemToDelete.url));
        showToast('Image deleted successfully!');
        setItemToDelete(null);
      } else {
        alert(data.error || 'Could not delete file');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete image');
    } finally {
      setDeleting(false);
    }
  };

  // 3. UPDATE: Rename media item
  const handleRenameConfirm = async () => {
    if (!itemToRename || !newNameInput.trim()) return;
    setRenaming(true);
    try {
      const res = await fetch('/api/content/media', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldUrl: itemToRename.url,
          newName: newNameInput.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMediaList((prev) =>
          prev.map((m) =>
            m.url === itemToRename.url ? { ...m, url: data.newUrl, name: data.name } : m
          )
        );
        showToast('Image renamed successfully!');
        setItemToRename(null);
      } else {
        alert(data.error || 'Could not rename file');
      }
    } catch (err) {
      console.error('Rename error:', err);
      alert('Failed to rename file');
    } finally {
      setRenaming(false);
    }
  };

  // Helper: Copy URL
  const handleCopyUrl = (url: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(url);
    showToast('Image URL copied to clipboard!');
  };

  // Helper: Format bytes
  const formatBytes = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Filtered list
  const filteredMedia = mediaList.filter((item) => {
    const matchesFolder = filterFolder === 'all' || item.folder === filterFolder;
    const matchesSearch =
      !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh] max-h-[850px] border border-gray-200">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-100 text-[#168039] flex items-center justify-center shadow-2xs">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base sm:text-lg font-headline">
                Media Library &amp; Gallery
              </h3>
              <p className="text-xs text-gray-500">
                Pick any image or upload, preview, rename, and delete photos directly.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="p-3 sm:p-4 border-b border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white shrink-0">
          
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Photos' },
              { id: 'uploads', label: 'User Uploads' },
              { id: 'ref', label: 'Reference HD' },
              { id: 'pro', label: 'Projects & Heroes' },
              { id: 'gal', label: 'Gallery' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterFolder(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  filterFolder === tab.id
                    ? 'bg-[#168039] text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search + Upload Action */}
          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search photos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:border-[#168039] transition-all"
              />
            </div>

            {/* Upload Button (CREATE) */}
            <label className="bg-[#168039] hover:bg-[#137233] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-2xs transition-colors shrink-0">
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload from Device</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        {/* Media Grid (Scrollable Container with Guaranteed Aspect Ratio) */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 bg-slate-50/60">
          {loading ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-gray-400 gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-[#168039]" />
              <p className="text-xs font-medium">Loading photos from server...</p>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center text-gray-400 gap-3">
              <FolderOpen className="w-12 h-12 text-gray-300" />
              <div>
                <p className="text-sm font-bold text-gray-600">No photos found</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {searchQuery ? 'Try another search keyword' : 'Upload a new photo using the button above'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {filteredMedia.map((item) => {
                const isSelected = selectedUrl === item.url;
                return (
                  <div
                    key={item.url}
                    className={`group relative rounded-2xl overflow-hidden border bg-white shadow-2xs hover:shadow-md transition-all flex flex-col ${
                      isSelected
                        ? 'border-[#168039] ring-2 ring-[#168039]'
                        : 'border-gray-200 hover:border-[#168039]/60'
                    }`}
                  >
                    {/* Fixed Height Image Preview Container */}
                    <div
                      className="relative w-full h-36 sm:h-40 md:h-44 bg-slate-100 overflow-hidden cursor-pointer flex items-center justify-center"
                      onClick={() => {
                        onSelect(item.url);
                        onClose();
                      }}
                    >
                      <img
                        src={item.url}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 select-none"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/ref/logo.png';
                        }}
                      />

                      {/* Selected Badge */}
                      {isSelected && (
                        <div className="absolute top-2 left-2 z-10 w-6 h-6 rounded-full bg-[#168039] text-white flex items-center justify-center shadow-md">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}

                      {/* Folder Badge */}
                      <span className="absolute bottom-2 left-2 z-10 text-[9px] font-bold px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-xs uppercase tracking-wider">
                        {item.folder}
                      </span>

                      {/* Action Buttons (CRUD Overlay) */}
                      <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/55 backdrop-blur-xs p-1 rounded-xl shadow-md">
                        {/* READ: Preview Lightbox */}
                        <button
                          type="button"
                          title="Preview full photo"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewItem(item);
                          }}
                          className="w-6 h-6 rounded-lg bg-white/95 hover:bg-white text-gray-700 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                        >
                          <Eye className="w-3 h-3" />
                        </button>

                        {/* COPY: Copy URL */}
                        <button
                          type="button"
                          title="Copy image link"
                          onClick={(e) => handleCopyUrl(item.url, e)}
                          className="w-6 h-6 rounded-lg bg-white/95 hover:bg-white text-gray-700 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                        >
                          <Copy className="w-3 h-3" />
                        </button>

                        {/* UPDATE: Rename */}
                        <button
                          type="button"
                          title="Rename photo"
                          onClick={(e) => {
                            e.stopPropagation();
                            setItemToRename(item);
                            setNewNameInput(item.name.replace(/\.[^/.]+$/, ''));
                          }}
                          className="w-6 h-6 rounded-lg bg-white/95 hover:bg-white text-blue-600 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>

                        {/* DELETE: Delete photo */}
                        <button
                          type="button"
                          title="Delete photo"
                          onClick={(e) => {
                            e.stopPropagation();
                            setItemToDelete(item);
                          }}
                          className="w-6 h-6 rounded-lg bg-white/95 hover:bg-red-50 text-red-600 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Bottom Metadata & Pick Button */}
                    <div className="p-2.5 bg-white border-t border-gray-100 flex items-center justify-between gap-1.5 text-left">
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold text-gray-800 truncate leading-tight" title={item.name}>
                          {item.name}
                        </p>
                        <p className="text-[10px] text-gray-400 leading-tight mt-0.5">
                          {formatBytes(item.size) || item.folder}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onSelect(item.url);
                          onClose();
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer shrink-0 ${
                          isSelected
                            ? 'bg-emerald-100 text-[#168039]'
                            : 'bg-gray-100 hover:bg-[#168039] text-gray-700 hover:text-white'
                        }`}
                      >
                        {isSelected ? 'Picked' : 'Select'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700">{filteredMedia.length}</span>
            <span>photo(s) available</span>
            {selectedUrl && (
              <span className="hidden sm:inline text-gray-400">
                &bull; Current: <span className="font-mono text-[11px] text-[#168039]">{selectedUrl}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 1. LIGHTBOX PREVIEW MODAL (READ / VIEW)                                    */}
      {/* ========================================================================= */}
      {previewItem && (
        <div
          className="fixed inset-0 z-[130] flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 animate-in fade-in duration-150"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden p-5 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="min-w-0 flex-1 pr-2">
                <h4 className="text-sm font-bold text-gray-900 truncate">{previewItem.name}</h4>
                <p className="text-xs text-gray-500 font-mono">{previewItem.url}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative w-full max-h-[55vh] min-h-[250px] bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center">
              <img
                src={previewItem.url}
                alt={previewItem.name}
                className="max-w-full max-h-[55vh] object-contain"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleCopyUrl(previewItem.url)}
                className="px-3.5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-[#168039]" />
                <span>Copy Link</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setItemToDelete(previewItem);
                    setPreviewItem(null);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelect(previewItem.url);
                    setPreviewItem(null);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-[#168039] hover:bg-[#137233] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Select &amp; Use Photo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DELETE CONFIRMATION MODAL (DELETE)                                     */}
      {/* ========================================================================= */}
      {itemToDelete && (
        <div
          className="fixed inset-0 z-[140] flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-150"
          onClick={() => setItemToDelete(null)}
        >
          <div
            className="relative max-w-sm w-full bg-white rounded-3xl shadow-2xl p-6 text-center space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-2xs">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-base font-extrabold text-gray-900">Delete this photo?</h4>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to permanently delete{' '}
                <strong className="text-gray-800 break-all">{itemToDelete.name}</strong>?
                This action cannot be undone.
              </p>
            </div>

            {/* Thumbnail Preview */}
            <div className="w-24 h-24 rounded-xl overflow-hidden border border-gray-200 mx-auto bg-slate-100">
              <img
                src={itemToDelete.url}
                alt={itemToDelete.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-75"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. RENAME MODAL (UPDATE)                                                  */}
      {/* ========================================================================= */}
      {itemToRename && (
        <div
          className="fixed inset-0 z-[140] flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-150"
          onClick={() => setItemToRename(null)}
        >
          <div
            className="relative max-w-sm w-full bg-white rounded-3xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-600" /> Rename Image File
              </h4>
              <button
                type="button"
                onClick={() => setItemToRename(null)}
                className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700">
                New File Name (without extension)
              </label>
              <input
                type="text"
                value={newNameInput}
                onChange={(e) => setNewNameInput(e.target.value)}
                placeholder="e.g. tree_plantation_drive"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold outline-none focus:border-blue-600"
                autoFocus
              />
              <p className="text-[10px] text-gray-400">
                Original: <span className="font-mono">{itemToRename.name}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setItemToRename(null)}
                disabled={renaming}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRenameConfirm}
                disabled={renaming || !newNameInput.trim()}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-75"
              >
                {renaming ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Name</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
