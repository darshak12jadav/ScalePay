import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { prisma } from './lib/prisma';

import { notFoundHandler } from './middleware/not-found';
import { errorHandler } from './middleware/error-handler';

import { employeeRoutes } from './modules/employees/routes/employee.routes';
import { exchangeRateRoutes } from './modules/exchange-rates/routes/exchange-rate.routes';
import { payrollRoutes } from './modules/payroll/routes/payroll.routes';

export const app: Application = express();

app.use(helmet() as unknown as express.RequestHandler);
app.use(cors());
app.use(express.json());

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: 'ok',
      database: 'connected',
    });
  } catch {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
    });
  }
});

app.use('/api/employees', employeeRoutes);

app.use('/api/exchange-rates', exchangeRateRoutes);

app.use('/api/payroll', payrollRoutes);

app.use(notFoundHandler);

app.use(errorHandler);
