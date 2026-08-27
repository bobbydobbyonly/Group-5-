/**
 * Client service for interacting with Data.gov.sg HDB Resale Prices & Metadata
 * Proxied via backend /api/resale-prices and /api/dataset-metadata
 */

export interface HDBResaleRecord {
  _id: number;
  month: string; // e.g. "2017-01"
  town: string; // e.g. "TAMPINES"
  flat_type: string; // e.g. "4 ROOM"
  block: string; // e.g. "211"
  street_name: string; // e.g. "TAMPINES ST 23"
  storey_range: string; // e.g. "04 TO 06"
  floor_area_sqm: string; // e.g. "104"
  flat_model: string; // e.g. "Model A"
  lease_commence_date: string; // e.g. "1985"
  remaining_lease: string; // e.g. "67 years 08 months"
  resale_price: string; // e.g. "440000"
}

export interface DataGovSearchResult {
  resource_id: string;
  fields: Array<{ type: string; id: string }>;
  records: HDBResaleRecord[];
  limit: number;
  total: number;
  _links?: {
    start: string;
    next: string;
  };
}

export interface DatasetMetadata {
  datasetId: string;
  name: string;
  description: string;
  createdAt: string;
  lastUpdatedAt?: string;
  managedByAgencyName?: string;
  format?: string;
  coverageStart?: string;
  coverageEnd?: string;
  schema?: {
    fields: Array<{
      name: string;
      title?: string;
      type: string;
      description?: string;
      format?: string;
    }>;
  };
}

export interface FetchResalePricesOptions {
  limit?: number;
  offset?: number;
  town?: string;
  flatType?: string;
  block?: string;
  streetName?: string;
  month?: string;
  query?: string;
  filters?: Record<string, string>;
}

export async function fetchHDBResalePrices(
  options: FetchResalePricesOptions = {}
): Promise<{ data?: DataGovSearchResult; error?: string; isLive: boolean }> {
  try {
    const params = new URLSearchParams();
    if (options.limit) params.set('limit', String(options.limit));
    if (options.offset) params.set('offset', String(options.offset));
    if (options.query) params.set('q', options.query);

    if (options.filters) {
      params.set('filters', JSON.stringify(options.filters));
    } else {
      if (options.town) params.set('town', options.town.toUpperCase());
      if (options.flatType) {
        // Normalise flat type e.g. "4-Room" -> "4 ROOM"
        const formattedType = options.flatType.replace('-', ' ').toUpperCase();
        params.set('flat_type', formattedType);
      }
      if (options.block) params.set('block', options.block.toUpperCase());
      if (options.streetName) params.set('street_name', options.streetName.toUpperCase());
      if (options.month) params.set('month', options.month);
    }

    const res = await fetch(`/api/resale-prices?${params.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      return { error: err.error || `HTTP ${res.status}`, isLive: false };
    }

    const json = await res.json();
    if (json.success && json.result) {
      return { data: json.result, isLive: true };
    }
    return { data: json.result || json, isLive: true };
  } catch (err: any) {
    return { error: err?.message || 'Network error', isLive: false };
  }
}

export async function fetchDatasetMetadata(): Promise<{
  data?: DatasetMetadata;
  error?: string;
  isLive: boolean;
}> {
  try {
    const res = await fetch('/api/dataset-metadata');
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      return { error: err.error || `HTTP ${res.status}`, isLive: false };
    }
    const json = await res.json();
    return { data: json.data || json, isLive: true };
  } catch (err: any) {
    return { error: err?.message || 'Network error', isLive: false };
  }
}
