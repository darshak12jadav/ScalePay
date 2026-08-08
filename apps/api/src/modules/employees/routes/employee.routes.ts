import { Router } from 'express';
import { employeeController } from '../controllers/employee.controller';
import { validateBody, validateParams, validateQuery } from '../../../middleware/validate';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  employeeIdParamSchema,
  getEmployeesQuerySchema,
} from '../schemas/employee.schema';
import { salaryRoutes } from '../../salaries/routes/salary.routes';

const router = Router();

router.get('/', validateQuery(getEmployeesQuerySchema), (req, res, next) =>
  employeeController.getEmployees(req, res, next),
);

router.get('/:id', validateParams(employeeIdParamSchema), (req, res, next) =>
  employeeController.getEmployee(req, res, next),
);

router.post('/', validateBody(createEmployeeSchema), (req, res, next) =>
  employeeController.createEmployee(req, res, next),
);

router.patch(
  '/:id',
  validateParams(employeeIdParamSchema),
  validateBody(updateEmployeeSchema),
  (req, res, next) => employeeController.updateEmployee(req, res, next),
);

router.delete('/:id', validateParams(employeeIdParamSchema), (req, res, next) =>
  employeeController.deleteEmployee(req, res, next),
);

router.use('/:id/salary', salaryRoutes);

export { router as employeeRoutes };
