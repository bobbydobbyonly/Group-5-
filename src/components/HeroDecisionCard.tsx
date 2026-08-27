import React, { useState } from 'react';
import { MapPin, CheckCircle2, ChevronRight, Info, ShieldCheck, Heart, Share2 } from 'lucide-react';
import { FlatItem } from '../types';

interface HeroDecisionCardProps {
  flat: FlatItem;
  isSaved?: boolean;
  onToggleSave?: (flatId: string) => void;
  onOpenDetails?: () => void;
}

export const HeroDecisionCard: React.FC<HeroDecisionCardProps> = ({
  flat,
  isSaved = false,
  onToggleSave,
  onOpenDetails,
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="hero-decision-card"
      className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-6 rounded-lg border border-[#e0e3e5] shadow-[0_4px_6px_-1px_rgba(4,22,39,0.05),0_2px_4px_-1px_rgba(4,22,39,0.03)] transition-all"
    >
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h1
            id="flat-title-heading"
            className="font-['Inter'] text-2xl md:text-3xl font-bold text-[#041627] tracking-tight"
          >
            {flat.street}, {flat.block}
          </h1>
          <div className="flex items-center gap-1.5 ml-2">
            {onToggleSave && (
              <button
                onClick={() => onToggleSave(flat.id)}
                title={isSaved ? 'Remove from saved' : 'Save this flat'}
                className={`p-1.5 rounded-full border transition-colors ${
                  isSaved
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'border-[#e0e3e5] text-[#74777d] hover:text-[#041627] hover:bg-[#f2f4f6]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            )}
            <button
              onClick={handleShare}
              title="Share property link"
              className="p-1.5 rounded-full border border-[#e0e3e5] text-[#74777d] hover:text-[#041627] hover:bg-[#f2f4f6] transition-colors relative"
            >
              <Share2 className="w-4 h-4" />
              {copied && (
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#041627] text-white text-[10px] py-0.5 px-1.5 rounded shadow">
                  Copied!
                </span>
              )}
            </button>
          </div>
        </div>

        <p
          id="flat-specs-subtitle"
          className="font-['Inter'] text-base text-[#44474c] flex items-center gap-2 mt-1.5 font-normal"
        >
          <MapPin className="w-4 h-4 text-[#74777d] shrink-0" />
          <span>
            {flat.district} • {flat.flatType} {flat.model} • {flat.floorAreaSqm} sqm ({flat.floorAreaSqft} sqft)
          </span>
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="bg-[#f2f4f6] text-[#44474c] px-2.5 py-1 rounded font-medium">
            Postal {flat.postalCode}
          </span>
          <span className="bg-[#f2f4f6] text-[#44474c] px-2.5 py-1 rounded font-medium">
            Built {flat.builtYear} ({flat.remainingLeaseYears} yrs {flat.remainingLeaseMonths} mos lease)
          </span>
          {onOpenDetails && (
            <button
              onClick={onOpenDetails}
              className="text-[#0e6969] hover:underline font-semibold flex items-center gap-1 ml-1"
            >
              View Full Specs <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Decision Score Badge Box */}
      <div className="mt-5 md:mt-0 flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-[#a4f0ef]/15 p-4 rounded-lg border border-[#88d3d3]/60 w-full md:w-auto">
        <div className="text-center md:pr-2 flex flex-row md:flex-col items-center justify-between md:justify-center gap-2">
          <div className="font-['Inter'] text-4xl md:text-5xl font-bold text-[#0e6969] tracking-tight">
            {flat.decisionScore.toFixed(1)}
            <span className="text-lg text-[#0e6969]/60 font-semibold">/10</span>
          </div>
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="md:hidden text-xs text-[#0e6969] underline font-medium"
          >
            {showBreakdown ? 'Hide factors' : 'View factors'}
          </button>
        </div>

        <div className="border-t md:border-t-0 md:border-l border-[#88d3d3]/50 pt-3 md:pt-0 md:pl-5">
          <div className="text-[12px] uppercase tracking-wider font-semibold text-[#0e6969] mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 fill-[#0e6969] text-white" />
            <span>{flat.decisionMatchStatus}</span>
          </div>
          <p className="text-xs md:text-sm text-[#44474c] max-w-xs leading-relaxed">
            {flat.matchReason}
          </p>

          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="hidden md:flex items-center gap-1 text-[11px] text-[#0e6969] hover:text-[#004f50] font-semibold mt-2 transition-colors cursor-pointer"
          >
            <Info className="w-3 h-3" />
            <span>{showBreakdown ? 'Close Score Breakdown' : 'Explain Decision Weightings'}</span>
          </button>
        </div>
      </div>

      {/* Expanded Score Factors Breakdown */}
      {showBreakdown && (
        <div className="w-full mt-4 pt-4 border-t border-[#e0e3e5] grid grid-cols-2 md:grid-cols-4 gap-3 text-xs animate-in fade-in duration-200">
          <div className="bg-[#f7f9fb] p-2.5 rounded border border-[#e0e3e5]">
            <div className="text-[#74777d] font-medium">Affordability (35%)</div>
            <div className="font-bold text-[#041627] text-sm mt-0.5">9.2 / 10</div>
            <div className="text-[11px] text-[#0e6969]">Est. $1,850/mo (65% of budget)</div>
          </div>
          <div className="bg-[#f7f9fb] p-2.5 rounded border border-[#e0e3e5]">
            <div className="text-[#74777d] font-medium">Transit & Commute (25%)</div>
            <div className="font-bold text-[#041627] text-sm mt-0.5">8.8 / 10</div>
            <div className="text-[11px] text-[#0e6969]">120m to Hub / 4m to MRT</div>
          </div>
          <div className="bg-[#f7f9fb] p-2.5 rounded border border-[#e0e3e5]">
            <div className="text-[#74777d] font-medium">Amenities & Lifestyle (20%)</div>
            <div className="font-bold text-[#041627] text-sm mt-0.5">8.4 / 10</div>
            <div className="text-[11px] text-[#0e6969]">3 Malls + Hub within 600m</div>
          </div>
          <div className="bg-[#f7f9fb] p-2.5 rounded border border-[#e0e3e5]">
            <div className="text-[#74777d] font-medium">Lease Retention (20%)</div>
            <div className="font-bold text-[#041627] text-sm mt-0.5">7.6 / 10</div>
            <div className="text-[11px] text-[#44474c]">{flat.remainingLeaseYears} yrs remaining</div>
          </div>
        </div>
      )}
    </section>
  );
};
