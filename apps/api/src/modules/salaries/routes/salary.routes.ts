import { Router } from 'express';
import { salaryController } from '../controllers/salary.controller';
import { validateBody, validateParams } from '../../../middleware/validate';
import { createSalarySchema, employeeIdParamSchema } from '../schemas/salary.schema';

const router = Router({ mergeParams: true });

router.get('/', validateParams(employeeIdParamSchema), (req, res, next) =>
  salaryController.getCurrentSalary(req, res, next),
);

router.get('/history', validateParams(employeeIdParamSchema), (req, res, next) =>
  salaryController.getSalaryHistory(req, res, next),
);

router.post(
  '/',
  validateParams(employeeIdParamSchema),
  validateBody(createSalarySchema),
  (req, res, next) => salaryController.reviseSalary(req, res, next),
);

export { router as salaryRoutes };
