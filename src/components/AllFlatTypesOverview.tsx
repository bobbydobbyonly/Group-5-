import React, { useState } from 'react';
import { FlatItem, PropertyImage } from '../types';
import {
  Building,
  Layers,
  MapPin,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Maximize2,
  Eye,
  ArrowRight,
  ShieldCheck,
  Compass,
  Sparkles,
  ChevronRight,
  Filter
} from 'lucide-react';

interface AllFlatTypesOverviewProps {
  allFlats: FlatItem[];
  selectedFlatId: string;
  onSelectFlat: (flat: FlatItem) => void;
  onOpenPhotoGallery: (flat: FlatItem, initialIdx?: number) => void;
  onOpenDetails: () => void;
}

export const AllFlatTypesOverview: React.FC<AllFlatTypesOverviewProps> = ({
  allFlats,
  selectedFlatId,
  onSelectFlat,
  onOpenPhotoGallery,
  onOpenDetails,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [activeViewMode, setActiveViewMode] = useState<'grid' | 'comparison'>('grid');

  const flatTypes = [
    { label: 'All Flat Types', value: 'All', count: allFlats.length },
    { label: '2-Room Flexi', value: '2-Room', count: allFlats.filter((f) => f.flatType === '2-Room').length },
    { label: '3-Room', value: '3-Room', count: allFlats.filter((f) => f.flatType === '3-Room').length },
    { label: '4-Room', value: '4-Room', count: allFlats.filter((f) => f.flatType === '4-Room').length },
    { label: '5-Room', value: '5-Room', count: allFlats.filter((f) => f.flatType === '5-Room').length },
    { label: 'Executive / Pinnacle', value: 'Executive', count: allFlats.filter((f) => f.flatType === 'Executive').length },
  ];

  const filteredFlats =
    activeFilter === 'All'
      ? allFlats
      : allFlats.filter((f) => f.flatType === activeFilter);

  return (
    <section id="all-flat-types-overview" className="mb-8 space-y-4">
      {/* Header & Filter Controls */}
      <div className="bg-white p-5 rounded-xl border border-[#e0e3e5] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#0e6969]/10 text-[#0e6969]">
              <Building className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#041627] font-['Inter']">
              Explore All HDB Flat Types
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
              Full HDB Spectrum ($300k - $2.0M Max)
            </span>
          </div>
          <p className="text-xs text-[#74777d] mt-1">
            Compare room layouts, interior photography, price ranges, and decision scores across Singapore estates.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#f7f9fb] p-1.5 rounded-lg border border-[#e0e3e5]">
          {flatTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setActiveFilter(type.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeFilter === type.value
                  ? 'bg-[#041627] text-white shadow-xs'
                  : 'text-[#44474c] hover:text-[#041627] hover:bg-[#e6e8ea]'
              }`}
            >
              <span>{type.label}</span>
              {type.count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeFilter === type.value
                      ? 'bg-white/20 text-white'
                      : 'bg-[#e0e3e5] text-[#44474c]'
                  }`}
                >
                  {type.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Flat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFlats.map((flat) => {
          const isSelected = flat.id === selectedFlatId;
          const heroImage = flat.images?.[0]?.url || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80';
          const totalPhotos = flat.images?.length || 0;

          return (
            <div
              key={flat.id}
              className={`bg-white rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden group hover:shadow-lg ${
                isSelected
                  ? 'border-[#0e6969] ring-2 ring-[#0e6969]/30 shadow-md'
                  : 'border-[#e0e3e5]'
              }`}
            >
              {/* Home Picture Container */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={heroImage}
                  alt={`${flat.street}, ${flat.block}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="bg-[#041627]/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider backdrop-blur-xs border border-white/10">
                    {flat.flatType} • {flat.model}
                  </span>

                  <span className="bg-emerald-500/90 text-white text-xs font-bold px-2.5 py-1 rounded-md backdrop-blur-xs shadow-xs">
                    Score {flat.decisionScore.toFixed(1)}/10
                  </span>
                </div>

                {/* Bottom Photo Overlay Info */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between text-white">
                  <div>
                    <div className="text-sm font-bold drop-shadow-sm">
                      {flat.street}, {flat.block}
                    </div>
                    <div className="text-[11px] text-white/80 flex items-center gap-1 drop-shadow-xs">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>{flat.town} ({flat.district})</span>
                    </div>
                  </div>

                  {totalPhotos > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenPhotoGallery(flat, 0);
                      }}
                      className="bg-black/60 hover:bg-black/80 text-white text-[11px] font-medium px-2 py-1 rounded flex items-center gap-1 backdrop-blur-xs border border-white/20 transition-colors"
                      title="View all home pictures"
                    >
                      <Eye className="w-3 h-3" />
                      <span>{totalPhotos} Photos</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Card Body Specs */}
              <div className="p-5 flex-grow space-y-4">
                {/* Price & Mortgage Metric */}
                <div className="flex items-center justify-between p-3 bg-[#f7f9fb] rounded-lg border border-[#e0e3e5]">
                  <div>
                    <div className="text-[10px] text-[#74777d] uppercase font-semibold">Resale Estimate</div>
                    <div className="font-['JetBrains_Mono'] text-lg font-bold text-[#041627]">
                      ${flat.estimatedPrice.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[#0e6969] font-['JetBrains_Mono']">
                      ${Math.round(flat.estimatedPrice / flat.floorAreaSqft)} psf
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-[#74777d] uppercase font-semibold">Est. Monthly</div>
                    <div className="font-['JetBrains_Mono'] text-base font-bold text-[#0e6969]">
                      ${flat.estimatedMonthlyMortgage.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[#74777d]">
                      {flat.affordabilityStatus}
                    </div>
                  </div>
                </div>

                {/* Floorplate & Lease Specs */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#f7f9fb] p-2 rounded border border-[#e0e3e5]/60">
                    <span className="text-[#74777d] block text-[10px]">Floor Plate</span>
                    <span className="font-bold text-[#041627]">
                      {flat.floorAreaSqm} sqm ({flat.floorAreaSqft} sqft)
                    </span>
                  </div>
                  <div className="bg-[#f7f9fb] p-2 rounded border border-[#e0e3e5]/60">
                    <span className="text-[#74777d] block text-[10px]">Remaining Lease</span>
                    <span className="font-bold text-[#041627]">
                      {flat.remainingLeaseYears}y {flat.remainingLeaseMonths}m
                    </span>
                  </div>
                </div>

                {/* Match Highlight */}
                <p className="text-xs text-[#44474c] line-clamp-2 leading-relaxed">
                  {flat.matchReason}
                </p>

                {/* Proximity Pill */}
                <div className="text-[11px] text-[#0e6969] bg-[#a4f0ef]/15 px-2.5 py-1.5 rounded flex items-center justify-between">
                  <span>{flat.mrtStation.name}</span>
                  <span className="font-semibold">{flat.mrtStation.walkMins}m walk</span>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-4 bg-[#f7f9fb] border-t border-[#e0e3e5] flex items-center gap-2">
                <button
                  onClick={() => onSelectFlat(flat)}
                  className={`flex-1 py-2 px-3 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#0e6969] text-white shadow-xs'
                      : 'bg-[#041627] text-white hover:bg-[#1a2b3c]'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active Dashboard</span>
                    </>
                  ) : (
                    <>
                      <span>Select & Analyze</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    onSelectFlat(flat);
                    onOpenDetails();
                  }}
                  className="p-2 rounded-md border border-[#e0e3e5] bg-white hover:bg-[#e6e8ea] text-[#44474c] hover:text-[#041627] text-xs font-semibold transition-colors"
                  title="View Full Specs & Floor Plan"
                >
                  Specs
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
