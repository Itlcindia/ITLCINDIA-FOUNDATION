'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, ImageIcon, Trash2, Loader2 } from 'lucide-react';
import { MediaGalleryModal } from './media-gallery-modal';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  aspect?: 'video' | 'square' | 'wide' | 'auto';
  required?: boolean;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  hint,
  aspect = 'video',
  required = false,
}: ImageUploadFieldProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDeviceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/content/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        onChange(data.url);
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const aspectClass =
    aspect === 'square'
      ? 'aspect-square max-w-[180px]'
      : aspect === 'wide'
      ? 'aspect-[21/9] max-w-md'
      : aspect === 'auto'
      ? 'h-36 max-w-sm'
      : 'aspect-[16/9] max-w-xs';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {hint && <span className="text-[11px] text-gray-400">{hint}</span>}
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-4 p-3.5 bg-gray-50 border border-gray-200 rounded-2xl">
        {/* Thumbnail Preview Box */}
        <div
          className={`relative w-full ${aspectClass} rounded-xl overflow-hidden border border-gray-200 bg-white flex items-center justify-center shrink-0 shadow-2xs`}
        >
          {value ? (
            <Image
              src={value}
              alt={label}
              fill
              sizes="200px"
              className="object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400 p-4 text-center">
              <ImageIcon className="w-8 h-8 mb-1 stroke-1" />
              <span className="text-[10px]">No image selected</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 w-full">
          {/* Path preview */}
          {value && (
            <div className="text-[11px] font-mono text-gray-500 truncate bg-white px-2.5 py-1.5 rounded-lg border border-gray-200">
              {value}
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            {/* Direct Upload from Device Button */}
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#168039] hover:bg-[#137233] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-75"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload from Device</span>
                </>
              )}
            </button>

            {/* Pick from Gallery Button */}
            <button
              type="button"
              onClick={() => setIsGalleryOpen(true)}
              className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#168039]" />
              <span>Choose from Gallery</span>
            </button>

            {/* Remove Button */}
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-red-600 hover:bg-red-50 text-xs font-medium px-2.5 py-2 rounded-xl flex items-center gap-1 transition-colors cursor-pointer border border-transparent hover:border-red-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleDeviceUpload}
            disabled={isUploading}
          />
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelect={(url) => onChange(url)}
        selectedUrl={value}
      />
    </div>
  );
}
