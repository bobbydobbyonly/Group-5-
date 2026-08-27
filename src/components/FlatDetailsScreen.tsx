import React, { useState } from 'react';
import { FlatItem } from '../types';
import { CPF_HOUSING_GRANTS_INFO } from '../data/hdbData';
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
  ArrowRight
} from 'lucide-react';

interface FlatDetailsScreenProps {
  flat: FlatItem;
  onOpenMortgage: () => void;
  onBackToHome: () => void;
}

export const FlatDetailsScreen: React.FC<FlatDetailsScreenProps> = ({
  flat,
  onOpenMortgage,
  onBackToHome,
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

  // Family Grant for resale 4-room
  const calculatedFamilyGrant = isFirstTimer && householdIncome <= 14000 ? 80000 : 0;

  // Proximity Grant
  const calculatedPHG = nearParents ? 20000 : 0;

  const totalGrants = calculatedEHG + calculatedFamilyGrant + calculatedPHG;
  const netEffectivePrice = Math.max(0, flat.estimatedPrice - totalGrants);

  // Renovation cost estimates
  const renoCosts = {
    essential: 25000,
    moderate: 45000,
    full: 70000,
  };

  return (
    <div id="flat-details-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-lg border border-[#e0e3e5] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#041627] text-white text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              {flat.flatType} {flat.model}
            </span>
            <span className="text-xs text-[#74777d]">District {flat.district.replace('District ', '')}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#041627] mt-1 font-['Inter']">
            {flat.street}, {flat.block}
          </h1>
          <p className="text-sm text-[#44474c]">
            {flat.town} Town • Postal {flat.postalCode} • {flat.floorAreaSqm} sqm / {flat.floorAreaSqft} sqft
          </p>
        </div>

        <div className="flex items-center gap-3">
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
            className="bg-[#0e6969] text-white px-4 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-[#004f50] transition-colors shadow-sm"
          >
            Calculate Loan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Floor Plan & Lease Decay */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Floor Plan Layout Visualizer */}
          <div className="bg-white p-6 rounded-lg border border-[#e0e3e5] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-[#041627] flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#0e6969]" />
                  <span>Standard 4-Room Model A Layout ({flat.floorAreaSqm} sqm)</span>
                </h3>
                <p className="text-xs text-[#74777d]">
                  Optimized corner unit orientation • North-South facing with zero west sun
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#0e6969] bg-[#a4f0ef]/20 px-2.5 py-1 rounded font-medium">
                <Compass className="w-4 h-4" />
                <span>N-S Facade</span>
              </div>
            </div>

            {/* Architectural Schematic Visualizer */}
            <div className="border-2 border-dashed border-[#c4c6cd] rounded-lg p-4 bg-[#f7f9fb] relative">
              <div className="grid grid-cols-12 gap-2 text-center text-xs font-medium min-h-[220px]">
                {/* Master Bed + Bath */}
                <div className="col-span-4 bg-white border border-[#c4c6cd] rounded p-3 flex flex-col justify-between shadow-xs">
                  <span className="font-bold text-[#041627]">Master Bedroom</span>
                  <div className="text-[11px] text-[#74777d] my-2">16.8 sqm (With Attached Bath)</div>
                  <span className="text-[10px] text-[#0e6969] bg-[#a4f0ef]/30 py-0.5 rounded">En-suite Bath</span>
                </div>

                {/* Common Bedroom 1 */}
                <div className="col-span-4 bg-white border border-[#c4c6cd] rounded p-3 flex flex-col justify-between shadow-xs">
                  <span className="font-bold text-[#041627]">Bedroom 2</span>
                  <div className="text-[11px] text-[#74777d] my-2">12.5 sqm</div>
                  <span className="text-[10px] text-[#74777d] bg-[#f2f4f6] py-0.5 rounded">Wardrobe Alcove</span>
                </div>

                {/* Common Bedroom 2 */}
                <div className="col-span-4 bg-white border border-[#c4c6cd] rounded p-3 flex flex-col justify-between shadow-xs">
                  <span className="font-bold text-[#041627]">Bedroom 3 / Study</span>
                  <div className="text-[11px] text-[#74777d] my-2">11.8 sqm</div>
                  <span className="text-[10px] text-[#74777d] bg-[#f2f4f6] py-0.5 rounded">Aircon Ledge</span>
                </div>

                {/* Living & Dining Hall */}
                <div className="col-span-7 bg-white border border-[#0e6969]/40 rounded p-4 flex flex-col justify-between shadow-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#041627]">Living & Dining Hall</span>
                    <span className="text-[10px] font-bold text-[#0e6969]">32.4 sqm</span>
                  </div>
                  <div className="text-xs text-[#74777d] py-3 text-left">
                    • Spacious squarish floorplate with no odd angles<br/>
                    • Full-height windows towards park view
                  </div>
                  <span className="text-[10px] text-left text-[#44474c]">Main Door Entrance (East Facing)</span>
                </div>

                {/* Kitchen + Service Yard + Store */}
                <div className="col-span-5 grid grid-rows-2 gap-2">
                  <div className="bg-white border border-[#c4c6cd] rounded p-2 flex flex-col justify-between">
                    <span className="font-bold text-[#041627] text-[11px]">Enclosed Kitchen & Yard</span>
                    <span className="text-[10px] text-[#74777d]">11.5 sqm (Yard + WC)</span>
                  </div>
                  <div className="bg-white border border-[#c4c6cd] rounded p-2 flex flex-col justify-between">
                    <span className="font-bold text-[#041627] text-[11px]">Household Shelter / Store</span>
                    <span className="text-[10px] text-[#74777d]">4.2 sqm (Reinforced)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Remaining Lease & Financing Viability */}
          <div className="bg-white p-6 rounded-lg border border-[#e0e3e5] shadow-sm">
            <h3 className="text-lg font-bold text-[#041627] flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-[#0e6969]" />
              <span>Lease Viability & CPF Usage Rules</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-[#f7f9fb] p-3 rounded border border-[#e0e3e5]">
                <div className="text-xs text-[#74777d]">Remaining Lease</div>
                <div className="font-['JetBrains_Mono'] text-lg font-bold text-[#041627] mt-0.5">
                  {flat.remainingLeaseYears}y {flat.remainingLeaseMonths}m
                </div>
                <div className="text-[11px] text-[#0e6969]">Lease until year {flat.leaseCommenced + 99}</div>
              </div>

              <div className="bg-[#f7f9fb] p-3 rounded border border-[#e0e3e5]">
                <div className="text-xs text-[#74777d]">CPF Usage Rules</div>
                <div className="font-semibold text-[#041627] text-sm mt-0.5">
                  Full 100% CPF OA Limit
                </div>
                <div className="text-[11px] text-[#44474c]">If youngest buyer reaches age 95</div>
              </div>

              <div className="bg-[#f7f9fb] p-3 rounded border border-[#e0e3e5]">
                <div className="text-xs text-[#74777d]">HDB Loan Max Tenure</div>
                <div className="font-['JetBrains_Mono'] text-lg font-bold text-[#041627] mt-0.5">
                  25 Years
                </div>
                <div className="text-[11px] text-[#0e6969]">Eligible for 2.6% p.a. Concessionary</div>
              </div>
            </div>

            <div className="p-3 bg-[#a4f0ef]/10 border border-[#a4f0ef] rounded text-xs text-[#176d6e] leading-relaxed">
              <strong>Bala's Curve Analysis:</strong> At {flat.remainingLeaseYears} years remaining, this unit retains approximately 78.5% of equivalent freehold value. Resale velocity in {flat.town} remains brisk due to central amenities.
            </div>
          </div>
        </div>

        {/* Right Col: CPF Grants & Renovation Estimator */}
        <div className="space-y-6">
          {/* CPF Housing Grants Calculator */}
          <div className="bg-white p-6 rounded-lg border border-[#e0e3e5] shadow-sm">
            <h3 className="text-lg font-bold text-[#041627] flex items-center gap-2 mb-1">
              <Coins className="w-5 h-5 text-[#db7618]" />
              <span>CPF Grant Eligibility</span>
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
                <span className="text-[#44474c]">First-Timer Applicants</span>
                <input
                  type="checkbox"
                  checked={isFirstTimer}
                  onChange={(e) => setIsFirstTimer(e.target.checked)}
                  className="w-4 h-4 accent-[#0e6969] rounded"
                />
              </div>

              <div className="flex items-center justify-between py-1 border-t border-[#f2f4f6]">
                <span className="text-[#44474c]">Living within 4km of Parents</span>
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

              <div className="p-3 bg-[#041627] text-white rounded text-center">
                <div className="text-[11px] text-[#8192a7]">Net Purchase Price After Grants</div>
                <div className="font-['JetBrains_Mono'] text-xl font-bold text-[#a4f0ef] mt-0.5">
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
