# ScalePay — Data Model

## Employee

Core employee identity and organizational information.

Typical fields:

- id
- employeeCode
- firstName
- lastName
- email where implemented
- department
- designation
- country
- employmentStatus
- createdAt
- updatedAt

`employeeCode` is unique.

## SalaryHistory

Stores every salary version instead of overwriting salary values.

Typical fields:

- id
- employeeId
- annualSalary
- currency
- effectiveFrom
- effectiveTo
- createdAt
- updatedAt

Relationship:

```text
Employee 1 ---- N SalaryHistory
```

## ExchangeRate

Stores deterministic currency-to-USD rates.

Typical fields:

- id
- currency
- rateToUsd
- effectiveFrom
- createdAt

## Salary Temporal Rule

Example:

```text
Salary A
effectiveFrom: 2026-01-01
effectiveTo:   2026-12-31

Salary B
effectiveFrom: 2027-01-01
effectiveTo:   null
```

When a new salary becomes effective, the previous current salary is closed at the day before the new effective date.

Salary updates should run transactionally.

## Currency

The application supports the currencies represented in the Prisma enum/reference data. The current exchange-rate validation includes:

```text
USD, EUR, GBP, INR, CAD, AUD, SGD, AED, CHF
```

## Indexing

Index/query optimization should support:

- employeeCode
- country
- department
- designation
- employmentStatus
- salary employeeId
- salary effectiveFrom

Use composite indexes where actual query patterns justify them.

## Seed

Seed approximately/exactly 10,000 employees as required by the assessment, plus representative salary and exchange-rate data.
