import { Router } from 'express';
import { getStatus } from '../controllers/countriesController.js';

const statusRouter = Router();

statusRouter.get('/', getStatus);

export default statusRouter;

