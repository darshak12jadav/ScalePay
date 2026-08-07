-- CreateEnum
CREATE TYPE "EmploymentStatus" AS ENUM ('ACTIVE', 'ON_LEAVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'SGD', 'AED', 'CHF');

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "employeeCode" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "employmentStatus" "EmploymentStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalaryHistory" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "annualSalary" DECIMAL(15,2) NOT NULL,
    "currency" "Currency" NOT NULL,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "effectiveTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SalaryHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExchangeRate" (
    "id" TEXT NOT NULL,
    "currency" "Currency" NOT NULL,
    "rateToUsd" DECIMAL(18,8) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExchangeRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_employeeCode_key" ON "Employee"("employeeCode");

-- CreateIndex
CREATE INDEX "Employee_department_idx" ON "Employee"("department");

-- CreateIndex
CREATE INDEX "Employee_country_idx" ON "Employee"("country");

-- CreateIndex
CREATE INDEX "Employee_designation_idx" ON "Employee"("designation");

-- CreateIndex
CREATE INDEX "Employee_employmentStatus_idx" ON "Employee"("employmentStatus");

-- CreateIndex
CREATE INDEX "Employee_lastName_firstName_idx" ON "Employee"("lastName", "firstName");

-- CreateIndex
CREATE INDEX "SalaryHistory_employeeId_effectiveFrom_idx" ON "SalaryHistory"("employeeId", "effectiveFrom");

-- CreateIndex
CREATE INDEX "SalaryHistory_employeeId_effectiveTo_idx" ON "SalaryHistory"("employeeId", "effectiveTo");

-- CreateIndex
CREATE INDEX "SalaryHistory_currency_idx" ON "SalaryHistory"("currency");

-- CreateIndex
CREATE INDEX "SalaryHistory_effectiveFrom_idx" ON "SalaryHistory"("effectiveFrom");

-- CreateIndex
CREATE UNIQUE INDEX "ExchangeRate_currency_key" ON "ExchangeRate"("currency");

-- AddForeignKey
ALTER TABLE "SalaryHistory" ADD CONSTRAINT "SalaryHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
