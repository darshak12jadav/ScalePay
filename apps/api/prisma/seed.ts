import 'dotenv/config.js';

import { PrismaClient, Currency, EmploymentStatus } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

const COUNTRIES = [
  'India',
  'United States',
  'United Kingdom',
  'Germany',
  'Canada',
  'Australia',
  'Singapore',
  'United Arab Emirates',
  'Switzerland',
];

const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Finance',
  'Human Resources',
  'Sales',
  'Marketing',
  'Operations',
];

const DESIGNATIONS = [
  'Software Engineer',
  'Senior Software Engineer',
  'Tech Lead',
  'Engineering Manager',
  'Product Manager',
  'Data Analyst',
  'HR Manager',
  'Financial Analyst',
  'Sales Manager',
];

const CURRENCIES: Currency[] = [
  Currency.USD,
  Currency.EUR,
  Currency.GBP,
  Currency.INR,
  Currency.CAD,
  Currency.AUD,
  Currency.SGD,
  Currency.AED,
  Currency.CHF,
];

const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
  INR: 0.012,
  CAD: 0.73,
  AUD: 0.65,
  SGD: 0.74,
  AED: 0.272,
  CHF: 1.12,
};

const SALARY_RANGES: Record<Currency, { min: number; max: number }> = {
  USD: { min: 45000, max: 220000 },
  EUR: { min: 40000, max: 190000 },
  GBP: { min: 35000, max: 170000 },
  INR: { min: 600000, max: 4500000 },
  CAD: { min: 55000, max: 230000 },
  AUD: { min: 60000, max: 240000 },
  SGD: { min: 55000, max: 230000 },
  AED: { min: 150000, max: 750000 },
  CHF: { min: 60000, max: 250000 },
};

const FIRST_NAMES = [
  'Aarav',
  'Arjun',
  'Rohan',
  'Kabir',
  'Neha',
  'Priya',
  'Ananya',
  'Emma',
  'Olivia',
  'Liam',
  'Noah',
  'Sophia',
];

const LAST_NAMES = [
  'Patel',
  'Shah',
  'Jadav',
  'Mehta',
  'Desai',
  'Smith',
  'Johnson',
  'Brown',
  'Williams',
  'Taylor',
];

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomSalary(currency: Currency): number {
  const { min, max } = SALARY_RANGES[currency];

  return Math.floor(Math.random() * (max - min)) + min;
}

async function main() {
  console.log('Seeding ScalePay database...');

  await prisma.exchangeRate.deleteMany();
  await prisma.salaryHistory.deleteMany();
  await prisma.employee.deleteMany();

  await prisma.exchangeRate.createMany({
    data: CURRENCIES.map((currency) => ({
      currency,
      rateToUsd: EXCHANGE_RATES[currency],
    })),
  });

  const employees = Array.from({ length: 10_000 }, (_, index) => ({
    employeeCode: `EMP-${String(index + 1).padStart(5, '0')}`,
    firstName: randomItem(FIRST_NAMES),
    lastName: randomItem(LAST_NAMES),
    department: randomItem(DEPARTMENTS),
    designation: randomItem(DESIGNATIONS),
    country: randomItem(COUNTRIES),
    employmentStatus: randomItem([
      EmploymentStatus.ACTIVE,
      EmploymentStatus.ACTIVE,
      EmploymentStatus.ACTIVE,
      EmploymentStatus.ON_LEAVE,
      EmploymentStatus.INACTIVE,
    ]),
  }));

  await prisma.employee.createMany({
    data: employees,
  });

  const createdEmployees = await prisma.employee.findMany({
    select: {
      id: true,
    },
  });

  // Current salary for every employee
  await prisma.salaryHistory.createMany({
    data: createdEmployees.map((employee) => {
      const currency = randomItem(CURRENCIES);

      return {
        employeeId: employee.id,
        annualSalary: randomSalary(currency),
        currency,
        effectiveFrom: new Date('2026-01-01'),
        effectiveTo: null,
      };
    }),
  });

  // Historical salary records for approximately 20% of employees
  const HISTORY_SAMPLE_RATIO = 0.2;

  const employeesWithHistory = createdEmployees.filter(() => Math.random() < HISTORY_SAMPLE_RATIO);

  await prisma.salaryHistory.createMany({
    data: employeesWithHistory.map((employee) => {
      const currency = randomItem(CURRENCIES);
      const currentSalary = randomSalary(currency);

      return {
        employeeId: employee.id,
        annualSalary: Math.floor(currentSalary * 0.85),
        currency,
        effectiveFrom: new Date('2025-01-01'),
        effectiveTo: new Date('2025-12-31'),
      };
    }),
  });

  console.log('Seed completed successfully.');
  console.log(`Employees: ${createdEmployees.length}`);
  console.log(`Salary records: ${createdEmployees.length + employeesWithHistory.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
