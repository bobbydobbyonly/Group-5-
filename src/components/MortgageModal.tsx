import React, { useState } from 'react';
import { FlatItem } from '../types';
import { Calculator, DollarSign, X, CheckCircle2, AlertTriangle, Percent, ArrowRight } from 'lucide-react';

interface MortgageModalProps {
  isOpen: boolean;
  onClose: () => void;
  flat: FlatItem;
}

export const MortgageModal: React.FC<MortgageModalProps> = ({ isOpen, onClose, flat }) => {
  const [purchasePrice, setPurchasePrice] = useState<number>(flat.estimatedPrice || 560000);
  const [loanType, setLoanType] = useState<'HDB' | 'Bank'>('HDB');
  const [downpaymentPercent, setDownpaymentPercent] = useState<number>(loanType === 'HDB' ? 20 : 25);
  const [tenureYears, setTenureYears] = useState<number>(25);
  const [interestRate, setInterestRate] = useState<number>(loanType === 'HDB' ? 2.6 : 3.5);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(7500);

  if (!isOpen) return null;

  // Calculations
  const downpaymentAmount = (purchasePrice * downpaymentPercent) / 100;
  const loanPrincipal = purchasePrice - downpaymentAmount;
  const monthlyRate = interestRate / 100 / 12;
  const totalPayments = tenureYears * 12;

  // Monthly mortgage installment: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyInstallment =
    monthlyRate > 0
      ? (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1)
      : loanPrincipal / totalPayments;

  const totalInterestPaid = monthlyInstallment * totalPayments - loanPrincipal;
  const msrRatio = ((monthlyInstallment / monthlyIncome) * 100).toFixed(1);
  const isMsrSafe = parseFloat(msrRatio) <= 30.0;

  const handleLoanTypeChange = (type: 'HDB' | 'Bank') => {
    setLoanType(type);
    if (type === 'HDB') {
      setInterestRate(2.6);
      setDownpaymentPercent(20);
    } else {
      setInterestRate(3.5);
      setDownpaymentPercent(25);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl border border-[#e0e3e5] max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#e0e3e5]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#0e6969]/10 text-[#0e6969]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#041627]">Mortgage & Affordability Modeler</h2>
              <p className="text-xs text-[#74777d]">{flat.street}, {flat.block} ({flat.town})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#74777d] hover:text-[#041627] p-1.5 rounded-lg hover:bg-[#f2f4f6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-xs">
          {/* Loan Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#f2f4f6] rounded-lg">
            <button
              onClick={() => handleLoanTypeChange('HDB')}
              className={`py-2 rounded-md font-semibold transition-all ${
                loanType === 'HDB'
                  ? 'bg-white text-[#041627] shadow-xs'
                  : 'text-[#44474c] hover:text-[#041627]'
              }`}
            >
              HDB Housing Loan (2.6% p.a.)
            </button>
            <button
              onClick={() => handleLoanTypeChange('Bank')}
              className={`py-2 rounded-md font-semibold transition-all ${
                loanType === 'Bank'
                  ? 'bg-white text-[#041627] shadow-xs'
                  : 'text-[#44474c] hover:text-[#041627]'
              }`}
            >
              Commercial Bank Loan (~3.5% p.a.)
            </button>
          </div>

          {/* Inputs */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[#44474c] font-medium">Agreed Purchase Price:</span>
              <span className="font-['JetBrains_Mono'] font-bold text-[#041627]">
                ${purchasePrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="200000"
              max="2000000"
              step="10000"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(Number(e.target.value))}
              className="w-full accent-[#0e6969]"
            />
            <div className="flex justify-between text-[10px] text-[#74777d] mt-0.5">
              <span>$200k (2-Room)</span>
              <span>$1.0M (Million Dollar Club)</span>
              <span className="font-semibold text-[#0e6969]">$2.0M (HDB Max)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#44474c] font-medium block mb-1">Downpayment ({downpaymentPercent}%)</label>
              <div className="font-['JetBrains_Mono'] p-2 bg-[#f7f9fb] border border-[#e0e3e5] rounded font-semibold text-[#041627]">
                ${downpaymentAmount.toLocaleString()}
              </div>
              <span className="text-[10px] text-[#74777d] mt-0.5 block">
                {loanType === 'HDB' ? 'Can be 100% CPF OA' : 'Min 5% Cash + 20% CPF OA'}
              </span>
            </div>
            <div>
              <label className="text-[#44474c] font-medium block mb-1">Loan Principal</label>
              <div className="font-['JetBrains_Mono'] p-2 bg-[#f7f9fb] border border-[#e0e3e5] rounded font-semibold text-[#0e6969]">
                ${loanPrincipal.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#44474c] font-medium block mb-1">Loan Tenure ({tenureYears} years)</label>
              <select
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full p-2 border border-[#e0e3e5] rounded bg-[#f7f9fb] font-['JetBrains_Mono']"
              >
                <option value={15}>15 Years</option>
                <option value={20}>20 Years</option>
                <option value={25}>25 Years (Standard)</option>
                <option value={30}>30 Years (Bank Max)</option>
              </select>
            </div>
            <div>
              <label className="text-[#44474c] font-medium block mb-1">Interest Rate (% p.a.)</label>
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full p-2 border border-[#e0e3e5] rounded bg-[#f7f9fb] font-['JetBrains_Mono']"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[#44474c] font-medium">Combined Monthly Household Income:</span>
              <span className="font-['JetBrains_Mono'] font-bold text-[#041627]">
                ${monthlyIncome.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="2500"
              max="35000"
              step="500"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              className="w-full accent-[#0e6969]"
            />
            <div className="flex justify-between text-[10px] text-[#74777d] mt-0.5">
              <span>$2,500</span>
              <span>$14k (HDB BTO Ceiling)</span>
              <span>$21k (EC Ceiling)</span>
              <span>$35k (Executive Max)</span>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="bg-[#041627] text-white p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-end border-b border-[#1a2b3c] pb-3">
              <div>
                <span className="text-xs text-[#8192a7]">Estimated Monthly Repayment</span>
                <div className="font-['JetBrains_Mono'] text-2xl font-bold text-[#a4f0ef] mt-0.5">
                  ${Math.round(monthlyInstallment).toLocaleString()}
                  <span className="text-xs font-normal text-[#8192a7]"> / month</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#8192a7]">Total Interest Paid</span>
                <div className="font-['JetBrains_Mono'] text-sm font-semibold text-white mt-0.5">
                  ${Math.round(totalInterestPaid).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                {isMsrSafe ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                )}
                <span className="text-xs">
                  MSR Ratio: <strong className={isMsrSafe ? 'text-emerald-400' : 'text-amber-400'}>{msrRatio}%</strong> (HDB Cap: 30%)
                </span>
              </div>
              <span className="text-[11px] text-[#8192a7]">
                {isMsrSafe ? 'Safe & Approved' : 'Exceeds 30% MSR Limit'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-[#e0e3e5] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-[#041627] text-white px-5 py-2 rounded-md font-semibold text-xs hover:bg-[#1a2b3c] transition-colors"
          >
            Apply to Property Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
