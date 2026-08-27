import React, { useState } from 'react';
import { FlatItem, PriceTrendPoint, Transaction } from '../types';
import { TrendingUp, ArrowUpRight, Filter, Download, Info, Calendar, DollarSign, Layers } from 'lucide-react';

interface DeepDiveSectionProps {
  flat: FlatItem;
}

export const DeepDiveSection: React.FC<DeepDiveSectionProps> = ({ flat }) => {
  const [activeTab, setActiveTab] = useState<'trends' | 'transactions'>('trends');
  const [timeframe, setTimeframe] = useState<'1Y' | '5Y' | 'All'>('5Y');
  const [hoveredPoint, setHoveredPoint] = useState<PriceTrendPoint | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [txSearch, setTxSearch] = useState('');

  const trendData: PriceTrendPoint[] = flat.historicalTrends[timeframe] || flat.historicalTrends['5Y'];

  // Calculate min and max for chart scaling
  const psfValues = trendData.map((d) => d.psf);
  const minPsf = Math.floor(Math.min(...psfValues) / 50) * 50 - 20;
  const maxPsf = Math.ceil(Math.max(...psfValues) / 50) * 50 + 30;
  const psfRange = maxPsf - minPsf || 1;

  // Generate smooth SVG path
  const points = trendData.map((d, index) => {
    const x = (index / (trendData.length - 1)) * 100;
    const y = 100 - ((d.psf - minPsf) / psfRange) * 100;
    return { x, y, data: d };
  });

  const pathString = points.reduce((acc, point, index, array) => {
    if (index === 0) return `M ${point.x},${point.y}`;
    const prev = array[index - 1];
    const cx = (prev.x + point.x) / 2;
    return `${acc} C ${cx},${prev.y} ${cx},${point.y} ${point.x},${point.y}`;
  }, '');

  // Closed area path for gradient
  const areaString = `${pathString} L 100,100 L 0,100 Z`;

  // Filtered transactions
  const filteredTransactions = flat.recentTransactions.filter(
    (tx) =>
      tx.block.toLowerCase().includes(txSearch.toLowerCase()) ||
      tx.street.toLowerCase().includes(txSearch.toLowerCase()) ||
      tx.storey.toLowerCase().includes(txSearch.toLowerCase()) ||
      tx.month.toLowerCase().includes(txSearch.toLowerCase())
  );

  const startPsf = trendData[0]?.psf || 400;
  const endPsf = trendData[trendData.length - 1]?.psf || 540;
  const pctGrowth = (((endPsf - startPsf) / startPsf) * 100).toFixed(1);

  return (
    <section
      id="deep-dive-section"
      className="bg-white border border-[#e0e3e5] rounded-lg shadow-[0_4px_6px_-1px_rgba(4,22,39,0.05),0_2px_4px_-1px_rgba(4,22,39,0.03)] overflow-hidden mb-8"
    >
      {/* Tabs Header */}
      <div className="flex border-b border-[#e0e3e5] bg-[#f7f9fb]">
        <button
          id="tab-historical-trends"
          onClick={() => setActiveTab('trends')}
          className={`px-6 py-4 text-[12px] uppercase tracking-wider font-semibold focus:outline-none transition-colors border-b-2 ${
            activeTab === 'trends'
              ? 'text-[#041627] border-[#041627] bg-white font-bold'
              : 'text-[#44474c] hover:text-[#041627] hover:bg-white/50 border-transparent'
          }`}
        >
          Historical Trends
        </button>
        <button
          id="tab-recent-transactions"
          onClick={() => setActiveTab('transactions')}
          className={`px-6 py-4 text-[12px] uppercase tracking-wider font-semibold focus:outline-none transition-colors border-b-2 ${
            activeTab === 'transactions'
              ? 'text-[#041627] border-[#041627] bg-white font-bold'
              : 'text-[#44474c] hover:text-[#041627] hover:bg-white/50 border-transparent'
          }`}
        >
          Recent Transactions
        </button>
      </div>

      {/* Tab 1 Content: Historical Trends */}
      {activeTab === 'trends' && (
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-[#041627] font-['Inter']">
                Price psf Evolution
              </h3>
              <p className="text-xs sm:text-sm text-[#44474c] mt-0.5">
                {flat.flatType} flats in {flat.town} (2018 - Present)
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => setTimeframe('1Y')}
                className={`px-3 py-1 text-xs sm:text-sm rounded border transition-colors ${
                  timeframe === '1Y'
                    ? 'border-[#0e6969] text-[#0e6969] bg-[#a4f0ef]/20 font-semibold'
                    : 'border-[#e0e3e5] bg-[#f7f9fb] text-[#44474c] hover:bg-[#e0e3e5]'
                }`}
              >
                1Y
              </button>
              <button
                onClick={() => setTimeframe('5Y')}
                className={`px-3 py-1 text-xs sm:text-sm rounded border transition-colors ${
                  timeframe === '5Y'
                    ? 'border-[#0e6969] text-[#0e6969] bg-[#a4f0ef]/20 font-semibold'
                    : 'border-[#e0e3e5] bg-[#f7f9fb] text-[#44474c] hover:bg-[#e0e3e5]'
                }`}
              >
                5Y
              </button>
              <button
                onClick={() => setTimeframe('All')}
                className={`px-3 py-1 text-xs sm:text-sm rounded border transition-colors ${
                  timeframe === 'All'
                    ? 'border-[#0e6969] text-[#0e6969] bg-[#a4f0ef]/20 font-semibold'
                    : 'border-[#e0e3e5] bg-[#f7f9fb] text-[#44474c] hover:bg-[#e0e3e5]'
                }`}
              >
                All
              </button>
            </div>
          </div>

          {/* Interactive Chart Container */}
          <div
            id="psf-chart-container"
            className="h-64 sm:h-72 w-full border border-[#e0e3e5] rounded-lg bg-[#f7f9fb] relative flex items-end px-4 pb-8 pt-4 select-none"
          >
            {/* Y Axis Labels */}
            <div className="absolute left-2 top-4 bottom-8 flex flex-col justify-between font-['JetBrains_Mono'] text-xs text-[#74777d] pointer-events-none">
              <span>${maxPsf}</span>
              <span>${Math.round(minPsf + psfRange * 0.66)}</span>
              <span>${Math.round(minPsf + psfRange * 0.33)}</span>
              <span>${minPsf}</span>
            </div>

            {/* Chart Graphic Area */}
            <div className="w-full h-full ml-10 relative border-l border-b border-[#c4c6cd]/60">
              {/* Horizontal Grid lines */}
              <div className="absolute top-0 w-full border-t border-[#e0e3e5]/80"></div>
              <div className="absolute top-1/3 w-full border-t border-[#e0e3e5]/80"></div>
              <div className="absolute top-2/3 w-full border-t border-[#e0e3e5]/80"></div>

              {/* Simulated SVG Graph with real SVG paths & dynamic rendering */}
              <svg
                className="absolute inset-0 w-full h-full overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 100 100"
              >
                <defs>
                  <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0e6969" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#0e6969" stopOpacity="0.00" />
                  </linearGradient>
                </defs>

                {/* Shaded Area under curve */}
                <path d={areaString} fill="url(#tealGradient)" />

                {/* Primary Data Line */}
                <path
                  d={pathString}
                  fill="none"
                  stroke="#0e6969"
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                />

                {/* Data Points */}
                {points.map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r={i === points.length - 1 ? '4' : '3'}
                    fill={i === points.length - 1 ? '#db7618' : '#0e6969'}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                    className="cursor-pointer hover:r-5 transition-all"
                    onMouseEnter={() => {
                      setHoveredPoint(pt.data);
                      setHoveredIndex(i);
                    }}
                    onMouseLeave={() => {
                      setHoveredPoint(null);
                      setHoveredIndex(null);
                    }}
                  />
                ))}
              </svg>

              {/* Hover Tooltip */}
              {hoveredPoint && hoveredIndex !== null && (
                <div
                  className="absolute bg-[#041627] text-white p-2.5 rounded shadow-xl text-xs z-30 pointer-events-none -translate-x-1/2 -translate-y-full mb-3"
                  style={{
                    left: `${points[hoveredIndex].x}%`,
                    top: `${points[hoveredIndex].y}%`,
                  }}
                >
                  <div className="font-bold text-[#a4f0ef]">{hoveredPoint.year}</div>
                  <div className="font-['JetBrains_Mono'] text-sm font-semibold">
                    ${hoveredPoint.psf} psf
                  </div>
                  <div className="text-[11px] text-[#8192a7]">
                    Est. Avg: ${hoveredPoint.avgPrice.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-[#c4c6cd]">
                    Resale Vol: {hoveredPoint.volume} units
                  </div>
                </div>
              )}

              {/* X Axis Labels */}
              <div className="absolute -bottom-6 w-full flex justify-between font-['JetBrains_Mono'] text-xs text-[#74777d]">
                {trendData.map((d, i) => (
                  <span key={i}>{d.year}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar below chart */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#f7f9fb] p-3 rounded border border-[#e0e3e5]">
              <div className="text-xs text-[#74777d] font-medium">Period Growth</div>
              <div className="font-['JetBrains_Mono'] text-base font-bold text-[#0e6969] flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-4 h-4" />
                +{pctGrowth}%
              </div>
            </div>
            <div className="bg-[#f7f9fb] p-3 rounded border border-[#e0e3e5]">
              <div className="text-xs text-[#74777d] font-medium">Current Avg PSF</div>
              <div className="font-['JetBrains_Mono'] text-base font-bold text-[#041627] mt-0.5">
                ${endPsf} psf
              </div>
            </div>
            <div className="bg-[#f7f9fb] p-3 rounded border border-[#e0e3e5]">
              <div className="text-xs text-[#74777d] font-medium">5-Year Resale Vol</div>
              <div className="font-['JetBrains_Mono'] text-base font-bold text-[#041627] mt-0.5">
                342 Units
              </div>
            </div>
            <div className="bg-[#f7f9fb] p-3 rounded border border-[#e0e3e5]">
              <div className="text-xs text-[#74777d] font-medium">Town Quartile</div>
              <div className="font-['Inter'] text-sm font-semibold text-[#0e6969] mt-0.5">
                Top 35% Stability
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2 Content: Recent Transactions */}
      {activeTab === 'transactions' && (
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg font-bold text-[#041627]">
                Resale Records within 500m
              </h3>
              <p className="text-xs text-[#74777d]">
                Verified transactions recorded by HDB in past 12 months
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={txSearch}
                onChange={(e) => setTxSearch(e.target.value)}
                placeholder="Filter block, storey, date..."
                className="px-3 py-1.5 border border-[#e0e3e5] rounded text-xs bg-[#f7f9fb] outline-none focus:border-[#0e6969]"
              />
            </div>
          </div>

          <div className="overflow-x-auto border border-[#e0e3e5] rounded-lg">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#f2f4f6] text-[#44474c] text-[11px] uppercase tracking-wider font-semibold border-b border-[#e0e3e5]">
                <tr>
                  <th className="py-3 px-4">Block / Street</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Storey</th>
                  <th className="py-3 px-3">Area (sqm)</th>
                  <th className="py-3 px-4 text-right">Price ($)</th>
                  <th className="py-3 px-3 text-right">PSF</th>
                  <th className="py-3 px-3">Month</th>
                  <th className="py-3 px-3">Remaining Lease</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0e3e5]">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#f7f9fb] transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#041627]">
                      {tx.block}, {tx.street}
                    </td>
                    <td className="py-3 px-3 text-[#44474c]">{tx.flatType}</td>
                    <td className="py-3 px-3 text-[#44474c] font-['JetBrains_Mono']">{tx.storey}</td>
                    <td className="py-3 px-3 text-[#44474c] font-['JetBrains_Mono']">{tx.floorAreaSqm} sqm</td>
                    <td className="py-3 px-4 text-right font-['JetBrains_Mono'] font-bold text-[#041627]">
                      ${tx.resalePrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-['JetBrains_Mono'] text-[#0e6969] font-medium">
                      ${tx.psf}
                    </td>
                    <td className="py-3 px-3 text-[#44474c]">{tx.month}</td>
                    <td className="py-3 px-3 text-[#74777d] text-xs">{tx.remainingLease}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 text-right text-[11px] text-[#74777d]">
            Showing {filteredTransactions.length} recorded transactions
          </div>
        </div>
      )}
    </section>
  );
};
