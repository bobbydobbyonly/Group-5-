import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Map,
  Bus,
  CheckCircle2,
  TreePine,
  ShoppingBag,
  Volume2,
  ChevronRight,
  Calculator,
  Train,
  ArrowUpRight,
  ExternalLink,
  Radio
} from 'lucide-react';
import { FlatItem } from '../types';

interface BentoGridProps {
  flat: FlatItem;
  onOpenMortgage: () => void;
  onOpenAmenities: () => void;
  onOpenTransit: () => void;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  flat,
  onOpenMortgage,
  onOpenAmenities,
  onOpenTransit,
}) => {
  // Live bus timer simulation
  const [buses, setBuses] = useState(flat.nearestStop.buses);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setBuses(flat.nearestStop.buses);
  }, [flat]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 800);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="bento-pillars-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* 1. Affordability Summary */}
      <div
        id="affordability-card"
        className="bg-white p-6 rounded-lg border border-[#e0e3e5] shadow-[0_4px_6px_-1px_rgba(4,22,39,0.05),0_2px_4px_-1px_rgba(4,22,39,0.03)] flex flex-col h-full hover:border-[#0e6969]/40 transition-all cursor-pointer group"
        onClick={onOpenMortgage}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[12px] uppercase tracking-wider font-semibold text-[#44474c]">
            Affordability
          </h2>
          <CreditCard className="w-5 h-5 text-[#db7618]" />
        </div>

        <div className="mb-6 flex-grow">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-sm text-[#44474c]">Est. Monthly</span>
            <span className="font-['JetBrains_Mono'] text-2xl font-bold text-[#041627]">
              ${flat.estimatedMonthlyMortgage.toLocaleString()}
            </span>
          </div>

          <div className="w-full bg-[#e6e8ea] rounded-full h-2 mb-2 overflow-hidden">
            <div
              className="bg-[#0e6969] h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, flat.affordabilityPercentage)}%` }}
            ></div>
          </div>

          <div className="flex justify-between font-['JetBrains_Mono'] text-xs text-[#74777d]">
            <span>$0</span>
            <span>Budget: ${flat.maxBudget.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="inline-flex items-center gap-1.5 bg-[#0e6969]/10 text-[#0e6969] px-3 py-1.5 rounded-full text-[12px] uppercase tracking-wider font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>{flat.affordabilityStatus}</span>
          </div>
          <span className="text-xs text-[#0e6969] font-medium flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            Adjust Loan <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* 2. Location Fit */}
      <div
        id="location-fit-card"
        className="bg-white p-6 rounded-lg border border-[#e0e3e5] shadow-[0_4px_6px_-1px_rgba(4,22,39,0.05),0_2px_4px_-1px_rgba(4,22,39,0.03)] flex flex-col h-full relative overflow-hidden group cursor-pointer hover:border-[#0e6969]/40 transition-all"
        onClick={onOpenAmenities}
      >
        <div className="flex items-center justify-between mb-4 relative z-10">
          <h2 className="text-[12px] uppercase tracking-wider font-semibold text-[#44474c]">
            Location Fit
          </h2>
          <Map className="w-5 h-5 text-[#db7618]" />
        </div>

        {/* Realistic background Map */}
        <div
          className="absolute inset-0 top-12 bottom-0 z-0 opacity-20 bg-cover bg-center group-hover:opacity-30 transition-opacity"
          style={{
            backgroundImage: `url('${flat.mapImageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMixgQ5expQzf1ZykvHjhJXwZT5fL_L35Zcq1r3QjrgR8AbGoT1FuX-NMilJpLc6YCLPde88hP-bRFcr_M5rPPm9edufV25zzrQxn7OPSbcvqXzfIWnGcNfDv2bU6ZdiS4Ab6CGPOvJeWHsKWJN8KTe9B1c2Vpxd4AkJ5hP7G0K8x3HO2Qvonas7K38d4Jjxqs0S46jRy0t79ff9nrglBZUjm-eOeFzpHgmrZpm0I5ameuXTv2fUEzLQ'}')`,
          }}
        ></div>

        <div className="relative z-10 flex-grow flex flex-col justify-end mt-16">
          <ul className="space-y-2">
            <li className="flex items-center justify-between font-['Inter'] text-sm text-[#191c1e] bg-white/90 px-2.5 py-1.5 rounded backdrop-blur-sm border border-[#e0e3e5]/60 shadow-xs">
              <div className="flex items-center gap-2">
                <TreePine className="w-4 h-4 text-[#0e6969]" />
                <span className="font-medium">{flat.isMature ? 'Mature Estate' : 'Non-Mature Growth Corridor'}</span>
              </div>
              <span className="text-[11px] text-[#74777d]">Established</span>
            </li>
            <li className="flex items-center justify-between font-['Inter'] text-sm text-[#191c1e] bg-white/90 px-2.5 py-1.5 rounded backdrop-blur-sm border border-[#e0e3e5]/60 shadow-xs">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#0e6969]" />
                <span className="font-medium">{flat.proximityToMallText}</span>
              </div>
              <span className="text-[11px] text-[#0e6969] font-medium">350m</span>
            </li>
            <li className="flex items-center justify-between font-['Inter'] text-sm text-[#191c1e] bg-white/90 px-2.5 py-1.5 rounded backdrop-blur-sm border border-[#e0e3e5]/60 shadow-xs">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#ba1a1a]" />
                <span className="font-medium">{flat.trafficNodeStatus}</span>
              </div>
              <span className="text-[11px] text-[#ba1a1a]">Transit Node</span>
            </li>
          </ul>

          <div className="mt-3 flex items-center justify-between text-xs text-[#0e6969] font-semibold">
            <span>Explore 8 Neighborhood Amenities</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* 3. Connectivity */}
      <div
        id="connectivity-card"
        className="bg-white p-6 rounded-lg border border-[#e0e3e5] shadow-[0_4px_6px_-1px_rgba(4,22,39,0.05),0_2px_4px_-1px_rgba(4,22,39,0.03)] flex flex-col h-full hover:border-[#0e6969]/40 transition-all"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[12px] uppercase tracking-wider font-semibold text-[#44474c]">
            Connectivity
          </h2>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0e6969] opacity-75 ${pulse ? 'duration-500' : ''}`}></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0e6969]"></span>
            </span>
            <Bus className="w-5 h-5 text-[#db7618]" />
          </div>
        </div>

        <div className="mb-3">
          <p className="text-xs text-[#44474c] mb-0.5">Nearest Stop</p>
          <p className="text-base font-semibold text-[#041627] flex items-center justify-between">
            <span>{flat.nearestStop.name} ({flat.nearestStop.code})</span>
            <span className="text-[#74777d] text-xs font-normal font-['JetBrains_Mono']">
              {flat.nearestStop.distance}
            </span>
          </p>
        </div>

        <div className="space-y-2.5 flex-grow">
          {buses.slice(0, 3).map((bus, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-[#f7f9fb] px-2.5 py-1.5 rounded border border-[#e0e3e5]/60 hover:bg-[#f2f4f6] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="bg-[#041627] text-white px-2 py-0.5 rounded font-['JetBrains_Mono'] text-xs font-semibold">
                  {bus.number}
                </span>
                <span className="text-xs font-medium text-[#191c1e]">{bus.destination}</span>
              </div>
              <span
                className={`font-['JetBrains_Mono'] text-xs font-semibold ${
                  bus.arrivalMins <= 5 ? 'text-[#0e6969]' : 'text-[#44474c]'
                }`}
              >
                {bus.arrivalMins} mins
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#e0e3e5] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[#041627] font-medium">
            <Train className="w-3.5 h-3.5 text-[#0e6969]" />
            <span>{flat.mrtStation.name}</span>
          </div>
          <span className="text-[#74777d] font-['JetBrains_Mono']">
            {flat.mrtStation.distance} ({flat.mrtStation.walkMins} mins)
          </span>
        </div>
      </div>
    </section>
  );
};
