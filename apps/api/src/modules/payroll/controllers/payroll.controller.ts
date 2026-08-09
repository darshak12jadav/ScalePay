import { Request, Response, NextFunction } from 'express';
import { payrollService } from '../index.js';

export class PayrollController {
  async calculatePayroll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await payrollService.calculatePayroll(req.body);
      res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const payrollController = new PayrollController();
