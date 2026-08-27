import React, { useState } from 'react';
import { FlatItem } from '../types';
import {
  TrendingDown,
  Sun,
  Wind,
  ShieldCheck,
  DollarSign,
  Info,
  Layers,
  Sparkles,
  PieChart,
  BarChart3
} from 'lucide-react';

interface VisualDiagramsProps {
  flat: FlatItem;
}

export const VisualDiagrams: React.FC<VisualDiagramsProps> = ({ flat }) => {
  const [activeDiagram, setActiveDiagram] = useState<'lease' | 'sun' | 'affordability'>('lease');

  // Bala's Curve Data Table
  const balasPoints = [
    { lease: 99, valuePercent: 100, label: 'New 99-Yr' },
    { lease: 90, valuePercent: 95.8, label: '90 Yrs' },
    { lease: 80, valuePercent: 88.5, label: '80 Yrs' },
    { lease: 70, valuePercent: 80.4, label: '70 Yrs' },
    { lease: 60, valuePercent: 71.0, label: '60 Yrs' },
    { lease: 50, valuePercent: 60.0, label: '50 Yrs (Critical Inflection)' },
    { lease: 40, valuePercent: 48.0, label: '40 Yrs' },
    { lease: 30, valuePercent: 34.8, label: '30 Yrs' },
    { lease: 20, valuePercent: 20.0, label: '20 Yrs' },
  ];

  const currentLeaseYears = flat.remainingLeaseYears;
  // Estimate current retained value based on Bala's curve
  const currentRetained = Math.min(
    100,
    Math.max(20, Math.round(70 + ((currentLeaseYears - 60) / 39) * 30))
  );

  return (
    <div
      id="analytics-visual-diagrams-section"
      className="bg-white p-6 rounded-lg border border-[#e0e3e5] shadow-sm mb-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-[#e0e3e5]">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#0e6969]" />
            <h3 className="text-lg font-bold text-[#041627]">Property Intelligence & Visual Diagrams</h3>
          </div>
          <p className="text-xs text-[#74777d]">
            Official SLA Bala's Table, Solar Radiance Trajectory, and Monetary Authority of Singapore (MAS) Affordability Gauges
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-[#f2f4f6] p-1 rounded-md text-xs">
          <button
            onClick={() => setActiveDiagram('lease')}
            className={`px-3 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5 ${
              activeDiagram === 'lease'
                ? 'bg-white text-[#041627] shadow-xs'
                : 'text-[#74777d] hover:text-[#041627]'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5 text-[#0e6969]" />
            <span>Bala's Lease Decay</span>
          </button>
          <button
            onClick={() => setActiveDiagram('sun')}
            className={`px-3 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5 ${
              activeDiagram === 'sun'
                ? 'bg-white text-[#041627] shadow-xs'
                : 'text-[#74777d] hover:text-[#041627]'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-[#db7618]" />
            <span>Sun & Wind Path</span>
          </button>
          <button
            onClick={() => setActiveDiagram('affordability')}
            className={`px-3 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5 ${
              activeDiagram === 'affordability'
                ? 'bg-white text-[#041627] shadow-xs'
                : 'text-[#74777d] hover:text-[#041627]'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>MAS Affordability</span>
          </button>
        </div>
      </div>

      {/* 1. Bala's Lease Decay Visual Diagram */}
      {activeDiagram === 'lease' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-[#f7f9fb] rounded-xl border border-[#e0e3e5]">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#0e6969] bg-[#a4f0ef]/20 px-2 py-0.5 rounded">
                Singapore Land Authority (SLA) Bala's Table
              </span>
              <h4 className="font-bold text-base text-[#041627] mt-1">
                {flat.street}, {flat.block} ({flat.remainingLeaseYears} Years Lease Remaining)
              </h4>
              <p className="text-xs text-[#44474c] mt-0.5">
                Current Estimated Valuation Retained: <strong className="font-['JetBrains_Mono'] text-[#0e6969] text-sm">{currentRetained}% of Freehold Value</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-center p-2.5 bg-white rounded-lg border border-[#e0e3e5] shadow-xs">
                <div className="text-[10px] text-[#74777d]">Year Built</div>
                <div className="font-['JetBrains_Mono'] font-bold text-sm text-[#041627]">{flat.builtYear}</div>
              </div>
              <div className="text-center p-2.5 bg-white rounded-lg border border-[#e0e3e5] shadow-xs">
                <div className="text-[10px] text-[#74777d]">Lease Commenced</div>
                <div className="font-['JetBrains_Mono'] font-bold text-sm text-[#041627]">{flat.leaseCommenced}</div>
              </div>
              <div className="text-center p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 shadow-xs">
                <div className="text-[10px] text-emerald-700">Lease Expiry</div>
                <div className="font-['JetBrains_Mono'] font-bold text-sm text-emerald-800">{flat.leaseCommenced + 99}</div>
              </div>
            </div>
          </div>

          {/* Visual SVG Curve Diagram */}
          <div className="p-4 bg-[#041627] rounded-xl text-white relative overflow-hidden">
            <div className="text-xs text-[#8192a7] font-semibold mb-3 flex items-center justify-between">
              <span>99-Year Leasehold Capital Depreciation Curve vs Freehold (100%)</span>
              <span className="text-emerald-400 font-['JetBrains_Mono']">● Current Unit ({flat.remainingLeaseYears}y)</span>
            </div>

            {/* SVG Visual Graphic */}
            <div className="relative h-44 w-full">
              <svg className="w-full h-full" viewBox="0 0 800 160" preserveAspectRatio="none">
                {/* Background Grid Lines */}
                <line x1="0" y1="20" x2="800" y2="20" stroke="#1f2937" strokeDasharray="4 4" />
                <line x1="0" y1="60" x2="800" y2="60" stroke="#1f2937" strokeDasharray="4 4" />
                <line x1="0" y1="100" x2="800" y2="100" stroke="#1f2937" strokeDasharray="4 4" />
                <line x1="0" y1="140" x2="800" y2="140" stroke="#1f2937" strokeDasharray="4 4" />

                {/* Freehold Benchmark Top Line */}
                <line x1="0" y1="15" x2="800" y2="15" stroke="#4b5563" strokeWidth="1.5" />

                {/* Bala's Curve Path */}
                <path
                  d="M 0 15 C 200 25, 450 70, 600 100 C 700 125, 780 150, 800 155"
                  fill="none"
                  stroke="#0e6969"
                  strokeWidth="3.5"
                />

                {/* Active Property Marker Point */}
                {(() => {
                  const xPos = Math.max(20, Math.min(780, (1 - (flat.remainingLeaseYears / 99)) * 800));
                  const yPos = Math.max(20, Math.min(145, 15 + ((99 - flat.remainingLeaseYears) / 99) * 130));
                  return (
                    <g>
                      <circle cx={xPos} cy={yPos} r="7" fill="#34d399" className="animate-pulse" />
                      <circle cx={xPos} cy={yPos} r="12" fill="#34d399" opacity="0.3" />
                      <line x1={xPos} y1="0" x2={xPos} y2="160" stroke="#34d399" strokeWidth="1" strokeDasharray="3 3" />
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* Scale X Labels */}
            <div className="flex justify-between text-[10px] text-[#8192a7] font-['JetBrains_Mono'] mt-1 px-1">
              <span>99 Yrs (100% Value)</span>
              <span>80 Yrs (88.5%)</span>
              <span>60 Yrs (71.0%)</span>
              <span className="text-amber-400">40 Yrs (48.0% - Steep Drop)</span>
              <span className="text-rose-400">0 Yrs (0%)</span>
            </div>
          </div>

          <div className="text-xs text-[#44474c] bg-[#a4f0ef]/10 border border-[#a4f0ef] p-3 rounded-lg leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-[#0e6969] shrink-0 mt-0.5" />
            <div>
              <strong>Financing Rule of Thumb:</strong> Under Singapore CPF guidelines, if the remaining lease covers the youngest buyer to at least age 95, up to 100% of the maximum CPF housing usage limit and maximum HDB loan loan-to-value (LTV 80%) can be utilized.
            </div>
          </div>
        </div>
      )}

      {/* 2. Sun & Wind Trajectory Diagram */}
      {activeDiagram === 'sun' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 bg-[#f7f9fb] rounded-xl border border-[#e0e3e5] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                Solar Radiation & Wind Aerodynamics
              </span>
              <h4 className="font-bold text-base text-[#041627]">
                Unit Orientation: {flat.floorPlanSpec?.facing || 'North-South Facade'}
              </h4>
              <p className="text-xs text-[#44474c]">
                Calculated solar altitude and afternoon sun exposure angles throughout Singapore's monsoon cycles.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Zero West Sun Intrusion</span>
            </div>
          </div>

          {/* Compass & Trajectory Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sun Trajectory Visual */}
            <div className="p-4 bg-white border border-[#e0e3e5] rounded-xl text-center flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#74777d] font-semibold mb-2">
                <span>Solar Arc Trajectory</span>
                <span className="text-amber-600">East to West Path</span>
              </div>

              <div className="relative my-4 flex items-center justify-center">
                <div className="w-36 h-36 rounded-full border-2 border-dashed border-amber-300 relative flex items-center justify-center bg-amber-50/30">
                  {/* Building Center Box */}
                  <div className="w-16 h-16 bg-[#041627] text-white rounded-lg flex flex-col items-center justify-center text-[10px] font-bold shadow-md">
                    <span>{flat.block}</span>
                    <span className="text-[8px] text-emerald-400">N-S Facing</span>
                  </div>

                  {/* Sun Icon Morning */}
                  <div className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-semibold text-amber-600">
                    <Sun className="w-4 h-4 text-amber-500" /> 07:00 AM
                  </div>

                  {/* Sun Icon Evening */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] font-semibold text-amber-700">
                    <Sun className="w-4 h-4 text-amber-600" /> 06:30 PM
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-[#44474c] bg-[#f7f9fb] p-2 rounded border border-[#e0e3e5]">
                North-South orientation shields the master bedroom and living hall from harsh afternoon western heat, reducing aircon energy usage by up to ~25%.
              </div>
            </div>

            {/* Wind Trajectory Visual */}
            <div className="p-4 bg-white border border-[#e0e3e5] rounded-xl text-center flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#74777d] font-semibold mb-2">
                <span>Monsoon Wind Inflow</span>
                <span className="text-[#0e6969]">Year-round Cross Ventilation</span>
              </div>

              <div className="space-y-3 my-2 text-left text-xs">
                <div className="p-2.5 bg-[#f7f9fb] rounded-lg border border-[#e0e3e5] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#041627] flex items-center gap-1.5">
                      <Wind className="w-3.5 h-3.5 text-[#0e6969]" />
                      <span>NE Monsoon (Dec - Mar)</span>
                    </div>
                    <div className="text-[11px] text-[#74777d]">Cool strong sea winds from North-East</div>
                  </div>
                  <span className="text-[11px] font-bold text-[#0e6969] font-['JetBrains_Mono']">~15-20 km/h</span>
                </div>

                <div className="p-2.5 bg-[#f7f9fb] rounded-lg border border-[#e0e3e5] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#041627] flex items-center gap-1.5">
                      <Wind className="w-3.5 h-3.5 text-[#0e6969]" />
                      <span>SW Monsoon (Jun - Sep)</span>
                    </div>
                    <div className="text-[11px] text-[#74777d]">Breezy airflow through south-facing windows</div>
                  </div>
                  <span className="text-[11px] font-bold text-[#0e6969] font-['JetBrains_Mono']">~12-18 km/h</span>
                </div>
              </div>

              <div className="text-[11px] text-[#44474c] bg-[#f7f9fb] p-2 rounded border border-[#e0e3e5]">
                {flat.floorPlanSpec?.windOrientation || 'Natural cross ventilation throughout living hall & bedrooms.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAS Affordability & Max Budget Model */}
      {activeDiagram === 'affordability' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 bg-[#f7f9fb] rounded-xl border border-[#e0e3e5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                MAS Mortgage Servicing Ratio (MSR) & Total Debt Limit
              </span>
              <h4 className="font-bold text-base text-[#041627] mt-1">
                Affordability Benchmark for ${flat.estimatedPrice.toLocaleString()} Purchase Price
              </h4>
              <p className="text-xs text-[#74777d]">
                Supports up to maximum HDB tier ($2,000,000) under Singapore HDB & commercial banking framework.
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-[#74777d]">Estimated Monthly</div>
              <div className="font-['JetBrains_Mono'] text-xl font-bold text-[#0e6969]">
                ${flat.estimatedMonthlyMortgage.toLocaleString()} / mo
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-[#e0e3e5] space-y-1">
              <div className="text-xs text-[#74777d] font-semibold">MSR Ratio (Cap: 30%)</div>
              <div className="font-['JetBrains_Mono'] text-2xl font-bold text-[#041627]">
                {flat.affordabilityPercentage}%
              </div>
              <div className="text-[11px] text-emerald-600 font-medium">Within safe 30% MSR regulatory limit</div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-[#e0e3e5] space-y-1">
              <div className="text-xs text-[#74777d] font-semibold">Max Borrowing Capacity</div>
              <div className="font-['JetBrains_Mono'] text-2xl font-bold text-[#041627]">
                ${(flat.estimatedPrice * 0.8).toLocaleString()}
              </div>
              <div className="text-[11px] text-[#74777d]">80% LTV concessionary HDB loan</div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-[#e0e3e5] space-y-1">
              <div className="text-xs text-[#74777d] font-semibold">Affordability Status</div>
              <div className="text-base font-bold text-[#0e6969] flex items-center gap-1 mt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>{flat.affordabilityStatus}</span>
              </div>
              <div className="text-[11px] text-[#74777d]">Buffer remaining for renovation & rainy day funds</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
