import { Router } from 'express';
import { analyticsController } from '../controller/analytics.controller';

const router = Router();

router.get('/summary', (req, res, next) => analyticsController.getSummary(req, res, next));
router.get('/by-country', (req, res, next) => analyticsController.getByCountry(req, res, next));
router.get('/by-department', (req, res, next) =>
  analyticsController.getByDepartment(req, res, next),
);
router.get('/salary-distribution', (req, res, next) =>
  analyticsController.getSalaryDistribution(req, res, next),
);

export { router as analyticsRoutes };
