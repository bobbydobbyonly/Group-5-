import React, { useState } from 'react';
import { FloorPlanSpec, RoomDimension } from '../types';
import { Building2, Compass, Wind, Layers, Maximize, Eye, Info, Check } from 'lucide-react';

interface FloorPlanDiagramProps {
  floorPlanSpec?: FloorPlanSpec;
  floorAreaSqm: number;
  floorAreaSqft: number;
  flatType: string;
  model: string;
  onOpenGallery?: () => void;
}

export const FloorPlanDiagram: React.FC<FloorPlanDiagramProps> = ({
  floorPlanSpec,
  floorAreaSqm,
  floorAreaSqft,
  flatType,
  model,
  onOpenGallery,
}) => {
  const [activeRoom, setActiveRoom] = useState<RoomDimension | null>(
    floorPlanSpec?.rooms ? floorPlanSpec.rooms[0] : null
  );
  const [viewMode, setViewMode] = useState<'schematic' | '3d-isometric'>('schematic');

  const defaultRooms: RoomDimension[] = [
    { name: 'Living & Dining Hall', areaSqm: Math.round(floorAreaSqm * 0.35), dimensions: '6.8m x 4.8m', type: 'living', features: ['North-South Cross Ventilation', 'Squarish Layout'] },
    { name: 'Master Bedroom Suite', areaSqm: Math.round(floorAreaSqm * 0.20), dimensions: '4.5m x 3.8m', type: 'master', features: ['Attached Bathroom', 'Walk-in Wardrobe Space'] },
    { name: 'Bedroom 2', areaSqm: Math.round(floorAreaSqm * 0.15), dimensions: '3.6m x 3.5m', type: 'bedroom', features: ['Generous Window Glazing'] },
    { name: 'Enclosed Kitchen & Yard', areaSqm: Math.round(floorAreaSqm * 0.14), dimensions: '4.0m x 2.8m', type: 'kitchen', features: ['Dry/Wet Separation', 'Gas Hob Hookup'] },
    { name: 'Shelter / Store', areaSqm: Math.round(floorAreaSqm * 0.05), dimensions: '2.0m x 2.0m', type: 'shelter', features: ['Reinforced Concrete Safe Area'] },
  ];

  const rooms = floorPlanSpec?.rooms || defaultRooms;
  const currentRoom = activeRoom || rooms[0];

  return (
    <div
      id="architectural-floor-plan-card"
      className="bg-white p-6 rounded-lg border border-[#e0e3e5] shadow-sm transition-all"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#e0e3e5]">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#0e6969]" />
            <h3 className="text-lg font-bold text-[#041627]">
              {floorPlanSpec?.layoutType || `${flatType} ${model} Layout`}
            </h3>
          </div>
          <p className="text-xs text-[#74777d] mt-0.5">
            Total Usable Plate: <strong className="text-[#041627] font-['JetBrains_Mono']">{floorAreaSqm} sqm ({floorAreaSqft} sqft)</strong> • Ceiling: {floorPlanSpec?.ceilingHeightM || 2.6}m
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#f2f4f6] p-1 rounded-md text-xs">
            <button
              onClick={() => setViewMode('schematic')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                viewMode === 'schematic'
                  ? 'bg-white text-[#041627] shadow-xs'
                  : 'text-[#74777d] hover:text-[#041627]'
              }`}
            >
              2D Schematic
            </button>
            <button
              onClick={() => setViewMode('3d-isometric')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                viewMode === '3d-isometric'
                  ? 'bg-white text-[#041627] shadow-xs'
                  : 'text-[#74777d] hover:text-[#041627]'
              }`}
            >
              Spatial Breakdown
            </button>
          </div>

          {onOpenGallery && (
            <button
              onClick={onOpenGallery}
              className="p-1.5 rounded border border-[#e0e3e5] text-[#74777d] hover:text-[#0e6969] hover:bg-[#f2f4f6] transition-colors"
              title="View Real Home Interior Photos"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Orientation & Wind Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 bg-[#f7f9fb] p-2.5 rounded border border-[#e0e3e5] text-xs">
          <Compass className="w-4 h-4 text-[#0e6969] shrink-0" />
          <div>
            <div className="text-[10px] text-[#74777d] uppercase font-semibold">Unit Orientation</div>
            <div className="font-semibold text-[#041627]">
              {floorPlanSpec?.facing || 'North-South Orientation (No West Sun)'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#f7f9fb] p-2.5 rounded border border-[#e0e3e5] text-xs">
          <Wind className="w-4 h-4 text-[#0e6969] shrink-0" />
          <div>
            <div className="text-[10px] text-[#74777d] uppercase font-semibold">Wind & Ventilation</div>
            <div className="font-semibold text-[#041627]">
              {floorPlanSpec?.windOrientation || 'Breezy North-East / South-West Flow'}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Architectural Canvas / Diagram */}
      <div className="bg-[#f7f9fb] border-2 border-dashed border-[#c4c6cd] rounded-xl p-4 sm:p-5 relative">
        <div className="text-[10px] font-bold text-[#74777d] uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Interactive Room Blueprints (Click to inspect)</span>
          <span className="text-[#0e6969]">Active: {currentRoom.name}</span>
        </div>

        {/* Dynamic Architectural Grid Map */}
        <div className="grid grid-cols-12 gap-2 min-h-[220px]">
          {rooms.map((room, idx) => {
            const isSelected = currentRoom.name === room.name;
            // Determine column span dynamically
            let colSpan = 'col-span-12 sm:col-span-4';
            if (room.type === 'living') colSpan = 'col-span-12 sm:col-span-7';
            else if (room.type === 'master') colSpan = 'col-span-6 sm:col-span-5';
            else if (room.type === 'kitchen') colSpan = 'col-span-6 sm:col-span-5';
            else if (room.type === 'shelter' || room.type === 'bath') colSpan = 'col-span-6 sm:col-span-3';

            return (
              <button
                key={idx}
                onClick={() => setActiveRoom(room)}
                className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between group ${colSpan} ${
                  isSelected
                    ? 'bg-[#041627] text-white border-[#041627] shadow-md ring-2 ring-[#0e6969]'
                    : 'bg-white border-[#c4c6cd]/70 text-[#191c1e] hover:border-[#0e6969] hover:bg-[#eefcfc]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-bold text-xs group-hover:text-[#0e6969] transition-colors line-clamp-1">
                    {room.name}
                  </span>
                  <span
                    className={`text-[10px] font-['JetBrains_Mono'] px-1.5 py-0.5 rounded font-semibold ${
                      isSelected ? 'bg-emerald-400/20 text-emerald-300' : 'bg-[#f2f4f6] text-[#0e6969]'
                    }`}
                  >
                    {room.areaSqm} sqm
                  </span>
                </div>

                <div className="my-2">
                  <div
                    className={`text-[11px] font-['JetBrains_Mono'] ${
                      isSelected ? 'text-white/70' : 'text-[#74777d]'
                    }`}
                  >
                    Dim: {room.dimensions}
                  </div>
                  <div
                    className={`text-[10px] mt-1 line-clamp-1 ${
                      isSelected ? 'text-white/80' : 'text-[#44474c]'
                    }`}
                  >
                    {room.features[0]}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[9px] uppercase tracking-wider">
                  <span className={isSelected ? 'text-emerald-400' : 'text-[#0e6969]'}>
                    {room.type}
                  </span>
                  {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Compass Overlay Indicator */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full border border-[#e0e3e5] shadow-xs text-center">
          <div className="text-[9px] font-bold text-rose-600">N</div>
          <div className="w-4 h-4 border-t-2 border-rose-500 mx-auto transform rotate-0"></div>
        </div>
      </div>

      {/* Selected Room Specs Details Card */}
      {currentRoom && (
        <div className="mt-4 p-3.5 bg-[#f7f9fb] border border-[#e0e3e5] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="font-bold text-[#041627] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0e6969]"></span>
              <span>{currentRoom.name} Blueprint Specs</span>
            </div>
            <div className="text-[#44474c] flex flex-wrap gap-2">
              <span>Usable Area: <strong className="font-['JetBrains_Mono'] text-[#041627]">{currentRoom.areaSqm} sqm ({Math.round(currentRoom.areaSqm * 10.764)} sqft)</strong></span>
              <span>•</span>
              <span>Calculated Perimeter: <strong className="font-['JetBrains_Mono'] text-[#041627]">{currentRoom.dimensions}</strong></span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {currentRoom.features.map((feat, i) => (
              <span key={i} className="bg-white px-2 py-0.5 rounded border border-[#e0e3e5] text-[11px] text-[#0e6969] font-medium">
                ✓ {feat}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
