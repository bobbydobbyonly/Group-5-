import React, { useState } from 'react';
import { FlatItem, Amenity } from '../types';
import { X, MapPin, School, ShoppingBag, TreePine, Stethoscope, Utensils, Navigation } from 'lucide-react';

interface AmenitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  flat: FlatItem;
}

export const AmenitiesModal: React.FC<AmenitiesModalProps> = ({ isOpen, onClose, flat }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Mall', 'School', 'Park', 'Food', 'Supermarket', 'Clinic'];

  const filteredAmenities = flat.amenities.filter((a) => {
    return selectedCategory === 'All' || a.category === selectedCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Mall':
        return <ShoppingBag className="w-4 h-4 text-[#0e6969]" />;
      case 'School':
        return <School className="w-4 h-4 text-[#041627]" />;
      case 'Park':
        return <TreePine className="w-4 h-4 text-emerald-600" />;
      case 'Clinic':
        return <Stethoscope className="w-4 h-4 text-[#ba1a1a]" />;
      case 'Food':
        return <Utensils className="w-4 h-4 text-[#db7618]" />;
      default:
        return <MapPin className="w-4 h-4 text-[#0e6969]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-[#e0e3e5] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#e0e3e5]">
          <div>
            <h2 className="text-lg font-bold text-[#041627]">Neighborhood Amenities & Radius</h2>
            <p className="text-xs text-[#74777d]">Within 1km of {flat.street}, {flat.block}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#74777d] hover:text-[#041627] p-1.5 rounded-lg hover:bg-[#f2f4f6]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 py-3 border-b border-[#f2f4f6]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#041627] text-white font-semibold'
                  : 'bg-[#f2f4f6] text-[#44474c] hover:bg-[#e0e3e5]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Amenities List */}
        <div className="mt-4 space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {filteredAmenities.map((amenity, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg bg-[#f7f9fb] border border-[#e0e3e5] hover:bg-white transition-all shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-white border border-[#e0e3e5] shadow-2xs">
                  {getCategoryIcon(amenity.category)}
                </div>
                <div>
                  <div className="font-semibold text-[#041627] text-sm">{amenity.name}</div>
                  <span className="text-[11px] text-[#74777d] bg-[#f2f4f6] px-1.5 py-0.5 rounded">
                    {amenity.category}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="font-['JetBrains_Mono'] text-xs font-semibold text-[#0e6969]">
                  {amenity.walkTime}
                </div>
                <div className="text-[11px] text-[#74777d]">{amenity.distance}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-[#e0e3e5] flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#041627] text-white px-4 py-2 rounded text-xs font-semibold hover:bg-[#1a2b3c]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
