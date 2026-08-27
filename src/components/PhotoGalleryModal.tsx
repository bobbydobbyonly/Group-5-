import React, { useState } from 'react';
import { PropertyImage } from '../types';
import { X, ChevronLeft, ChevronRight, Maximize2, Image as ImageIcon, Eye } from 'lucide-react';

interface PhotoGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: PropertyImage[];
  flatTitle: string;
  initialIndex?: number;
}

export const PhotoGalleryModal: React.FC<PhotoGalleryModalProps> = ({
  isOpen,
  onClose,
  images,
  flatTitle,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen || !images || images.length === 0) return null;

  const categories = ['All', ...Array.from(new Set(images.map((img) => img.category)))];

  const filteredImages =
    selectedCategory === 'All'
      ? images
      : images.filter((img) => img.category === selectedCategory);

  const activeImage = filteredImages[currentIndex] || filteredImages[0] || images[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredImages.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < filteredImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <div
      id="photo-gallery-modal"
      className="fixed inset-0 z-50 bg-black/90 flex flex-col justify-between p-4 md:p-6 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between text-white border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/10 text-emerald-400">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-white tracking-tight">{flatTitle}</h2>
            <p className="text-xs text-white/60">
              Photo {currentIndex + 1} of {filteredImages.length} • {activeImage.category}
            </p>
          </div>
        </div>

        {/* Category Pills */}
        <div className="hidden md:flex items-center gap-1.5 bg-white/10 p-1 rounded-lg">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIndex(0);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-[#041627] shadow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close Gallery"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image Display Area */}
      <div className="relative flex-grow flex items-center justify-center my-3 overflow-hidden">
        <div className="relative max-w-5xl max-h-[70vh] w-full flex items-center justify-center">
          <img
            src={activeImage.url}
            alt={activeImage.title}
            referrerPolicy="no-referrer"
            className="max-h-[68vh] w-auto max-w-full object-contain rounded-lg shadow-2xl transition-all duration-300 select-none"
          />

          {/* Image Overlay Info Banner */}
          <div className="absolute bottom-3 left-4 right-4 bg-black/70 backdrop-blur-md text-white p-3 rounded-lg border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {activeImage.category}
              </span>
              <h3 className="text-sm font-semibold text-white mt-1">{activeImage.title}</h3>
              {activeImage.description && (
                <p className="text-xs text-white/70 mt-0.5 line-clamp-1">{activeImage.description}</p>
              )}
            </div>
            <div className="text-right text-xs text-white/50 shrink-0">
              High Resolution Architectural Visual
            </div>
          </div>

          {/* Navigation Arrows */}
          {filteredImages.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 md:-left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-2.5 rounded-full border border-white/20 shadow-lg transition-transform hover:scale-105 active:scale-95"
                aria-label="Previous Photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 md:-right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-2.5 rounded-full border border-white/20 shadow-lg transition-transform hover:scale-105 active:scale-95"
                aria-label="Next Photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bottom Thumbnail Strip */}
      <div className="border-t border-white/10 pt-3 flex items-center justify-center overflow-x-auto gap-2 py-1 scrollbar-thin">
        {filteredImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`relative rounded-md overflow-hidden shrink-0 transition-all ${
              currentIndex === idx
                ? 'ring-2 ring-emerald-400 scale-105 opacity-100'
                : 'opacity-50 hover:opacity-80'
            }`}
          >
            <img
              src={img.url}
              alt={img.title}
              referrerPolicy="no-referrer"
              className="w-16 h-12 md:w-20 md:h-14 object-cover"
            />
            <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center py-0.5 truncate px-1">
              {img.category}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
