import { Request, Response, NextFunction } from 'express';
import { salaryService } from '../index.js';

export class SalaryController {
  async getCurrentSalary(req: Request, res: Response, next: NextFunction) {
    try {
      const salary = await salaryService.getCurrentSalary(req.params.id as string);
      res.json({ data: salary });
    } catch (error) {
      next(error);
    }
  }

  async getSalaryHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const history = await salaryService.getSalaryHistory(req.params.id as string);
      res.json({ data: history });
    } catch (error) {
      next(error);
    }
  }

  async reviseSalary(req: Request, res: Response, next: NextFunction) {
    try {
      const salary = await salaryService.reviseSalary(req.params.id as string, req.body);
      res.status(201).json({ data: salary });
    } catch (error) {
      next(error);
    }
  }
}

export const salaryController = new SalaryController();
