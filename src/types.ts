export interface FlatItem {
  id: string;
  town: string;
  street: string;
  block: string;
  postalCode: string;
  district: string;
  flatType: '2-Room' | '3-Room' | '4-Room' | '5-Room' | 'Executive';
  model: string;
  floorAreaSqm: number;
  floorAreaSqft: number;
  builtYear: number;
  leaseCommenced: number;
  remainingLeaseYears: number;
  remainingLeaseMonths: number;
  decisionScore: number;
  decisionMatchStatus: 'Strong Match' | 'Moderate Match' | 'Fair Match';
  matchReason: string;
  estimatedPrice: number;
  estimatedMonthlyMortgage: number;
  maxBudget: number;
  affordabilityStatus: 'Comfortable Margin' | 'Healthy Budget' | 'Borderline Stretch';
  affordabilityPercentage: number;
  isMature: boolean;
  proximityToMallText: string;
  trafficNodeStatus: string;
  mapImageUrl?: string;
  nearestStop: {
    name: string;
    code: string;
    distance: string;
    buses: Array<{
      number: string;
      destination: string;
      arrivalMins: number;
    }>;
  };
  mrtStation: {
    name: string;
    line: string;
    distance: string;
    walkMins: number;
  };
  historicalTrends: {
    '1Y': PriceTrendPoint[];
    '5Y': PriceTrendPoint[];
    'All': PriceTrendPoint[];
  };
  recentTransactions: Transaction[];
  amenities: Amenity[];
}

export interface PriceTrendPoint {
  year: string;
  psf: number;
  avgPrice: number;
  volume: number;
}

export interface Transaction {
  id: string;
  block: string;
  street: string;
  flatType: string;
  storey: string;
  floorAreaSqm: number;
  resalePrice: number;
  psf: number;
  month: string;
  remainingLease: string;
}

export interface Amenity {
  name: string;
  category: 'Mall' | 'School' | 'Park' | 'Supermarket' | 'Food' | 'Clinic';
  distance: string;
  walkTime: string;
}

export interface TownData {
  id: string;
  name: string;
  region: 'East' | 'North' | 'North-East' | 'West' | 'Central';
  isMature: boolean;
  medianPrice4Room: number;
  avgPsf: number;
  distanceToCbdKm: number;
  transitToCbdMins: number;
  growth5YrPercent: number;
  totalFlats: number;
  highlights: string[];
  topMalls: string[];
  mrtLines: string[];
}

export interface MortgageParams {
  purchasePrice: number;
  downpaymentPercent: number;
  loanType: 'HDB' | 'Bank';
  interestRate: number;
  loanTenureYears: number;
  monthlyIncome: number;
  partnerIncome: number;
  cpfOaBalance: number;
  grantAmount: number;
}

export interface GrantEligibility {
  isFirstTimer: boolean;
  monthlyHouseholdIncome: number;
  livingNearParents: boolean;
  citizenStatus: 'Both SC' | 'SC + PR' | 'Single SC';
}
