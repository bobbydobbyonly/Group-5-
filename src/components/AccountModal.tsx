import React from 'react';
import { FlatItem } from '../types';
import { X, User, Heart, Trash2, ArrowUpRight, Bookmark } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedFlatIds: string[];
  allFlats: FlatItem[];
  onSelectFlat: (flat: FlatItem) => void;
  onRemoveSaved: (id: string) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  savedFlatIds,
  allFlats,
  onSelectFlat,
  onRemoveSaved,
}) => {
  if (!isOpen) return null;

  const savedFlats = allFlats.filter((f) => savedFlatIds.includes(f.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-[#e0e3e5] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#e0e3e5]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#041627] text-white flex items-center justify-center font-bold text-xs">
              BD
            </div>
            <div>
              <h2 className="text-base font-bold text-[#041627]">Buyer Portfolio</h2>
              <p className="text-xs text-[#74777d]">bobbydobbyonly@gmail.com</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#74777d] hover:text-[#041627] p-1.5 rounded-lg hover:bg-[#f2f4f6]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#44474c] flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-[#0e6969]" />
              <span>Saved HDB Watchlist ({savedFlats.length})</span>
            </h3>
          </div>

          {savedFlats.length === 0 ? (
            <div className="py-8 text-center bg-[#f7f9fb] rounded-lg border border-dashed border-[#c4c6cd]">
              <Heart className="w-8 h-8 text-[#c4c6cd] mx-auto mb-2" />
              <p className="text-xs text-[#74777d]">No saved properties yet.</p>
              <p className="text-[11px] text-[#74777d] mt-0.5">Click the heart icon on any flat card to bookmark.</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-64 overflow-y-auto">
              {savedFlats.map((flat) => (
                <div
                  key={flat.id}
                  className="p-3 bg-[#f7f9fb] rounded-lg border border-[#e0e3e5] flex items-center justify-between hover:bg-white transition-colors"
                >
                  <div>
                    <div className="font-semibold text-sm text-[#041627]">
                      {flat.street}, {flat.block}
                    </div>
                    <div className="text-xs text-[#74777d]">
                      {flat.town} • {flat.flatType} • Score {flat.decisionScore}
                    </div>
                    <div className="font-['JetBrains_Mono'] text-xs font-bold text-[#0e6969] mt-0.5">
                      ${flat.estimatedPrice.toLocaleString()} (~${flat.estimatedMonthlyMortgage}/mo)
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        onSelectFlat(flat);
                        onClose();
                      }}
                      className="p-1.5 rounded text-[#041627] hover:bg-[#e0e3e5]"
                      title="View Flat"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemoveSaved(flat.id)}
                      className="p-1.5 rounded text-rose-500 hover:bg-rose-50"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-5 pt-3 border-t border-[#e0e3e5] flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#041627] text-white px-4 py-2 rounded text-xs font-semibold hover:bg-[#1a2b3c]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
