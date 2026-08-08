import { Router } from 'express';
import { payrollController } from '../controllers/payroll.controller';
import { validateBody } from '../../../middleware/validate';
import { calculatePayrollSchema } from '../schemas/payroll.schema';

const router = Router();

router.post('/calculate', validateBody(calculatePayrollSchema), (req, res, next) =>
  payrollController.calculatePayroll(req, res, next),
);

export { router as payrollRoutes };
