import { EmployeeRepository } from '../repositories/employee.repository';
import { NotFoundError, ConflictError } from '../../../shared/errors/app-errors';
import { GetEmployeesQuery } from '../schemas/employee.schema';
import { Currency } from '../../../generated/prisma/client';

export class EmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async getEmployee(id: string) {
    const employee = await this.employeeRepository.findById(id);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }
    return employee;
  }

  async getEmployees(query: GetEmployeesQuery) {
    const { page, pageSize, sortBy, sortOrder, search, country, department, employmentStatus } =
      query;

    const { data, total } = await this.employeeRepository.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      search,
      country,
      department,
      employmentStatus,
      sortBy,
      sortOrder,
    });

    return {
      data,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async createEmployee(data: {
    employeeCode: string;
    firstName: string;
    lastName: string;
    department: string;
    designation: string;
    country: string;
    employmentStatus?: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
  }) {
    const existingEmployee = await this.employeeRepository.findByEmployeeCode(data.employeeCode);
    if (existingEmployee) {
      throw new ConflictError('Employee code already exists');
    }
    return this.employeeRepository.create(data);
  }

  async updateEmployee(
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      department?: string;
      designation?: string;
      country?: string;
      employmentStatus?: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
    },
  ) {
    await this.getEmployee(id);
    return this.employeeRepository.update(id, data);
  }

  async deleteEmployee(id: string) {
    await this.getEmployee(id);
    await this.employeeRepository.delete(id);
  }

  async createEmployeeWithSalary(data: {
    employeeCode: string;
    firstName: string;
    lastName: string;
    department: string;
    designation: string;
    country: string;
    employmentStatus?: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
    salary: {
      annualSalary: number;
      currency: Currency;
      effectiveFrom: string;
    };
  }) {
    const existingEmployee = await this.employeeRepository.findByEmployeeCode(data.employeeCode);

    if (existingEmployee) {
      throw new ConflictError('Employee code already exists');
    }

    return this.employeeRepository.createWithSalary(
      {
        employeeCode: data.employeeCode,
        firstName: data.firstName,
        lastName: data.lastName,
        department: data.department,
        designation: data.designation,
        country: data.country,
        employmentStatus: data.employmentStatus,
      },
      {
        annualSalary: data.salary.annualSalary,
        currency: data.salary.currency,
        effectiveFrom: new Date(data.salary.effectiveFrom),
      },
    );
  }
}
