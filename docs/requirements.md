# ScalePay — MVP Requirements

## 1. Goal

Build a web-based salary management system for ACME’s HR Manager to replace spreadsheet-based salary management for approximately **10,000 employees across multiple countries**.

The MVP should make salary data easy to manage and provide reliable, structured insights into **how the organization pays its employees**.

## 2. Primary User

**HR Manager** — the application assumes the user is already authenticated and authorized as an internal HR user.

## 3. MVP Scope & Functional Requirements

### Employee Management

- View employees with pagination, search, sorting, and filters.
- View individual employee details and salary information.
- Create, update, and remove employee records.
- Store attributes required for salary analytics:

  - Name
  - Department
  - Designation
  - Country
  - Employment status
  - Currency
  - Annual base salary

### Salary Management

- Store and manage annual base salary.
- Support salaries in different local currencies.
- Allow HR to update employee salaries.
- Maintain salary revision history with effective dates for auditability.
- Use a fixed exchange-rate table to normalize salaries to USD for organization-level analytics.
- Preserve the original salary and currency alongside the normalized reporting value.

### Analytics & Reporting

Provide structured dashboards and filters to answer questions such as:

- What is the total salary expenditure?
- How does salary expenditure vary by country and department?
- What are the average and median salaries?
- What are the minimum and maximum salaries?
- How are employees distributed across salary ranges?
- How does compensation differ across countries, departments, and designations?

Analytics should support filtering by **country, department, designation, employment status, and salary range**.

## 4. Deliberately Out of Scope

To keep the MVP focused and deliverable:

- Authentication and authorization implementation.
- Payroll processing, payslips, tax calculations, deductions, and benefits.
- Bonus, allowance, and other detailed compensation components beyond annual base salary.
- Real-time exchange-rate integration; a fixed exchange-rate table will be used.
- Employee self-service functionality.
- Bulk Excel import/export workflows.
- Notifications and approval workflows.
- Advanced forecasting or compensation recommendations.
- Natural-language/AI querying of salary data.

A natural-language query interface may be explored **if time permits after all core MVP functionality, tests, and quality requirements are complete**.

## 5. Quality & Engineering Expectations

The system will be designed for approximately **10,000 employees**, with focus on maintainability, correctness, clear separation of responsibilities, appropriate database indexing, validation, meaningful automated tests, and pragmatic architecture.

The MVP will be delivered as a fully functional deployed web application with seeded employee data and supporting documentation.
