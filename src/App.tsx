import React, { useState } from 'react';
import { ALL_FLATS, ALL_TOWNS } from './data/hdbData';
import { FlatItem } from './types';
import { Header } from './components/Header';
import { HeroDecisionCard } from './components/HeroDecisionCard';
import { BentoGrid } from './components/BentoGrid';
import { DeepDiveSection } from './components/DeepDiveSection';
import { TownSearchScreen } from './components/TownSearchScreen';
import { FlatDetailsScreen } from './components/FlatDetailsScreen';
import { MortgageModal } from './components/MortgageModal';
import { AmenitiesModal } from './components/AmenitiesModal';
import { SettingsModal } from './components/SettingsModal';
import { AccountModal } from './components/AccountModal';
import { Footer } from './components/Footer';

export default function App() {
  // Navigation tab state: 'home' | 'towns' | 'details'
  const [currentTab, setCurrentTab] = useState<'home' | 'towns' | 'details'>('home');

  // Currently selected flat for the dashboard (defaults to Tampines Blk 211 as in screenshot)
  const [selectedFlat, setSelectedFlat] = useState<FlatItem>(ALL_FLATS[0]);
  const [selectedFlatType, setSelectedFlatType] = useState<string>('4-Room');
  const [selectedBudget, setSelectedBudget] = useState<string>('$600k');

  // Preferences & Modals
  const [isMortgageOpen, setIsMortgageOpen] = useState(false);
  const [isAmenitiesOpen, setIsAmenitiesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [savedFlatIds, setSavedFlatIds] = useState<string[]>(['tampines-blk-211']);
  const [units, setUnits] = useState<'sqm' | 'sqft'>('sqm');
  const [currency, setCurrency] = useState<string>('SGD');

  const handleToggleSave = (id: string) => {
    if (savedFlatIds.includes(id)) {
      setSavedFlatIds(savedFlatIds.filter((item) => item !== id));
    } else {
      setSavedFlatIds([...savedFlatIds, id]);
    }
  };

  const handleSelectFlat = (flat: FlatItem) => {
    setSelectedFlat(flat);
    setSelectedFlatType(flat.flatType);
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] font-['Inter'] min-h-screen flex flex-col antialiased selection:bg-[#0e6969]/20 selection:text-[#041627]">
      {/* Top Header Navigation & Filter Bar */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        selectedFlat={selectedFlat}
        onSelectFlat={handleSelectFlat}
        allFlats={ALL_FLATS}
        allTowns={ALL_TOWNS}
        selectedFlatType={selectedFlatType}
        setSelectedFlatType={setSelectedFlatType}
        selectedBudget={selectedBudget}
        setSelectedBudget={setSelectedBudget}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenMortgage={() => setIsMortgageOpen(true)}
      />

      {/* Main Content Area */}
      <main
        id="main-app-content"
        className="flex-grow pt-[142px] px-4 md:px-12 max-w-[1440px] mx-auto w-full pb-16"
      >
        {currentTab === 'home' && (
          <div className="animate-in fade-in duration-200">
            {/* Hero: Decision Score & Property Header */}
            <HeroDecisionCard
              flat={selectedFlat}
              isSaved={savedFlatIds.includes(selectedFlat.id)}
              onToggleSave={handleToggleSave}
              onOpenDetails={() => setCurrentTab('details')}
            />

            {/* Bento Grid: 3 Core Pillars (Affordability, Location Fit, Connectivity) */}
            <BentoGrid
              flat={selectedFlat}
              onOpenMortgage={() => setIsMortgageOpen(true)}
              onOpenAmenities={() => setIsAmenitiesOpen(true)}
              onOpenTransit={() => setIsAmenitiesOpen(true)}
            />

            {/* Deep Dive Section: Historical Trends & Recent Resale Transactions */}
            <DeepDiveSection flat={selectedFlat} />
          </div>
        )}

        {currentTab === 'towns' && (
          <TownSearchScreen
            towns={ALL_TOWNS}
            allFlats={ALL_FLATS}
            onSelectTownFlat={handleSelectFlat}
            onBackToHome={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'details' && (
          <FlatDetailsScreen
            flat={selectedFlat}
            onOpenMortgage={() => setIsMortgageOpen(true)}
            onBackToHome={() => setCurrentTab('home')}
          />
        )}
      </main>

      {/* Modals & Dialogs */}
      <MortgageModal
        isOpen={isMortgageOpen}
        onClose={() => setIsMortgageOpen(false)}
        flat={selectedFlat}
      />

      <AmenitiesModal
        isOpen={isAmenitiesOpen}
        onClose={() => setIsAmenitiesOpen(false)}
        flat={selectedFlat}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        units={units}
        setUnits={setUnits}
        currency={currency}
        setCurrency={setCurrency}
      />

      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        savedFlatIds={savedFlatIds}
        allFlats={ALL_FLATS}
        onSelectFlat={handleSelectFlat}
        onRemoveSaved={handleToggleSave}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
