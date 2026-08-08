import { Request, Response, NextFunction } from 'express';
import { analyticsService } from '../index';

export class AnalyticsController {
  async getSummary(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ data: await analyticsService.getSummary() });
    } catch (error) {
      next(error);
    }
  }

  async getByCountry(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ data: await analyticsService.getByCountry() });
    } catch (error) {
      next(error);
    }
  }

  async getByDepartment(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ data: await analyticsService.getByDepartment() });
    } catch (error) {
      next(error);
    }
  }

  async getSalaryDistribution(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ data: await analyticsService.getSalaryDistribution() });
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();
