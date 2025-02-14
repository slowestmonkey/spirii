import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/transaction/domain/transaction.type';
import { TransactionService } from 'src/transaction/transaction.service';
import { AggregationCacheService } from './aggregation-cache.service';
import { Aggregation } from './domain/aggregation.type';
import { PayoutAggregation } from './domain/payout-aggregation.type';

@Injectable()
export class AggregationService {
  private readonly processedTransactions = new Set<string>();
  private readonly transactionApiRateLimit = 1000;
  private readonly transactionApiRateDelay = 12000;

  constructor(
    private readonly transactionService: TransactionService,
    private readonly aggregationCacheService: AggregationCacheService,
  ) {}

  async runAggregation(startDate: string, endDate: string) {
    let page = 1;
    let hasMore = true;
    let transactions: Transaction[] = [];

    while (hasMore) {
      const { items } = await this.transactionService.fetch({
        startDate,
        endDate,
        page,
        limit: this.transactionApiRateLimit,
      });

      transactions = transactions.concat(items);
      hasMore = items.length === this.transactionApiRateLimit;
      page++;

      if (hasMore) {
        await this.delay(this.transactionApiRateDelay);
      }
    }

    const aggregations = this.aggregate(transactions);

    await Promise.all([
      this.aggregationCacheService.cacheUserAggregations(aggregations),
      this.aggregationCacheService.cachePayoutAggregations(aggregations),
    ]);

    this.processedTransactions.clear();
  }

  private aggregate(transactions: Transaction[]): Map<string, Aggregation> {
    const aggregations = new Map<string, Aggregation>();

    transactions.forEach((transaction) => {
      if (this.processedTransactions.has(transaction.id)) return;
      this.processedTransactions.add(transaction.id);

      const aggregation = aggregations.get(transaction.userId) ?? {
        userId: transaction.userId,
        balance: 0,
        earned: 0,
        spent: 0,
        payout: 0,
        paid_out: 0,
      };

      switch (transaction.type) {
        case 'earned':
          aggregation.earned += transaction.amount;
          aggregation.balance += transaction.amount;
          break;
        case 'spent':
          aggregation.spent += transaction.amount;
          aggregation.balance -= transaction.amount;
          break;
        case 'payout':
          aggregation.payout += transaction.amount;
          break;
        case 'paid_out':
          aggregation.paid_out += transaction.amount;
          aggregation.balance -= transaction.amount;
      }

      aggregations.set(transaction.userId, aggregation);
    });

    return aggregations;
  }

  async fetchUserAggregation(userId: string): Promise<Aggregation | null> {
    return this.aggregationCacheService.fetchUserAggregation(userId);
  }

  async fetchPayoutAggregations(): Promise<PayoutAggregation[]> {
    return this.aggregationCacheService.fetchPayoutAggregations();
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
