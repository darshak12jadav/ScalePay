# ScalePay — Product Requirements

## Goal

Build a web-based salary management system for an HR Manager responsible for approximately 10,000 employees across multiple countries.

The system replaces spreadsheet-based salary management with reliable employee records, historical salary tracking, multi-currency reporting, and analytics.

## User Persona

Primary user: HR Manager.

Authentication is assumed to be handled by an existing organizational identity system and is therefore outside the MVP.

## In Scope

### Employees

- List/search/filter employees.
- Create employees.
- Update employees.
- View employee details.
- Manage employment status.

### Salaries

- Annual base salary.
- Salary currency.
- Effective dates.
- Salary revisions.
- Complete salary history.

### Multi-Currency

- Preserve original currency.
- Use fixed exchange rates for USD reporting.
- Provide exchange-rate reference endpoints.

### Analytics

- Employee count.
- Salary totals.
- Average salary.
- Median salary where supported.
- Country breakdown.
- Department breakdown.
- Salary distribution.

### Data

- Seed 10,000 employees.
- Seed salary/reference data.
- Maintain relational integrity.

## Out of Scope

- Authentication.
- Authorization/RBAC.
- Payroll.
- Tax.
- Payslips.
- Benefits.
- Attendance.
- Leave.
- Live FX integration.
- Payroll provider integrations.
- Notifications.
- Employee self-service.
- AI natural-language querying.

## Product Principles

1. Preserve salary history.
2. Never overwrite historical compensation records.
3. Keep local salary currency as the source value.
4. Normalize to USD only for comparable reporting.
5. Prefer deterministic behavior over unnecessary external dependencies.
6. Keep the architecture simple enough to understand and operate.

## Success Criteria

An HR Manager can manage employees and salaries, review salary history, search/filter the employee population, and answer core compensation questions from the dashboard.

The system must remain understandable, testable, and performant for the 10,000-employee dataset.
