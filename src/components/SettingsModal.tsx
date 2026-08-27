import React from 'react';
import { X, Moon, Sun, Globe, Bell, Shield, Sliders } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  units: 'sqm' | 'sqft';
  setUnits: (units: 'sqm' | 'sqft') => void;
  currency: string;
  setCurrency: (c: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  units,
  setUnits,
  currency,
  setCurrency,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-[#e0e3e5]">
        <div className="flex items-center justify-between pb-4 border-b border-[#e0e3e5]">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#0e6969]" />
            <h2 className="text-lg font-bold text-[#041627]">Application Preferences</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#74777d] hover:text-[#041627] p-1.5 rounded-lg hover:bg-[#f2f4f6]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          {/* Unit selection */}
          <div className="flex items-center justify-between py-2 border-b border-[#f2f4f6]">
            <div>
              <div className="font-semibold text-[#041627]">Floor Area Unit</div>
              <div className="text-[#74777d]">Display unit for HDB dimensions and price psf</div>
            </div>
            <div className="flex bg-[#f2f4f6] p-1 rounded-md">
              <button
                onClick={() => setUnits('sqm')}
                className={`px-3 py-1 rounded text-xs font-semibold ${
                  units === 'sqm' ? 'bg-white text-[#041627] shadow-xs' : 'text-[#74777d]'
                }`}
              >
                sqm
              </button>
              <button
                onClick={() => setUnits('sqft')}
                className={`px-3 py-1 rounded text-xs font-semibold ${
                  units === 'sqft' ? 'bg-white text-[#041627] shadow-xs' : 'text-[#74777d]'
                }`}
              >
                sqft
              </button>
            </div>
          </div>

          {/* Currency */}
          <div className="flex items-center justify-between py-2 border-b border-[#f2f4f6]">
            <div>
              <div className="font-semibold text-[#041627]">Currency Format</div>
              <div className="text-[#74777d]">Singapore Dollar (SGD)</div>
            </div>
            <span className="font-['JetBrains_Mono'] font-bold text-[#0e6969]">SGD ($)</span>
          </div>

          {/* Live Data Sync */}
          <div className="flex items-center justify-between py-2 border-b border-[#f2f4f6]">
            <div>
              <div className="font-semibold text-[#041627]">LTA Bus Timings Auto-Refresh</div>
              <div className="text-[#74777d]">Live simulated transit sync every 15s</div>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              Active
            </span>
          </div>

          {/* Data version */}
          <div className="p-3 bg-[#f7f9fb] rounded text-[11px] text-[#74777d] leading-relaxed">
            Data sourced directly from Data.gov.sg (HDB Resale Prices) and LTA DataMall transit APIs.
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-[#e0e3e5] flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#041627] text-white px-4 py-2 rounded text-xs font-semibold hover:bg-[#1a2b3c]"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
