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

- `GET /transactions/aggregated/:userId`: Get aggregated data by user ID.
- `GET /transactions/payout-requests`: Get list of requested payouts.

## Testing

To run tests:
```bash
npm run test
```

## Assumptions

- The transaction API is mocked for testing purposes.
- The exchange rate is 1 SCR = 1 EUR.

## Problems
- logging
- rate limit = missed transactions
- testing
- idempotent transaction processing (improve)