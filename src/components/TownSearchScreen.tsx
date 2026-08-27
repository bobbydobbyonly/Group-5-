import React, { useState } from 'react';
import { TownData, FlatItem } from '../types';
import {
  MapPin,
  TrendingUp,
  Train,
  Building,
  DollarSign,
  ArrowRight,
  Sparkles,
  Layers,
  Scale,
  Check
} from 'lucide-react';

interface TownSearchScreenProps {
  towns: TownData[];
  allFlats: FlatItem[];
  onSelectTownFlat: (flat: FlatItem) => void;
  onBackToHome: () => void;
}

export const TownSearchScreen: React.FC<TownSearchScreenProps> = ({
  towns,
  allFlats,
  onSelectTownFlat,
  onBackToHome,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [compareTownIds, setCompareTownIds] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const regions = ['All', 'Central', 'East', 'North-East', 'North', 'West'];

  const filteredTowns = towns.filter((town) => {
    const matchesRegion = selectedRegion === 'All' || town.region === selectedRegion;
    const matchesSearch =
      town.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      town.highlights.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRegion && matchesSearch;
  });

  const toggleCompare = (townId: string) => {
    if (compareTownIds.includes(townId)) {
      setCompareTownIds(compareTownIds.filter((id) => id !== townId));
    } else {
      if (compareTownIds.length >= 2) {
        setCompareTownIds([compareTownIds[1], townId]);
      } else {
        setCompareTownIds([...compareTownIds, townId]);
      }
    }
  };

  const handleSelectTown = (townName: string) => {
    const matchedFlat =
      allFlats.find((f) => f.town.toLowerCase() === townName.toLowerCase()) || allFlats[0];
    onSelectTownFlat(matchedFlat);
    onBackToHome();
  };

  const comparedTownObjects = towns.filter((t) => compareTownIds.includes(t.id));

  return (
    <div id="town-search-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-lg border border-[#e0e3e5] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#041627] font-['Inter']">
            Singapore HDB Towns & Estates
          </h1>
          <p className="text-sm text-[#44474c] mt-1">
            Compare median resale prices, capital appreciation, amenities, and commute times across Singapore.
          </p>
        </div>

        {compareTownIds.length > 0 && (
          <button
            onClick={() => setShowComparison(true)}
            className="bg-[#0e6969] text-white px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-[#004f50] transition-colors shadow-sm"
          >
            <Scale className="w-4 h-4" />
            <span>Compare ({compareTownIds.length}/2 selected)</span>
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-lg border border-[#e0e3e5]">
        {/* Region Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#74777d] uppercase mr-1">Region:</span>
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                selectedRegion === region
                  ? 'bg-[#041627] text-white font-semibold'
                  : 'bg-[#f2f4f6] text-[#44474c] hover:bg-[#e0e3e5]'
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search town or landmark..."
          className="px-3 py-1.5 border border-[#e0e3e5] rounded text-xs bg-[#f7f9fb] outline-none focus:border-[#0e6969] w-full sm:w-64"
        />
      </div>

      {/* Town Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTowns.map((town) => {
          const isCompared = compareTownIds.includes(town.id);
          return (
            <div
              key={town.id}
              className={`bg-white rounded-lg border transition-all hover:shadow-md flex flex-col justify-between ${
                isCompared ? 'border-[#0e6969] ring-2 ring-[#0e6969]/20' : 'border-[#e0e3e5]'
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-[#041627]">{town.name}</h3>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          town.isMature
                            ? 'bg-[#0e6969]/10 text-[#0e6969]'
                            : 'bg-[#db7618]/10 text-[#db7618]'
                        }`}
                      >
                        {town.isMature ? 'Mature' : 'Non-Mature'}
                      </span>
                    </div>
                    <span className="text-xs text-[#74777d]">{town.region} Region</span>
                  </div>

                  <button
                    onClick={() => toggleCompare(town.id)}
                    className={`text-xs px-2 py-1 rounded border flex items-center gap-1 transition-colors ${
                      isCompared
                        ? 'bg-[#0e6969] text-white border-[#0e6969]'
                        : 'border-[#e0e3e5] text-[#74777d] hover:bg-[#f2f4f6]'
                    }`}
                  >
                    {isCompared ? <Check className="w-3 h-3" /> : <Scale className="w-3 h-3" />}
                    <span>{isCompared ? 'Compared' : 'Compare'}</span>
                  </button>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3 my-4 p-3 bg-[#f7f9fb] rounded border border-[#e0e3e5]/60">
                  <div>
                    <div className="text-[11px] text-[#74777d]">Median 4-Room</div>
                    <div className="font-['JetBrains_Mono'] text-base font-bold text-[#041627]">
                      ${town.medianPrice4Room.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#74777d]">Average PSF</div>
                    <div className="font-['JetBrains_Mono'] text-base font-bold text-[#0e6969]">
                      ${town.avgPsf} psf
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#74777d]">Transit to CBD</div>
                    <div className="font-['JetBrains_Mono'] text-xs font-semibold text-[#44474c] flex items-center gap-1 mt-0.5">
                      <Train className="w-3.5 h-3.5 text-[#0e6969]" />
                      {town.transitToCbdMins} mins ({town.distanceToCbdKm} km)
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#74777d]">5-Yr Appreciation</div>
                    <div className="font-['JetBrains_Mono'] text-xs font-bold text-[#0e6969] flex items-center gap-1 mt-0.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      +{town.growth5YrPercent}%
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-1.5 text-xs text-[#44474c]">
                  {town.highlights.slice(0, 2).map((h, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0e6969]"></span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 bg-[#f7f9fb] border-t border-[#e0e3e5] flex items-center justify-between">
                <span className="text-[11px] text-[#74777d]">
                  {town.totalFlats.toLocaleString()} total units
                </span>
                <button
                  onClick={() => handleSelectTown(town.name)}
                  className="bg-[#041627] text-white px-3.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1 hover:bg-[#1a2b3c] transition-colors"
                >
                  <span>Analyze {town.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Modal */}
      {showComparison && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-[#e0e3e5] animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#e0e3e5]">
              <h2 className="text-xl font-bold text-[#041627] flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#0e6969]" />
                <span>Side-by-Side Town Comparison</span>
              </h2>
              <button
                onClick={() => setShowComparison(false)}
                className="text-[#74777d] hover:text-[#041627] p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {comparedTownObjects.length < 2 ? (
              <div className="py-8 text-center text-[#74777d]">
                Please select at least 2 towns using the "Compare" buttons to view head-to-head metrics.
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center pb-2 border-b border-[#e0e3e5] font-semibold text-sm">
                  <div className="text-left text-[#74777d]">Metric</div>
                  <div className="text-[#041627]">{comparedTownObjects[0].name}</div>
                  <div className="text-[#041627]">{comparedTownObjects[1].name}</div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs py-1.5 border-b border-[#f2f4f6]">
                  <span className="text-[#74777d]">Classification</span>
                  <span className="font-semibold">{comparedTownObjects[0].isMature ? 'Mature' : 'Non-Mature'}</span>
                  <span className="font-semibold">{comparedTownObjects[1].isMature ? 'Mature' : 'Non-Mature'}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs py-1.5 border-b border-[#f2f4f6]">
                  <span className="text-[#74777d]">Median 4-Room Price</span>
                  <span className="font-['JetBrains_Mono'] font-bold text-[#041627]">
                    ${comparedTownObjects[0].medianPrice4Room.toLocaleString()}
                  </span>
                  <span className="font-['JetBrains_Mono'] font-bold text-[#041627]">
                    ${comparedTownObjects[1].medianPrice4Room.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs py-1.5 border-b border-[#f2f4f6]">
                  <span className="text-[#74777d]">Average PSF</span>
                  <span className="font-['JetBrains_Mono'] font-bold text-[#0e6969]">
                    ${comparedTownObjects[0].avgPsf} psf
                  </span>
                  <span className="font-['JetBrains_Mono'] font-bold text-[#0e6969]">
                    ${comparedTownObjects[1].avgPsf} psf
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs py-1.5 border-b border-[#f2f4f6]">
                  <span className="text-[#74777d]">CBD Transit Time</span>
                  <span className="font-semibold">{comparedTownObjects[0].transitToCbdMins} mins</span>
                  <span className="font-semibold">{comparedTownObjects[1].transitToCbdMins} mins</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs py-1.5 border-b border-[#f2f4f6]">
                  <span className="text-[#74777d]">5-Year Growth Rate</span>
                  <span className="font-bold text-[#0e6969]">+{comparedTownObjects[0].growth5YrPercent}%</span>
                  <span className="font-bold text-[#0e6969]">+{comparedTownObjects[1].growth5YrPercent}%</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs py-2 pt-4">
                  <div></div>
                  <button
                    onClick={() => {
                      handleSelectTown(comparedTownObjects[0].name);
                      setShowComparison(false);
                    }}
                    className="bg-[#041627] text-white py-1.5 rounded font-semibold text-xs"
                  >
                    Select {comparedTownObjects[0].name}
                  </button>
                  <button
                    onClick={() => {
                      handleSelectTown(comparedTownObjects[1].name);
                      setShowComparison(false);
                    }}
                    className="bg-[#041627] text-white py-1.5 rounded font-semibold text-xs"
                  >
                    Select {comparedTownObjects[1].name}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
