import { Request, Response, NextFunction } from 'express';
import { exchangeRateService } from '../index';
import { Currency } from '../../../generated/prisma/client';

export class ExchangeRateController {
  async getExchangeRates(_req: Request, res: Response, next: NextFunction) {
    try {
      const rates = await exchangeRateService.getExchangeRates();
      res.json({ data: rates });
    } catch (error) {
      next(error);
    }
  }

  async getExchangeRate(req: Request, res: Response, next: NextFunction) {
    try {
      const rate = await exchangeRateService.getExchangeRate(req.params.currency as Currency);
      res.json({ data: rate });
    } catch (error) {
      next(error);
    }
  }
}

export const exchangeRateController = new ExchangeRateController();
