import { prisma } from '../../../lib/prisma.js';
import { Currency } from '../../../generated/prisma/client.js';

interface FindManyOptions {
  skip: number;
  take: number;
  search?: string;
  department?: string;
  country?: string;
  employmentStatus?: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
  sortBy: 'createdAt' | 'firstName' | 'lastName' | 'employeeCode';
  sortOrder: 'asc' | 'desc';
}

export class EmployeeRepository {
  async findById(id: string) {
    return prisma.employee.findUnique({
      where: { id },
      include: {
        salaryHistory: {
          where: {
            effectiveTo: null,
          },
          orderBy: {
            effectiveFrom: 'desc',
          },
          take: 1,
        },
      },
    });
  }

  async findByEmployeeCode(employeeCode: string) {
    return prisma.employee.findUnique({
      where: { employeeCode },
    });
  }

  async findMany(options: FindManyOptions) {
    const { skip, take, search, department, country, employmentStatus, sortBy, sortOrder } =
      options;

    const where: any = {};

    if (search) {
      where.OR = [
        {
          employeeCode: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          firstName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          lastName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          department: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          designation: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          country: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (department) {
      where.department = department;
    }

    if (country) {
      where.country = country;
    }

    if (employmentStatus) {
      where.employmentStatus = employmentStatus;
    }

    const orderBy = {
      [sortBy]: sortOrder,
    };

    const [data, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      prisma.employee.count({
        where,
      }),
    ]);

    return {
      data,
      total,
    };
  }

  async create(data: {
    employeeCode: string;
    firstName: string;
    lastName: string;
    department: string;
    designation: string;
    country: string;
    employmentStatus?: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
  }) {
    return prisma.employee.create({
      data,
    });
  }

  async update(
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
    return prisma.employee.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.employee.delete({
      where: { id },
    });
  }

  async createWithSalary(
    employeeData: {
      employeeCode: string;
      firstName: string;
      lastName: string;
      department: string;
      designation: string;
      country: string;
      employmentStatus?: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
    },
    salaryData: {
      annualSalary: number;
      currency: Currency;
      effectiveFrom: Date;
    },
  ) {
    return prisma.$transaction(async (tx) => {
      const employee = await tx.employee.create({
        data: employeeData,
      });

      const salary = await tx.salaryHistory.create({
        data: {
          employeeId: employee.id,
          annualSalary: salaryData.annualSalary,
          currency: salaryData.currency,
          effectiveFrom: salaryData.effectiveFrom,
          effectiveTo: null,
        },
      });

      return {
        employee,
        salary,
      };
    });
  }
}
