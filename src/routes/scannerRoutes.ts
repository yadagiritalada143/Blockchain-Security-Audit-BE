import express, { Router } from 'express';
import scannerController from '../controllers/scannerController';
import scanResultsController from '../controllers/scanResultsController';

const scannerRouter: Router = express.Router();

scannerRouter.post('/uploadFile', scannerController.scanFile);
scannerRouter.post('/saveScanResults', scanResultsController.saveScanResults);
scannerRouter.get('/getAllScanResults', scanResultsController.getAllScanResults);
scannerRouter.get('/getScanResultsByUserId/:userId', scanResultsController.getScanResultsByUserId);

export default scannerRouter;