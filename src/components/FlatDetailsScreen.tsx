import React, { useState } from 'react';
import { FlatItem } from '../types';
import { FloorPlanDiagram } from './FloorPlanDiagram';
import { VisualDiagrams } from './VisualDiagrams';
import {
  Building2,
  Calendar,
  Layers,
  ShieldAlert,
  Coins,
  CheckCircle,
  HelpCircle,
  Wrench,
  Users,
  Compass,
  ArrowRight,
  ArrowLeft,
  Image as ImageIcon,
  Eye,
  Maximize2
} from 'lucide-react';

interface FlatDetailsScreenProps {
  flat: FlatItem;
  onOpenMortgage: () => void;
  onBackToHome: () => void;
  onOpenPhotoGallery?: (flat: FlatItem, initialIdx?: number) => void;
}

export const FlatDetailsScreen: React.FC<FlatDetailsScreenProps> = ({
  flat,
  onOpenMortgage,
  onBackToHome,
  onOpenPhotoGallery,
}) => {
  // CPF Grant Eligibility State
  const [householdIncome, setHouseholdIncome] = useState<number>(7500);
  const [isFirstTimer, setIsFirstTimer] = useState<boolean>(true);
  const [nearParents, setNearParents] = useState<boolean>(true);
  const [renoTier, setRenoTier] = useState<'essential' | 'moderate' | 'full'>('moderate');

  // Calculate EHG grant
  let calculatedEHG = 0;
  if (isFirstTimer) {
    if (householdIncome <= 1500) calculatedEHG = 80000;
    else if (householdIncome <= 3000) calculatedEHG = 65000;
    else if (householdIncome <= 5000) calculatedEHG = 45000;
    else if (householdIncome <= 7000) calculatedEHG = 25000;
    else if (householdIncome <= 9000) calculatedEHG = 10000;
    else calculatedEHG = 0;
  }

  // Family Grant for resale flat
  const calculatedFamilyGrant = isFirstTimer && householdIncome <= 14000 ? 80000 : 0;

  // Proximity Grant
  const calculatedPHG = nearParents ? 20000 : 0;

  const totalGrants = calculatedEHG + calculatedFamilyGrant + calculatedPHG;
  const netEffectivePrice = Math.max(0, flat.estimatedPrice - totalGrants);

  const images = flat.images || [];

  return (
    <div id="flat-details-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0e6969] hover:text-[#004f50] bg-white px-3 py-1.5 rounded-md border border-[#e0e3e5] shadow-xs hover:bg-[#f7f9fb] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Live Dashboard</span>
        </button>

        {images.length > 0 && onOpenPhotoGallery && (
          <button
            onClick={() => onOpenPhotoGallery(flat, 0)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#041627] hover:bg-[#1a2b3c] px-3.5 py-1.5 rounded-md shadow-xs transition-all"
          >
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            <span>View All {images.length} High-Res Photos</span>
          </button>
        )}
      </div>

      {/* Header Info */}
      <div className="bg-white p-6 rounded-xl border border-[#e0e3e5] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#041627] text-white text-[11px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
              {flat.flatType} • {flat.model}
            </span>
            <span className="text-xs text-[#74777d]">District {flat.district.replace('District ', '')}</span>
            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded">
              Score {flat.decisionScore.toFixed(1)}/10
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#041627] mt-2 font-['Inter']">
            {flat.street}, {flat.block}
          </h1>
          <p className="text-sm text-[#44474c] mt-0.5">
            {flat.town} Town • Postal {flat.postalCode} • {flat.floorAreaSqm} sqm / {flat.floorAreaSqft} sqft
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-[#74777d]">Estimated Resale Price</div>
            <div className="font-['JetBrains_Mono'] text-2xl font-bold text-[#041627]">
              ${flat.estimatedPrice.toLocaleString()}
            </div>
            <div className="text-xs text-[#0e6969] font-medium font-['JetBrains_Mono']">
              ~${Math.round(flat.estimatedPrice / flat.floorAreaSqft)} psf
            </div>
          </div>
          <button
            onClick={onOpenMortgage}
            className="bg-[#0e6969] text-white px-5 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider hover:bg-[#004f50] transition-colors shadow-sm"
          >
            Loan Modeler
          </button>
        </div>
      </div>

      {/* Visual Photography Carousel Strip */}
      {images.length > 0 && (
        <div className="bg-white p-5 rounded-xl border border-[#e0e3e5] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#0e6969]" />
              <h3 className="text-base font-bold text-[#041627]">
                Interior & Architectural Visuals
              </h3>
            </div>
            {onOpenPhotoGallery && (
              <button
                onClick={() => onOpenPhotoGallery(flat, 0)}
                className="text-xs text-[#0e6969] font-semibold hover:underline flex items-center gap-1"
              >
                <span>Fullscreen Gallery ({images.length} Photos)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => onOpenPhotoGallery && onOpenPhotoGallery(flat, idx)}
                className="group relative h-40 rounded-lg overflow-hidden border border-[#e0e3e5] cursor-pointer shadow-xs"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-emerald-400 font-mono">
                    {img.category}
                  </span>
                  <div className="text-xs font-semibold drop-shadow-xs mt-1 truncate">
                    {img.title}
                  </div>
                </div>
                <div className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Floor Plan & Visual Diagrams */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Architectural Floor Plan Diagram */}
          <FloorPlanDiagram
            floorPlanSpec={flat.floorPlanSpec}
            floorAreaSqm={flat.floorAreaSqm}
            floorAreaSqft={flat.floorAreaSqft}
            flatType={flat.flatType}
            model={flat.model}
            onOpenGallery={() => onOpenPhotoGallery && onOpenPhotoGallery(flat, 0)}
          />

          {/* 2. Visual Property Intelligence & Lease Diagrams */}
          <VisualDiagrams flat={flat} />
        </div>

        {/* Right Col: CPF Grants & Renovation Estimator */}
        <div className="space-y-6">
          {/* CPF Housing Grants Calculator */}
          <div className="bg-white p-6 rounded-lg border border-[#e0e3e5] shadow-sm">
            <h3 className="text-lg font-bold text-[#041627] flex items-center gap-2 mb-1">
              <Coins className="w-5 h-5 text-[#db7618]" />
              <span>CPF Grant Simulator</span>
            </h3>
            <p className="text-xs text-[#74777d] mb-4">
              Simulate government housing subsidies up to $160,000
            </p>

            <div className="space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#44474c]">Monthly Household Income:</span>
                  <span className="font-['JetBrains_Mono'] font-bold text-[#041627]">
                    ${householdIncome.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="14000"
                  step="500"
                  value={householdIncome}
                  onChange={(e) => setHouseholdIncome(Number(e.target.value))}
                  className="w-full accent-[#0e6969]"
                />
              </div>

              <div className="flex items-center justify-between py-1 border-t border-[#f2f4f6]">
                <span className="text-[#44474c]">First-Timer Citizen Applicants</span>
                <input
                  type="checkbox"
                  checked={isFirstTimer}
                  onChange={(e) => setIsFirstTimer(e.target.checked)}
                  className="w-4 h-4 accent-[#0e6969] rounded"
                />
              </div>

              <div className="flex items-center justify-between py-1 border-t border-[#f2f4f6]">
                <span className="text-[#44474c]">Within 4km of Parents (PHG)</span>
                <input
                  type="checkbox"
                  checked={nearParents}
                  onChange={(e) => setNearParents(e.target.checked)}
                  className="w-4 h-4 accent-[#0e6969] rounded"
                />
              </div>

              {/* Breakdown */}
              <div className="bg-[#f7f9fb] p-3 rounded border border-[#e0e3e5] space-y-1.5 mt-3">
                <div className="flex justify-between">
                  <span className="text-[#74777d]">Enhanced Housing Grant:</span>
                  <span className="font-['JetBrains_Mono'] font-bold text-[#0e6969]">
                    +${calculatedEHG.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#74777d]">CPF Family Grant:</span>
                  <span className="font-['JetBrains_Mono'] font-bold text-[#0e6969]">
                    +${calculatedFamilyGrant.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#74777d]">Proximity Housing Grant:</span>
                  <span className="font-['JetBrains_Mono'] font-bold text-[#0e6969]">
                    +${calculatedPHG.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-[#c4c6cd]/50 pt-2 flex justify-between font-bold text-sm">
                  <span className="text-[#041627]">Total Grants:</span>
                  <span className="font-['JetBrains_Mono'] text-[#db7618]">
                    ${totalGrants.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-[#041627] text-white rounded-lg text-center">
                <div className="text-[11px] text-[#8192a7]">Net Purchase Price After Grants</div>
                <div className="font-['JetBrains_Mono'] text-2xl font-bold text-[#a4f0ef] mt-0.5">
                  ${netEffectivePrice.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Renovation Cost Estimator */}
          <div className="bg-white p-6 rounded-lg border border-[#e0e3e5] shadow-sm">
            <h3 className="text-lg font-bold text-[#041627] flex items-center gap-2 mb-1">
              <Wrench className="w-5 h-5 text-[#0e6969]" />
              <span>Renovation Budget</span>
            </h3>
            <p className="text-xs text-[#74777d] mb-3">
              Estimated carpentry, masonry, plumbing & electrical
            </p>

            <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
              <button
                onClick={() => setRenoTier('essential')}
                className={`p-2 rounded border transition-colors ${
                  renoTier === 'essential'
                    ? 'border-[#0e6969] bg-[#a4f0ef]/20 font-bold text-[#0e6969]'
                    : 'border-[#e0e3e5] bg-[#f7f9fb] text-[#74777d]'
                }`}
              >
                <div>Essential</div>
                <div className="font-['JetBrains_Mono'] mt-1">$25k</div>
              </button>
              <button
                onClick={() => setRenoTier('moderate')}
                className={`p-2 rounded border transition-colors ${
                  renoTier === 'moderate'
                    ? 'border-[#0e6969] bg-[#a4f0ef]/20 font-bold text-[#0e6969]'
                    : 'border-[#e0e3e5] bg-[#f7f9fb] text-[#74777d]'
                }`}
              >
                <div>Moderate</div>
                <div className="font-['JetBrains_Mono'] mt-1">$45k</div>
              </button>
              <button
                onClick={() => setRenoTier('full')}
                className={`p-2 rounded border transition-colors ${
                  renoTier === 'full'
                    ? 'border-[#0e6969] bg-[#a4f0ef]/20 font-bold text-[#0e6969]'
                    : 'border-[#e0e3e5] bg-[#f7f9fb] text-[#74777d]'
                }`}
              >
                <div>Full Overhaul</div>
                <div className="font-['JetBrains_Mono'] mt-1">$70k</div>
              </button>
            </div>

            <div className="text-[11px] text-[#44474c] bg-[#f7f9fb] p-2.5 rounded border border-[#e0e3e5]">
              {renoTier === 'essential' && 'Covers repainting, vinyl overlay flooring, basic bathroom fittings and lights.'}
              {renoTier === 'moderate' && 'Includes new kitchen cabinetry, full bathroom revamp, carpentry in master bedroom.'}
              {renoTier === 'full' && 'Complete hacking of tiles, designer carpentry, smart home wiring & premium fixtures.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
