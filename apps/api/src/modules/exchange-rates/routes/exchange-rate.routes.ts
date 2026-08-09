import { Router } from 'express';
import { exchangeRateController } from '../controllers/exchange-rate.controller.js';
import { validateParams } from '../../../middleware/validate.js';
import { currencyParamSchema } from '../schemas/exchange-rate.schema.js';

const router = Router();

router.get('/', (req, res, next) => exchangeRateController.getExchangeRates(req, res, next));

router.get('/:currency', validateParams(currencyParamSchema), (req, res, next) =>
  exchangeRateController.getExchangeRate(req, res, next),
);

export { router as exchangeRateRoutes };
