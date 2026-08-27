import { Router, Request, Response } from 'express';

const router = Router();

const DEFAULT_HDB_RESALE_RESOURCE_ID = 'd_8b84c4ee58e3cfc0ece0d773c8ca6abc';

/**
 * Helper to optionally retrieve Data.gov.sg API key if configured.
 * Strictly read only from process.env inside the api/ directory.
 */
function getDataGovApiKey(): string | null {
  const key = process.env.DATA_GOV_SG_API_KEY || process.env.DATAGOV_API_KEY;
  if (!key || key.trim() === '') {
    return null;
  }
  return key.trim();
}

/**
 * HDB Resale Prices (Jan 2017 onwards)
 * Source: https://data.gov.sg/api/action/datastore_search?resource_id=d_8b84c4ee58e3cfc0ece0d773c8ca6abc
 * 
 * Query Parameters:
 *  - resource_id (optional, defaults to d_8b84c4ee58e3cfc0ece0d773c8ca6abc)
 *  - limit (number, e.g. 5, 20, 100)
 *  - offset (number)
 *  - filters (JSON string or object, e.g. {"town":"TAMPINES","flat_type":"4 ROOM"})
 *  - q (search query string)
 *  - sort (e.g. "month desc")
 */
router.get(['/resale-prices', '/hdb/resale-prices', '/datagov/resale-prices'], async (req: Request, res: Response) => {
  try {
    const resourceId = (req.query.resource_id as string) || DEFAULT_HDB_RESALE_RESOURCE_ID;
    const limit = (req.query.limit as string) || '5';
    const offset = (req.query.offset as string) || (req.query.skip as string) || '0';
    const q = req.query.q as string;
    const sort = req.query.sort as string;
    let filters = req.query.filters as string;

    const url = new URL('https://data.gov.sg/api/action/datastore_search');
    url.searchParams.set('resource_id', resourceId);
    url.searchParams.set('limit', limit);
    if (offset && offset !== '0') {
      url.searchParams.set('offset', offset);
    }
    if (q) {
      url.searchParams.set('q', q);
    }
    if (sort) {
      url.searchParams.set('sort', sort);
    }

    // Handle filters passed as query params directly (e.g. town=TAMPINES&flat_type=4 ROOM) or as JSON string
    if (!filters && (req.query.town || req.query.flat_type || req.query.block || req.query.street_name || req.query.month)) {
      const filterObj: Record<string, string> = {};
      if (req.query.town) filterObj.town = String(req.query.town).toUpperCase();
      if (req.query.flat_type) filterObj.flat_type = String(req.query.flat_type).toUpperCase();
      if (req.query.block) filterObj.block = String(req.query.block).toUpperCase();
      if (req.query.street_name) filterObj.street_name = String(req.query.street_name).toUpperCase();
      if (req.query.month) filterObj.month = String(req.query.month);
      filters = JSON.stringify(filterObj);
    }

    if (filters) {
      url.searchParams.set('filters', filters);
    }

    const headers: Record<string, string> = {
      accept: 'application/json',
    };

    const apiKey = getDataGovApiKey();
    if (apiKey) {
      headers['x-api-key'] = apiKey;
    }

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `Data.gov.sg API error: ${response.statusText}`,
        details: errorText,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    return res.status(502).json({
      error: 'Failed to fetch HDB resale data from Data.gov.sg',
      message: error?.message || 'Unknown network error',
    });
  }
});

/**
 * Dataset Metadata (field names, description, and types)
 * Source: https://api-production.data.gov.sg/v2/public/api/datasets/{datasetId}/metadata
 */
router.get(['/dataset-metadata', '/hdb/dataset-metadata', '/datagov/dataset-metadata'], async (req: Request, res: Response) => {
  try {
    const datasetId = (req.query.datasetId as string) || (req.query.resource_id as string) || DEFAULT_HDB_RESALE_RESOURCE_ID;
    const url = `https://api-production.data.gov.sg/v2/public/api/datasets/${encodeURIComponent(datasetId)}/metadata`;

    const headers: Record<string, string> = {
      accept: 'application/json',
    };

    const apiKey = getDataGovApiKey();
    if (apiKey) {
      headers['x-api-key'] = apiKey;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `Data.gov.sg Metadata API error: ${response.statusText}`,
        details: errorText,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    return res.status(502).json({
      error: 'Failed to fetch dataset metadata from Data.gov.sg',
      message: error?.message || 'Unknown network error',
    });
  }
});

export default router;
