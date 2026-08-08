import { Router } from 'express';
import { exchangeRateController } from '../controllers/exchange-rate.controller';
import { validateParams } from '../../../middleware/validate';
import { currencyParamSchema } from '../schemas/exchange-rate.schema';

const router = Router();

router.get('/', (req, res, next) => exchangeRateController.getExchangeRates(req, res, next));

router.get('/:currency', validateParams(currencyParamSchema), (req, res, next) =>
  exchangeRateController.getExchangeRate(req, res, next),
);

export { router as exchangeRateRoutes };
