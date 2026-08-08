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
