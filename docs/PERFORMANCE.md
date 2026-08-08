# ScalePay — Performance Considerations

## Target Dataset

Approximately 10,000 employees.

This is comfortably within the capability of PostgreSQL with sensible indexing and pagination.

## Query Strategy

- Server-side pagination.
- Database filtering.
- Database aggregation.
- Avoid N+1 queries.
- Select only required fields.
- Avoid unbounded API responses.

## Indexing

Common employee filters and relationships should be indexed.

## Analytics

Dashboard metrics should be aggregated by PostgreSQL rather than loading all employees into Node.js.

## Currency

Analytics should use stored deterministic exchange rates rather than making an external request for every dashboard query.

## Frontend

The browser should render only the current page of employee records.

Charts should consume compact aggregated API responses.

## Caching

Caching is optional.

If performance profiling identifies expensive repeated dashboard queries, Redis or another cache can be introduced.

Caching must never become the source of truth.

## Future Scaling

If the organization grows significantly:

- read replicas
- materialized views
- precomputed analytics
- background jobs
- selective caching
- database partitioning for very large salary history

can be evaluated.
