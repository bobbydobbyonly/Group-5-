import React, { useState } from 'react';
import { X, Shield, FileText, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'api' | null>(null);

  return (
    <>
      <footer
        id="app-footer"
        className="bg-white border-t border-[#c4c6cd]/50 w-full py-8 px-4 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 mt-auto transition-colors"
      >
        <div className="text-[12px] uppercase tracking-wider font-semibold text-[#44474c]">
          Data sourced from HDB & LTA. © 2024 HDB Decide
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <button
            onClick={() => setActiveModal('privacy')}
            className="text-sm text-[#44474c] hover:text-[#0e6969] opacity-80 hover:opacity-100 transition-opacity"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveModal('terms')}
            className="text-sm text-[#44474c] hover:text-[#0e6969] opacity-80 hover:opacity-100 transition-opacity"
          >
            Terms of Service
          </button>
          <button
            onClick={() => setActiveModal('api')}
            className="text-sm text-[#44474c] hover:text-[#0e6969] opacity-80 hover:opacity-100 transition-opacity"
          >
            API Documentation
          </button>
        </div>
      </footer>

      {/* Legal & Info Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-[#e0e3e5] max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#e0e3e5]">
              <div className="flex items-center gap-2 font-bold text-lg text-[#041627]">
                {activeModal === 'privacy' && <Shield className="w-5 h-5 text-[#0e6969]" />}
                {activeModal === 'terms' && <FileText className="w-5 h-5 text-[#0e6969]" />}
                {activeModal === 'api' && <Code2 className="w-5 h-5 text-[#0e6969]" />}
                <span>
                  {activeModal === 'privacy' && 'Privacy Policy'}
                  {activeModal === 'terms' && 'Terms of Service'}
                  {activeModal === 'api' && 'HDB & LTA API Integration'}
                </span>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[#74777d] hover:text-[#041627] p-1.5 rounded-lg hover:bg-[#f2f4f6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 text-xs text-[#44474c] leading-relaxed space-y-3">
              {activeModal === 'privacy' && (
                <>
                  <p>
                    HDB Decide is committed to safeguarding your financial privacy. All mortgage calculations, income scenarios, and loan simulations run purely client-side without storing personal identification numbers.
                  </p>
                  <p>
                    Aggregated analytical data adheres strictly to Singapore’s Personal Data Protection Act (PDPA).
                  </p>
                </>
              )}

              {activeModal === 'terms' && (
                <>
                  <p>
                    The estimates, decision scores, and monthly mortgage calculations provided by HDB Decide are for informational and financial simulation purposes only.
                  </p>
                  <p>
                    Final loan eligibility, HDB Flat Eligibility (HFE) letters, CPF Housing Grants, and official valuations must be verified directly with the Housing & Development Board (HDB) and participating financial institutions.
                  </p>
                </>
              )}

              {activeModal === 'api' && (
                <>
                  <p>
                    This platform integrates with official Singapore Government Open Data APIs:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Data.gov.sg:</strong> Resale Flat Prices dataset (Monthly updates).</li>
                    <li><strong>LTA DataMall:</strong> Bus Arrival v2 API & MRT Station GeoJSON coordinates.</li>
                    <li><strong>OneMap API:</strong> Singapore Geospatial Land Coordinates & School Radius buffers.</li>
                  </ul>
                </>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-[#e0e3e5] flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-[#041627] text-white px-4 py-2 rounded text-xs font-semibold hover:bg-[#1a2b3c]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
