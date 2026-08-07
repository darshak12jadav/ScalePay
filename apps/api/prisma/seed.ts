import 'dotenv/config';

import { PrismaClient, Currency, EmploymentStatus } from '../src/generated/prisma/client';
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

function randomSalary(): number {
  return Math.floor(Math.random() * 140000) + 30000;
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

  await prisma.salaryHistory.createMany({
    data: createdEmployees.map((employee) => {
      const currency = randomItem(CURRENCIES);

      return {
        employeeId: employee.id,
        annualSalary: randomSalary(),
        currency,
        effectiveFrom: new Date('2026-01-01'),
        effectiveTo: null,
      };
    }),
  });

  console.log('Seed completed successfully.');
  console.log(`Employees: ${createdEmployees.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
