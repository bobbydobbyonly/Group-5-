import { Router } from 'express';
import ltaRouter from './lta';
import hdbRouter from './hdb';

const apiRouter = Router();

// Health check endpoint
apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      ltaDataMall: {
        busArrival: true,
        carparkAvailability: true,
        trafficIncidents: true,
        trainServiceAlerts: true,
      },
      dataGovSg: {
        hdbResalePrices: true,
        datasetMetadata: true,
      },
    },
  });
});

// Mount routes
apiRouter.use('/', ltaRouter);
apiRouter.use('/', hdbRouter);

export default apiRouter;
