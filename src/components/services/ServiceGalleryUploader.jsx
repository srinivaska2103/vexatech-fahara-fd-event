import { useState, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useProfileStore } from '@/store/profileStore';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/api';

export default function ServiceGalleryUploader({ value = [], onChange, error }) {
  const [isUploading, setIsUploading] = useState(false);
  const [localPreviews, setLocalPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    // Quick validation
    const validFiles = files.filter(f => f.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      toast.error('Only image files are allowed');
    }

    if (!validFiles.length) return;

    setIsUploading(true);
    setLocalPreviews(validFiles.map(file => URL.createObjectURL(file)));
    try {
      const formData = new FormData();
      validFiles.forEach(file => formData.append('images', file));

      const res = await axiosInstance.post(API_ENDPOINTS.UPLOADS.MULTIPLE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const newUrls = res.data.data?.map(img => img.url) || [];
      onChange([...value, ...newUrls]);
      toast.success('Images uploaded successfully');
    } catch (err) {
      console.error('Gallery upload error', err);
      toast.error('Failed to upload images');
    } finally {
      setIsUploading(false);
      setLocalPreviews([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = (indexToRemove) => {
    onChange(value.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <label className="block text-sm font-semibold text-text">Service Gallery</label>
        <span className="text-xs text-text/50">{value.length} images added</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {value.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-xl overflow-hidden group border border-border shadow-sm">
            <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 transition-transform"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {localPreviews.map((url, index) => (
          <div key={`preview-${index}`} className="relative aspect-square rounded-xl overflow-hidden border border-border shadow-sm opacity-70">
            <img src={url} alt={`Uploading preview`} className="w-full h-full object-cover grayscale-[30%]" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <Loader2 className="w-8 h-8 animate-spin text-primary drop-shadow-md" />
            </div>
          </div>
        ))}
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors
            ${error ? 'border-red-400 bg-red-50 text-red-500' : 'border-border bg-surface hover:bg-background hover:border-primary text-text/50 hover:text-primary'}
          `}
        >
          {isUploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          ) : (
            <>
              <UploadCloud className="w-6 h-6" />
              <span className="text-xs font-semibold">Upload Image</span>
            </>
          )}
        </button>
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
      
      <input 
        type="file" 
        multiple 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleUpload}
      />
    </div>
  );
}
