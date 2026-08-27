import React, { useState } from 'react';
import { ALL_FLATS, ALL_TOWNS } from './data/hdbData';
import { FlatItem } from './types';
import { Header } from './components/Header';
import { HeroDecisionCard } from './components/HeroDecisionCard';
import { BentoGrid } from './components/BentoGrid';
import { DeepDiveSection } from './components/DeepDiveSection';
import { TownSearchScreen } from './components/TownSearchScreen';
import { FlatDetailsScreen } from './components/FlatDetailsScreen';
import { AllFlatTypesOverview } from './components/AllFlatTypesOverview';
import { PhotoGalleryModal } from './components/PhotoGalleryModal';
import { DisqusComments } from './components/DisqusComments';
import { MortgageModal } from './components/MortgageModal';
import { AmenitiesModal } from './components/AmenitiesModal';
import { SettingsModal } from './components/SettingsModal';
import { AccountModal } from './components/AccountModal';
import { Footer } from './components/Footer';

export default function App() {
  // Navigation tab state: 'home' | 'towns' | 'details'
  const [currentTab, setCurrentTab] = useState<'home' | 'towns' | 'details'>('home');

  // Currently selected flat for the dashboard (defaults to Tampines Blk 211)
  const [selectedFlat, setSelectedFlat] = useState<FlatItem>(ALL_FLATS[0]);
  const [selectedFlatType, setSelectedFlatType] = useState<string>('All Types');
  const [selectedBudget, setSelectedBudget] = useState<string>('All Budgets');

  // Preferences & Modals
  const [isMortgageOpen, setIsMortgageOpen] = useState(false);
  const [isAmenitiesOpen, setIsAmenitiesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isPhotoGalleryOpen, setIsPhotoGalleryOpen] = useState(false);
  const [activeGalleryFlat, setActiveGalleryFlat] = useState<FlatItem>(ALL_FLATS[0]);
  const [initialGalleryIndex, setInitialGalleryIndex] = useState<number>(0);

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

  const handleOpenPhotoGallery = (flat: FlatItem, initialIdx: number = 0) => {
    setActiveGalleryFlat(flat);
    setInitialGalleryIndex(initialIdx);
    setIsPhotoGalleryOpen(true);
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
            {/* Hero: Decision Score, Property Header & Visual Photo Bar */}
            <HeroDecisionCard
              flat={selectedFlat}
              isSaved={savedFlatIds.includes(selectedFlat.id)}
              onToggleSave={handleToggleSave}
              onOpenDetails={() => setCurrentTab('details')}
              onOpenPhotoGallery={handleOpenPhotoGallery}
            />

            {/* Explore All Flat Types in Singapore (Requested Feature) */}
            <AllFlatTypesOverview
              allFlats={ALL_FLATS}
              selectedFlatId={selectedFlat.id}
              onSelectFlat={handleSelectFlat}
              onOpenPhotoGallery={handleOpenPhotoGallery}
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
            onOpenPhotoGallery={handleOpenPhotoGallery}
          />
        )}

        {/* Disqus Community Discussion Thread */}
        <DisqusComments
          identifier={`hdb-${selectedFlat.id}`}
          title={`${selectedFlat.street}, ${selectedFlat.block} (${selectedFlat.town}) - HDB Decision Analysis`}
        />
      </main>

      {/* Fullscreen Photo Gallery Lightbox */}
      <PhotoGalleryModal
        isOpen={isPhotoGalleryOpen}
        onClose={() => setIsPhotoGalleryOpen(false)}
        images={activeGalleryFlat.images || []}
        flatTitle={`${activeGalleryFlat.street}, ${activeGalleryFlat.block} (${activeGalleryFlat.town})`}
        initialIndex={initialGalleryIndex}
      />

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
