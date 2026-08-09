import { Router } from 'express';
import { payrollController } from '../controllers/payroll.controller.js';
import { validateBody } from '../../../middleware/validate.js';
import { calculatePayrollSchema } from '../schemas/payroll.schema.js';

const router = Router();

router.post('/calculate', validateBody(calculatePayrollSchema), (req, res, next) =>
  payrollController.calculatePayroll(req, res, next),
);

export { router as payrollRoutes };
