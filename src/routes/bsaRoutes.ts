import express, { Router } from 'express';
import bsaController from '../controllers/bsaController';

const bsaRouter: Router = express.Router();

bsaRouter.post('/generateBlocks', bsaController.generateBlocks);

export default bsaRouter;