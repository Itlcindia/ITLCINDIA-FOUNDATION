'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Upload, Check, Loader2, Image as ImageIcon } from 'lucide-react';

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
  const [mediaList, setMediaList] = useState<{ url: string; name: string; folder: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterFolder, setFilterFolder] = useState('all');
  const [uploading, setUploading] = useState(false);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/content/media');
      const data = await res.json();
      if (data.media) {
        setMediaList(data.media);
      }
    } catch (err) {
      console.error('Failed to load media list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
        onSelect(data.url);
        onClose();
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const filteredMedia =
    filterFolder === 'all'
      ? mediaList
      : mediaList.filter((m) => m.folder === filterFolder);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-gray-200">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#168039] flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Media Library &amp; Gallery</h3>
              <p className="text-xs text-gray-500">Pick any image or upload a new one directly</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-white">
          {/* Folder Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
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
                className={`px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                  filterFolder === tab.id
                    ? 'bg-[#168039] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Upload Button */}
          <label className="bg-[#168039] hover:bg-[#137233] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors">
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading...</span>
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

        {/* Media Grid */}
        <div className="p-5 overflow-y-auto flex-1 bg-gray-50/50">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-[#168039]" />
              <p className="text-xs">Loading media files...</p>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="py-20 text-center text-gray-400 text-xs">
              No images found in this folder. Click &ldquo;Upload from Device&rdquo; to add some.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {filteredMedia.map((item) => {
                const isSelected = selectedUrl === item.url;
                return (
                  <button
                    key={item.url}
                    type="button"
                    onClick={() => {
                      onSelect(item.url);
                      onClose();
                    }}
                    className={`group relative rounded-xl overflow-hidden border transition-all text-left aspect-square bg-white shadow-xs hover:shadow-md cursor-pointer ${
                      isSelected
                        ? 'border-[#168039] ring-2 ring-[#168039]'
                        : 'border-gray-200 hover:border-[#168039]'
                    }`}
                  >
                    <Image
                      src={item.url}
                      alt={item.name}
                      fill
                      sizes="200px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Selected Badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#168039] text-white flex items-center justify-center shadow-sm">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}

                    {/* Hover Name Overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-[10px] text-white truncate opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.name}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-white">
          <span>{filteredMedia.length} image(s) available</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium cursor-pointer"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
