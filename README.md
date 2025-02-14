# Spirii Backend Developer Challenge

## Description

This project is an MVP of a data aggregation microservice that collects transactions from a transaction API and exposes its own API endpoints.

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd spirii
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the application:
   ```bash
   npm run start
   ```

## API Endpoints

[!IMPORTANT]: Before using the endpoints, ensure that the job has aggregated the transactions. For testing purposes, the aggregation interval is set to 10 seconds (instead of the 2 minutes). This means you will see the first results approximately 10 seconds after starting the application.

- `GET /aggregations/users/:userId`: Get aggregated data by user ID.
  Example:

  ```bash
  curl http://localhost:3000/aggregations/users/074092
  ```

- `GET /aggregations/payouts`: Get list of requested payouts.
  Example:
  ```bash
  curl http://localhost:3000/aggregations/payouts
  ```

## Testing

To run tests:

```bash
npm run test
```

## Assumptions

- The transaction API is mocked for testing purposes.
- The exchange rate is 1 SCR = 1 EUR.

## Faced problems

- **Scalability**:
  To handle a large number of requests, we can separate transaction processing from their fetching. This was achieved by using job queues to manage the processing of transactions and fetching aggregations independently.

- **Missing transactions**:
  The transaction microservice has a rate limit and only allows fetching transactions by date, not by user ID. This limitation can result in missing transactions because the service might not be able to retrieve all transactions within the rate limit or for the specified dates.

  To avoid missing transactions, we can use continuous fetching with overlapping windows:

  - Instead of fetching only the last 2 minutes, always fetch the last 5-10 minutes (to account for possible delays).
  - Deduplicate transactions using their ID before storing them.

- **Idempotent processing**:
  We cannot afford to process the same transaction twice as it will lead to incorrect results. Idempotency was not fully implemented at the job level, which means you might see payout duplicates if the job runs again. However, it was implemented at the transaction processing level to some extent.

## Improvements

- **Testing (of course)**:
  No integration, end-to-end, or unit tests were implemented due to time constraints. However, testing is crucial for production code to ensure reliability and correctness.

- Cleaner architecture
  Minimize reliance on external tools and libraries at the service level to simplify maintenance and improve portability.

- **Logging**:
  We should log the states of our job execution and log any failures. This will help in monitoring and debugging the system.

- **Simultaneous processing**:
  There is a chance that a job won't finish before the next one starts. To address this, we need to implement mechanisms to handle overlapping job executions, such as job locking or queuing.

- **Security**:
  Implement security best practices to protect the API endpoints and data.

- **Swagger Documentation**:
  Provide Swagger documentation for the API endpoints to make it easier for developers to understand and use the API.
