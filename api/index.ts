import { Router } from 'express';
import ltaRouter from './lta';

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
    },
  });
});

// Mount LTA DataMall routes
apiRouter.use('/', ltaRouter);

export default apiRouter;
