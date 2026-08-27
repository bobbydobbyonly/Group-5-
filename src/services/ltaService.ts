/**
 * Client-side service to communicate with backend LTA DataMall proxy routes (/api/...)
 * Note: No secrets or credentials are handled on the client side.
 */

export interface NextBusInfo {
  EstimatedArrival: string;
  Latitude?: string;
  Longitude?: string;
  VisitNumber?: string;
  Load?: string; // 'SEA' (Seats Available), 'SDA' (Standing Available), 'LSD' (Limited Standing)
  Feature?: string; // 'WAB' (Wheelchair Accessible Bus)
  Type?: string; // 'SD' (Single Deck), 'DD' (Double Deck), 'BD' (Bendy)
}

export interface BusServiceArrival {
  ServiceNo: string;
  Operator: string;
  NextBus?: NextBusInfo;
  NextBus2?: NextBusInfo;
  NextBus3?: NextBusInfo;
}

export interface BusArrivalResponse {
  BusStopCode: string;
  Services: BusServiceArrival[];
}

export interface CarparkItem {
  CarParkID: string;
  Area: string;
  Development: string;
  Location: string;
  AvailableLots: number;
  LotType: string; // 'C' (Car), 'H' (Heavy), 'Y' (Motorcycle)
  Agency: string; // 'HDB', 'LTA', 'URA'
}

export interface CarparkResponse {
  value: CarparkItem[];
}

export interface TrafficIncidentItem {
  Type: string;
  Latitude: number;
  Longitude: number;
  Message: string;
}

export interface TrafficIncidentsResponse {
  value: TrafficIncidentItem[];
}

export interface TrainAlertSegment {
  Line: string;
  Direction: string;
  Stations: string;
  FreePublicBus?: string;
  FreeMRTShuttle?: string;
  MRTShuttleDirection?: string;
}

export interface TrainAlertMessage {
  Content: string;
  CreatedDate: string;
}

export interface TrainAlertsResponse {
  value?: {
    Status: number; // 1: Normal, 2: Disrupted
    Message?: TrainAlertMessage[];
    AffectedSegments?: TrainAlertSegment[];
  };
}

export async function fetchLiveBusArrival(busStopCode: string, serviceNo?: string): Promise<{ data?: BusArrivalResponse; error?: string; isLive: boolean }> {
  try {
    const params = new URLSearchParams({ BusStopCode: busStopCode });
    if (serviceNo) {
      params.set('ServiceNo', serviceNo);
    }
    const res = await fetch(`/api/lta/bus-arrival?${params.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      return { error: err.error || `HTTP ${res.status}`, isLive: false };
    }
    const data = await res.json();
    return { data, isLive: true };
  } catch (err: any) {
    return { error: err?.message || 'Network error', isLive: false };
  }
}

export async function fetchLiveCarparks(): Promise<{ data?: CarparkItem[]; error?: string; isLive: boolean }> {
  try {
    const res = await fetch('/api/lta/carpark-availability');
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      return { error: err.error || `HTTP ${res.status}`, isLive: false };
    }
    const data: CarparkResponse = await res.json();
    return { data: data.value || [], isLive: true };
  } catch (err: any) {
    return { error: err?.message || 'Network error', isLive: false };
  }
}

export async function fetchLiveTrafficIncidents(): Promise<{ data?: TrafficIncidentItem[]; error?: string; isLive: boolean }> {
  try {
    const res = await fetch('/api/lta/traffic-incidents');
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      return { error: err.error || `HTTP ${res.status}`, isLive: false };
    }
    const data: TrafficIncidentsResponse = await res.json();
    return { data: data.value || [], isLive: true };
  } catch (err: any) {
    return { error: err?.message || 'Network error', isLive: false };
  }
}

export async function fetchLiveTrainAlerts(): Promise<{ data?: TrainAlertsResponse['value']; error?: string; isLive: boolean }> {
  try {
    const res = await fetch('/api/lta/train-alerts');
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      return { error: err.error || `HTTP ${res.status}`, isLive: false };
    }
    const data: TrainAlertsResponse = await res.json();
    return { data: data.value, isLive: true };
  } catch (err: any) {
    return { error: err?.message || 'Network error', isLive: false };
  }
}

export function calculateMinutesUntil(isoDateStr?: string): number | null {
  if (!isoDateStr) return null;
  const target = new Date(isoDateStr).getTime();
  const now = Date.now();
  const diffMinutes = Math.round((target - now) / 60000);
  return Math.max(0, diffMinutes);
}
