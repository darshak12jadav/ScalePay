# ScalePay API Documentation

Base URL:

```text
http://localhost:4000
```

All API responses use JSON.

## Common Error Format

Errors are returned with an appropriate HTTP status.

Typical statuses:

| Status | Meaning                                   |
| ------ | ----------------------------------------- |
| 200    | Successful read/update                    |
| 201    | Resource created                          |
| 400    | Invalid request                           |
| 404    | Resource not found                        |
| 409    | Conflict, such as duplicate employee code |
| 500    | Unexpected server error                   |

## 1. Health

### GET /health

Checks API/database availability.

```bash
curl http://localhost:4000/health
```

Example:

```json
{
  "status": "ok",
  "database": "connected"
}
```

---

# Employees

## 2. List Employees

### GET /api/employees

Supports pagination, search, filtering, and sorting.

### Query Parameters

- `page`
- `pageSize`
- `search`
- `country`
- `department`
- `designation`
- `employmentStatus`
- `sortBy`
- `sortOrder`

Example:

```bash
curl "http://localhost:4000/api/employees?page=1&pageSize=10"
```

Search:

```bash
curl "http://localhost:4000/api/employees?search=Patel"
```

Filter:

```bash
curl "http://localhost:4000/api/employees?country=India&department=Engineering&employmentStatus=ACTIVE"
```

Sort:

```bash
curl "http://localhost:4000/api/employees?sortBy=firstName&sortOrder=asc"
```

The API should return paginated employee data and pagination metadata.

## 3. Get Employee

### GET /api/employees/:id

```bash
curl "http://localhost:4000/api/employees/<EMPLOYEE_ID>"
```

Returns one employee or `404` when the employee does not exist.

## 4. Create Employee

### POST /api/employees

```bash
curl -X POST "http://localhost:4000/api/employees" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeCode":"TEST-001",
    "firstName":"Test",
    "lastName":"User",
    "department":"Engineering",
    "designation":"Software Engineer",
    "country":"India"
  }'
```

Validation should reject invalid required fields.

Duplicate employee codes should return `409`.

## 5. Update Employee

### PATCH /api/employees/:id

```bash
curl -X PATCH "http://localhost:4000/api/employees/<EMPLOYEE_ID>" \
  -H "Content-Type: application/json" \
  -d '{"department":"Product"}'
```

Updates permitted employee fields.

## 6. Delete/Deactivate Employee

### DELETE /api/employees/:id

```bash
curl -X DELETE "http://localhost:4000/api/employees/<EMPLOYEE_ID>"
```

The implementation should follow the project's chosen employee lifecycle policy. Prefer deactivation when historical salary/reporting integrity must be preserved.

## 7. Employee Not Found

```bash
curl "http://localhost:4000/api/employees/does-not-exist"
```

Expected:

```text
404 Not Found
```

---

# Salary

## 8. Get Current Salary

### GET /api/employees/:id/salary

```bash
curl "http://localhost:4000/api/employees/<EMPLOYEE_ID>/salary"
```

Returns the currently effective salary.

## 9. Get Salary History

### GET /api/employees/:id/salary/history

```bash
curl "http://localhost:4000/api/employees/<EMPLOYEE_ID>/salary/history"
```

Returns historical salary records ordered by effective date.

## 10. Create/Revise Salary

### POST /api/employees/:id/salary

```bash
curl -X POST "http://localhost:4000/api/employees/<EMPLOYEE_ID>/salary" \
  -H "Content-Type: application/json" \
  -d '{
    "annualSalary":75000,
    "currency":"USD",
    "effectiveFrom":"2026-01-01"
  }'
```

For a revision:

```bash
curl -X POST "http://localhost:4000/api/employees/<EMPLOYEE_ID>/salary" \
  -H "Content-Type: application/json" \
  -d '{
    "annualSalary":90000,
    "currency":"USD",
    "effectiveFrom":"2027-01-01"
  }'
```

The previous salary is closed by setting its effective end date to the day before the new salary starts.

Salary revisions are transactional.

Example history:

```text
2027-01-01 -> null
2026-01-01 -> 2026-12-31
```

---

# Exchange Rates

## 11. List Exchange Rates

### GET /api/exchange-rates

```bash
curl "http://localhost:4000/api/exchange-rates"
```

Example response shape:

```json
{
  "data": [
    {
      "currency": "AED",
      "rateToUsd": 0.2723
    }
  ]
}
```

The exact fields follow the Prisma/API implementation.

## 12. Get Exchange Rate

### GET /api/exchange-rates/:currency

Example:

```bash
curl "http://localhost:4000/api/exchange-rates/INR"
```

Supported currencies are defined by the application, currently including:

```text
USD
EUR
GBP
INR
CAD
AUD
SGD
AED
CHF
```

An unsupported currency parameter should be rejected by validation.

A valid but missing exchange rate returns `404`.

---

# Payroll

If payroll calculation is included in the final implementation, document it here.

### POST /api/payroll/calculate

Example:

```bash
curl -X POST "http://localhost:4000/api/payroll/calculate" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId":"<EMPLOYEE_ID>",
    "currency":"USD"
  }'
```

This endpoint is optional for the MVP and should not be documented as implemented unless it exists in the repository.

---

# Analytics

## 13. Summary

### GET /api/analytics/summary

```bash
curl "http://localhost:4000/api/analytics/summary"
```

Expected metrics include some or all of:

- employee count
- total annual salary cost
- average salary
- median salary

## 14. By Country

### GET /api/analytics/by-country

```bash
curl "http://localhost:4000/api/analytics/by-country"
```

Provides compensation and/or employee counts grouped by country.

## 15. By Department

### GET /api/analytics/by-department

```bash
curl "http://localhost:4000/api/analytics/by-department"
```

Provides compensation and/or employee counts grouped by department.

## 16. Salary Distribution

### GET /api/analytics/salary-distribution

```bash
curl "http://localhost:4000/api/analytics/salary-distribution"
```

Provides salary-band/distribution information for dashboard visualization.

## Analytics Currency

Original salary values are preserved.

For organization-level comparison, local currency is normalized to USD using the fixed exchange-rate table.

This keeps analytics deterministic and avoids live external FX dependencies.

---

# API Design Principles

## Validation

External input is validated before reaching business logic.

Zod is used for request validation where applicable.

## Layering

The backend follows:

```text
HTTP Request
    ↓
Route
    ↓
Controller
    ↓
Validation
    ↓
Service
    ↓
Repository
    ↓
Prisma
    ↓
PostgreSQL
```

## Error Handling

Errors are centralized through application error classes and global error middleware.

Examples include:

- BadRequestError
- NotFoundError
- ConflictError

## Transactional Salary Updates

Salary revision operations are transactional so that closing the old salary and creating the new salary happen as one operation.

## Pagination

Employee listing is paginated server-side to avoid transferring all 10,000 employees to the browser.

## Source of Truth

PostgreSQL is the source of truth.

Redis, if introduced, is an optimization only.
