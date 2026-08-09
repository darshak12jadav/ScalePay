import { Request, Response, NextFunction } from 'express';
import { employeeService } from '../index.js';
export class EmployeeController {
  async getEmployees(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await employeeService.getEmployees(res.locals.validatedQuery);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
  async getEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const employee = await employeeService.getEmployee(req.params.id as string);
      res.json({ data: employee });
    } catch (error) {
      next(error);
    }
  }
  async createEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const employee = await employeeService.createEmployee(req.body);
      res.status(201).json({ data: employee });
    } catch (error) {
      next(error);
    }
  }
  async updateEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const employee = await employeeService.updateEmployee(req.params.id as string, req.body);
      res.json({ data: employee });
    } catch (error) {
      next(error);
    }
  }
  async deleteEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      await employeeService.deleteEmployee(req.params.id as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async createEmployeeWithSalary(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await employeeService.createEmployeeWithSalary(req.body);

      res.status(201).json({
        data: result,
        message: 'Employee created successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
export const employeeController = new EmployeeController();
