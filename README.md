# ScalePay

pnpm exec prisma validate

pnpm exec prisma format

pnpm prisma generate

pnpm prisma migrate dev --name init

pnpm --filter api exec prisma studio

pnpm --filter api db:seed

# health

curl http://localhost:4000/health

# list (paginated)

curl "http://localhost:4000/api/employees?page=1&pageSize=10"

# search

curl "http://localhost:4000/api/employees?search=Patel"

# filter

curl "http://localhost:4000/api/employees?country=India&department=Engineering&employmentStatus=ACTIVE"

# sort

curl "http://localhost:4000/api/employees?sortBy=firstName&sortOrder=asc"

# get by id

curl http://localhost:4000/api/employees/<id>

# create

curl -X POST http://localhost:4000/api/employees \
-H "Content-Type: application/json" \
-d '{"employeeCode":"TEST-001","firstName":"Test","lastName":"User","department":"Engineering","designation":"Software Engineer","country":"India"}'

# create duplicate (should 409)

curl -X POST http://localhost:4000/api/employees \
-H "Content-Type: application/json" \
-d '{"employeeCode":"TEST-001","firstName":"Test","lastName":"User","department":"Engineering","designation":"Software Engineer","country":"India"}'

# update

curl -X PATCH http://localhost:4000/api/employees/<id> \
-H "Content-Type: application/json" \
-d '{"department":"Product"}'

# delete

curl -X DELETE http://localhost:4000/api/employees/<id>

# not found (should 404)

curl http://localhost:4000/api/employees/does-not-exist

Yes — this Salary module is acceptable for the Incubyte assessment, and I would proceed with it.

But I would not call it literally 100% production-proof. There are two small improvements I'd make before considering it final:

What is already correct
BadRequestError → 400
NotFoundError → 404
Employee existence checked before salary operations
Zod validation for salary input
Currency restricted to your Prisma-supported currencies
effectiveTo controlled by the server
Salary revisions are transactional
Previous salary is automatically closed
Salary history is read-only through the API
No arbitrary PATCH/DELETE of historical salary records

Nested routes are clean:

GET /api/employees/:id/salary
GET /api/employees/:id/salary/history
POST /api/employees/:id/salary
Repository → Service → Controller → Route separation is maintained.
One improvement I recommend

Your current service checks only the current salary:

const currentSalary =
await this.salaryRepository.findCurrentSalary(employeeId);

For a stronger implementation, the service should also protect against historical-date overlaps if the database somehow contains inconsistent history.

Also, your repository's:

effectiveTo.setDate(effectiveTo.getDate() - 1);

works for the assessment, but dates/timezones deserve a little care in a real payroll system.

Neither issue prevents you from proceeding with the assessment.

My recommendation

Don't keep changing this module unnecessarily. Get it compiling and test it.

Run:

cd apps/api
pnpm exec tsc --noEmit

Then:

pnpm dev

Test:

curl "http://localhost:4000/api/employees?page=1&pageSize=1"

Take an employee ID and test:

curl -X POST "http://localhost:4000/api/employees/EMPLOYEE_ID/salary" \
-H "Content-Type: application/json" \
-d '{"annualSalary":75000,"currency":"USD","effectiveFrom":"2026-01-01"}'

Then:

curl "http://localhost:4000/api/employees/EMPLOYEE_ID/salary"

Then revise:

curl -X POST "http://localhost:4000/api/employees/EMPLOYEE_ID/salary" \
-H "Content-Type: application/json" \
-d '{"annualSalary":90000,"currency":"USD","effectiveFrom":"2027-01-01"}'

Finally:

curl "http://localhost:4000/api/employees/EMPLOYEE_ID/salary/history"

You should see:

2027-01-01 → null
2026-01-01 → 2026-12-31

If tsc --noEmit passes and these tests work, consider Salary complete.

ExchangeRate

GET /api/exchange-rates curl http://localhost:4000/api/exchange-rates
GET /api/exchange-rates/:currency curl http://localhost:4000/api/exchange-rates/INR

Payroll

curl "http://localhost:4000/api/employees?page=1&pageSize=1"
curl -X POST http://localhost:4000/api/payroll/calculate \
-H "Content-Type: application/json" \
-d '{"employeeId":"EMPLOYEE_ID","currency":"USD"}'
