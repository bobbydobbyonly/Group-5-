import { Router, Request, Response } from 'express';

const router = Router();

// Helper to get LTA DataMall AccountKey exclusively from environment variables in api/
function getLtaAccountKey(): string | null {
  const key = process.env.LTA_DATAMALL_API_KEY || process.env.LTA_ACCOUNT_KEY || process.env.DATAMALL_ACCOUNT_KEY || process.env.LTA_API_KEY;
  if (!key || key.trim() === '') {
    return null;
  }
  return key.trim();
}

/**
 * Next buses at a stop (v3 - current version; 20-second refresh)
 * Endpoint: GET /api/lta/bus-arrival or /api/bus-arrival
 * Query Params:
 *  - BusStopCode (string, e.g. "83139")
 *  - ServiceNo (optional string, e.g. "15")
 */
router.get(['/bus-arrival', '/lta/bus-arrival'], async (req: Request, res: Response) => {
  const accountKey = getLtaAccountKey();
  if (!accountKey) {
    return res.status(500).json({ error: 'credential not configured' });
  }

  const busStopCode = (req.query.BusStopCode || req.query.busStopCode || req.query.busStop || '') as string;
  const serviceNo = (req.query.ServiceNo || req.query.serviceNo || '') as string;

  if (!busStopCode) {
    return res.status(400).json({ error: 'BusStopCode query parameter is required' });
  }

  try {
    const url = new URL('https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival');
    url.searchParams.set('BusStopCode', busStopCode);
    if (serviceNo) {
      url.searchParams.set('ServiceNo', serviceNo);
    }

    const response = await fetch(url.toString(), {
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `LTA DataMall API error: ${response.statusText}`,
        details: errorText,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    return res.status(502).json({
      error: 'Failed to fetch bus arrival data from LTA DataMall',
      message: error?.message || 'Unknown network error',
    });
  }
});

/**
 * Live Carpark lots (HDB + LTA + URA)
 * Endpoint: GET /api/lta/carpark-availability or /api/carpark-availability
 * Optional Query Params:
 *  - skip (number, for pagination)
 */
router.get(['/carpark-availability', '/lta/carpark-availability'], async (req: Request, res: Response) => {
  const accountKey = getLtaAccountKey();
  if (!accountKey) {
    return res.status(500).json({ error: 'credential not configured' });
  }

  try {
    const skip = req.query.$skip || req.query.skip || '0';
    const url = new URL('https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2');
    if (skip && skip !== '0') {
      url.searchParams.set('$skip', String(skip));
    }

    const response = await fetch(url.toString(), {
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `LTA DataMall API error: ${response.statusText}`,
        details: errorText,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    return res.status(502).json({
      error: 'Failed to fetch carpark availability from LTA DataMall',
      message: error?.message || 'Unknown network error',
    });
  }
});

/**
 * Traffic Incidents
 * Endpoint: GET /api/lta/traffic-incidents or /api/traffic-incidents
 */
router.get(['/traffic-incidents', '/lta/traffic-incidents'], async (_req: Request, res: Response) => {
  const accountKey = getLtaAccountKey();
  if (!accountKey) {
    return res.status(500).json({ error: 'credential not configured' });
  }

  try {
    const response = await fetch('https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents', {
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `LTA DataMall API error: ${response.statusText}`,
        details: errorText,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    return res.status(502).json({
      error: 'Failed to fetch traffic incidents from LTA DataMall',
      message: error?.message || 'Unknown network error',
    });
  }
});

/**
 * Train Service Alerts (MRT / LRT Status)
 * Endpoint: GET /api/lta/train-alerts or /api/train-alerts
 */
router.get(['/train-alerts', '/lta/train-alerts'], async (_req: Request, res: Response) => {
  const accountKey = getLtaAccountKey();
  if (!accountKey) {
    return res.status(500).json({ error: 'credential not configured' });
  }

  try {
    const response = await fetch('https://datamall2.mytransport.sg/ltaodataservice/TrainServiceAlerts', {
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `LTA DataMall API error: ${response.statusText}`,
        details: errorText,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    return res.status(502).json({
      error: 'Failed to fetch train service alerts from LTA DataMall',
      message: error?.message || 'Unknown network error',
    });
  }
});

export default router;
