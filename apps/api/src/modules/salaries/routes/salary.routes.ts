import { Router } from 'express';
import { salaryController } from '../controllers/salary.controller.js';
import { validateBody, validateParams } from '../../../middleware/validate.js';
import { createSalarySchema, employeeIdParamSchema } from '../schemas/salary.schema.js';

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
