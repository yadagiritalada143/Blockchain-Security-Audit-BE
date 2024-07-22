import express, { Router } from 'express';
import bsaController from '../controllers/bsaController';

const bsaRouter: Router = express.Router();

bsaRouter.post('/generateBlocks', bsaController.generateBlocks);
bsaRouter.get('/getBlocksByUser/:email', bsaController.getBlocksByUser);
bsaRouter.delete('/deleteBlockById', bsaController.deleteBlockById);

export default bsaRouter;