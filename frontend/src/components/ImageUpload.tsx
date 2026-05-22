'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, X, Loader2, Image as ImageIcon } from 'lucide-react';
import api from '@/lib/axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export interface CloudinaryImage {
  url: string;
  public_id: string;
}

interface ImageUploadProps {
  images: (string | CloudinaryImage)[];
  onChange: (images: (string | CloudinaryImage)[]) => void;
}

export default function ImageUpload({ images, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    
    setUploading(true);
    
    try {
      const newImages = [...images];
      
      // Upload each file to the backend
      for (const file of acceptedFiles) {
        const formData = new FormData();
        formData.append('image', file);
        
        const config = {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        };

        const { data } = await api.post('/api/upload', formData, config);
        newImages.push({ url: data.url, public_id: data.public_id });
      }
      
      onChange(newImages);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [images, onChange, user]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    disabled: uploading
  });

  const handleRemove = async (indexToRemove: number) => {
    const imageToRemove = images[indexToRemove];
    
    // If it's a Cloudinary object, try to delete it from Cloudinary
    if (typeof imageToRemove !== 'string' && imageToRemove.public_id) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user?.token}` }
        };
        await api.post('/api/upload/destroy', { public_id: imageToRemove.public_id }, config);
      } catch (error) {
        console.error('Failed to destroy image on server:', error);
        // Continue to remove from UI even if server fails
      }
    }
    
    const newImages = images.filter((_, idx) => idx !== indexToRemove);
    onChange(newImages);
  };

  const getImgUrl = (img: string | CloudinaryImage) => typeof img === 'string' ? img : img.url;

  return (
    <div className="w-full space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-[#ff0033] bg-[#ff0033]/5' 
            : 'border-white/20 hover:border-[#ff0033]/50 bg-black/40 hover:bg-black/60'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`p-4 rounded-full ${isDragActive ? 'bg-[#ff0033]/20' : 'bg-white/5'}`}>
            <UploadCloud size={32} className={isDragActive ? 'text-[#ff0033]' : 'text-gray-400'} />
          </div>
          <div>
            <p className="text-white font-poppins text-sm">
              {isDragActive ? "Drop the images here..." : "Drag & drop product images here"}
            </p>
            <p className="text-gray-500 font-montserrat text-xs mt-2 uppercase tracking-widest">
              or click to browse (JPG, PNG, WEBP)
            </p>
          </div>
          {uploading && (
            <div className="flex items-center space-x-2 text-[#ff0033] mt-4">
              <Loader2 className="animate-spin" size={16} />
              <span className="font-montserrat text-xs uppercase tracking-widest font-bold">Uploading to Cloudinary...</span>
            </div>
          )}
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
          <AnimatePresence>
            {images.map((img, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative aspect-square rounded-xl overflow-hidden group border border-white/10 bg-black/50"
              >
                {getImgUrl(img) ? (
                  <img src={getImgUrl(img)} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={24} className="text-gray-600" />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    type="button" 
                    onClick={() => handleRemove(idx)} 
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transform transition-transform hover:scale-110"
                    title="Remove Image"
                  >
                    <X size={16}/>
                  </button>
                </div>
                
                {/* Visual indicator if it's an old string URL or new Cloudinary asset */}
                <div className="absolute bottom-2 left-2 pointer-events-none">
                  <span className="text-[9px] font-montserrat tracking-widest uppercase bg-black/80 px-2 py-0.5 rounded text-white/50 border border-white/10">
                    {typeof img === 'string' ? 'EXTERNAL URL' : 'CLOUD'}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
