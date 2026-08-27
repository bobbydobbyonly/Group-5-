import React, { useState } from 'react';
import { Search, Settings, User, SlidersHorizontal, MapPin, Building, DollarSign } from 'lucide-react';
import { FlatItem, TownData } from '../types';

interface HeaderProps {
  currentTab: 'home' | 'towns' | 'details';
  setCurrentTab: (tab: 'home' | 'towns' | 'details') => void;
  selectedFlat: FlatItem;
  onSelectFlat: (flat: FlatItem) => void;
  allFlats: FlatItem[];
  allTowns: TownData[];
  selectedFlatType: string;
  setSelectedFlatType: (type: any) => void;
  selectedBudget: string;
  setSelectedBudget: (budget: string) => void;
  onOpenSettings: () => void;
  onOpenAccount: () => void;
  onOpenMortgage: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  selectedFlat,
  onSelectFlat,
  allFlats,
  allTowns,
  selectedFlatType,
  setSelectedFlatType,
  selectedBudget,
  setSelectedBudget,
  onOpenSettings,
  onOpenAccount,
  onOpenMortgage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Filter flats and towns based on search query
  const filteredFlats = allFlats.filter(
    (f) =>
      f.town.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.street.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.postalCode.includes(searchQuery) ||
      f.block.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTowns = allTowns.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectSearchResult = (flat: FlatItem) => {
    onSelectFlat(flat);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const handleTownClick = (townName: string) => {
    const matchedFlat = allFlats.find((f) => f.town.toLowerCase() === townName.toLowerCase()) || allFlats[0];
    onSelectFlat(matchedFlat);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  return (
    <>
      {/* TopNavBar */}
      <header
        id="top-nav-bar"
        className="bg-[#f7f9fb] shadow-sm border-b border-[#c4c6cd]/40 fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-12 h-16 transition-all duration-200 ease-in-out backdrop-blur-md"
      >
        <div className="flex items-center gap-6 md:gap-8">
          <button
            onClick={() => setCurrentTab('home')}
            className="font-['Inter'] text-[20px] leading-[28px] font-bold text-[#041627] tracking-tight hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-[#041627] flex items-center justify-center text-white font-bold text-base shadow-sm">
              H
            </div>
            <span>HDB Decide</span>
          </button>
          <nav className="hidden md:flex gap-6 ml-4">
            <button
              id="nav-home-btn"
              onClick={() => setCurrentTab('home')}
              className={`font-semibold pb-1 transition-colors relative text-sm ${
                currentTab === 'home'
                  ? 'text-[#176d6e] font-bold border-b-2 border-[#176d6e]'
                  : 'text-[#44474c] hover:text-[#041627] hover:bg-[#f2f4f6] px-2 py-1 rounded'
              }`}
            >
              Home
            </button>
            <button
              id="nav-towns-btn"
              onClick={() => setCurrentTab('towns')}
              className={`font-semibold pb-1 transition-colors relative text-sm ${
                currentTab === 'towns'
                  ? 'text-[#176d6e] font-bold border-b-2 border-[#176d6e]'
                  : 'text-[#44474c] hover:text-[#041627] hover:bg-[#f2f4f6] px-2 py-1 rounded'
              }`}
            >
              Town Search
            </button>
            <button
              id="nav-details-btn"
              onClick={() => setCurrentTab('details')}
              className={`font-semibold pb-1 transition-colors relative text-sm ${
                currentTab === 'details'
                  ? 'text-[#176d6e] font-bold border-b-2 border-[#176d6e]'
                  : 'text-[#44474c] hover:text-[#041627] hover:bg-[#f2f4f6] px-2 py-1 rounded'
              }`}
            >
              Flat Details
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            id="open-mortgage-calc-btn"
            onClick={onOpenMortgage}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#e6e8ea] text-[#041627] hover:bg-[#d8dadc] transition-colors"
          >
            <DollarSign className="w-3.5 h-3.5 text-[#0e6969]" />
            Mortgage Calc
          </button>
          <button
            id="settings-btn"
            aria-label="Settings"
            onClick={onOpenSettings}
            className="text-[#44474c] hover:text-[#041627] p-2 rounded-full hover:bg-[#f2f4f6] transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            id="account-btn"
            aria-label="Account"
            onClick={onOpenAccount}
            className="text-[#44474c] hover:text-[#041627] p-2 rounded-full hover:bg-[#f2f4f6] transition-colors"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Sticky Filter Bar (below main nav) */}
      <div
        id="sticky-filter-bar"
        className="fixed top-16 left-0 w-full bg-white border-b border-[#c4c6cd]/50 z-40 shadow-sm py-3.5 px-4 md:px-12 flex flex-wrap md:flex-nowrap items-center gap-4"
      >
        <div className="relative flex-grow max-w-md w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777d] w-4 h-4" />
          <input
            id="search-input-field"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search Town or Postal Code (e.g. 520211, Tampines)"
            className="w-full pl-9 pr-4 py-2 border border-[#e0e3e5] rounded-md focus:border-[#0e6969] focus:ring-1 focus:ring-[#0e6969] text-sm bg-[#f7f9fb] outline-none transition-colors"
          />

          {/* Autocomplete Dropdown */}
          {isSearchOpen && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-[#e0e3e5] rounded-lg shadow-xl z-50 max-h-72 overflow-y-auto p-2">
              <div className="text-[11px] font-bold text-[#74777d] uppercase tracking-wider px-2 py-1">
                Matching HDB Units
              </div>
              {filteredFlats.length > 0 ? (
                filteredFlats.map((flat) => (
                  <button
                    key={flat.id}
                    onClick={() => handleSelectSearchResult(flat)}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-[#f2f4f6] flex items-center justify-between text-sm transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-[#041627]">
                        {flat.street}, {flat.block}
                      </div>
                      <div className="text-xs text-[#74777d]">
                        {flat.town} • {flat.postalCode} • {flat.flatType} ({flat.floorAreaSqm} sqm)
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#0e6969] bg-[#a4f0ef]/20 px-2 py-0.5 rounded">
                      Score {flat.decisionScore}
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-xs text-[#74777d]">No direct block matches.</div>
              )}

              <div className="text-[11px] font-bold text-[#74777d] uppercase tracking-wider px-2 py-1 mt-2 border-t border-[#f2f4f6]">
                Popular Estates
              </div>
              <div className="grid grid-cols-2 gap-1 p-1">
                {filteredTowns.map((town) => (
                  <button
                    key={town.id}
                    onClick={() => handleTownClick(town.name)}
                    className="text-left px-2 py-1.5 rounded hover:bg-[#f2f4f6] text-xs font-medium text-[#191c1e] flex items-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#0e6969]" />
                    {town.name} ({town.region})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-2">
            <label
              htmlFor="flat-type"
              className="text-[12px] font-semibold tracking-wider uppercase text-[#44474c] whitespace-nowrap"
            >
              Flat Type
            </label>
            <select
              id="flat-type"
              value={selectedFlatType}
              onChange={(e) => setSelectedFlatType(e.target.value)}
              className="border border-[#e0e3e5] rounded-md py-1.5 px-3 text-sm bg-[#f7f9fb] outline-none focus:border-[#0e6969] focus:ring-1 focus:ring-[#0e6969] text-[#191c1e] font-medium"
            >
              <option>4-Room</option>
              <option>3-Room</option>
              <option>5-Room</option>
              <option>Executive</option>
              <option>2-Room</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="budget"
              className="text-[12px] font-semibold tracking-wider uppercase text-[#44474c] whitespace-nowrap"
            >
              Max Budget
            </label>
            <select
              id="budget"
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="border border-[#e0e3e5] rounded-md py-1.5 px-3 text-sm bg-[#f7f9fb] outline-none focus:border-[#0e6969] focus:ring-1 focus:ring-[#0e6969] text-[#191c1e] font-medium"
            >
              <option>$600k</option>
              <option>$500k</option>
              <option>$700k</option>
              <option>$800k+</option>
              <option>$400k</option>
            </select>
          </div>

          <button
            id="filter-update-btn"
            onClick={() => {
              // trigger a refresh or toast
              const match = allFlats.find((f) => f.flatType === selectedFlatType) || allFlats[0];
              onSelectFlat(match);
            }}
            className="bg-[#041627] text-white px-4 py-1.5 rounded-md text-[12px] uppercase tracking-wider font-semibold whitespace-nowrap hover:bg-[#1a2b3c] active:scale-95 transition-all ml-auto md:ml-0 shadow-sm"
          >
            Update
          </button>
        </div>
      </div>
    </>
  );
};
