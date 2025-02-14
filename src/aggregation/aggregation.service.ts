import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Transaction } from 'src/transaction/domain/transaction.type';
import { TransactionService } from 'src/transaction/transaction.service';
import { Aggregation } from './domain/aggregation.type';
import { PayoutAggregation } from './domain/payout-aggregation.type';

@Injectable()
export class AggregationService {
  private readonly userAggregationCacheKey = 'user_aggregation';
  private readonly payoutAggregationCacheKey = 'payout_aggregations';

  private readonly processedTransactions = new Set<string>();

  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private readonly transactionService: TransactionService,
  ) {}

  async runAggregation(startDate: string, endDate: string) {
    const transactions = await this.transactionService.fetch({
      startDate,
      endDate,
      page: 1,
      limit: 1000,
    });

    const userAggregations = this.aggregate(transactions.items);

    await Promise.all([
      this.cacheUserAggregations(userAggregations),
      this.cachePayoutAggregations(userAggregations),
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

  private async cacheUserAggregations(aggregations: Map<string, Aggregation>) {
    await Promise.all(
      Array.from(aggregations.entries()).map(async ([userId, aggregation]) => {
        const cacheKey = `${this.userAggregationCacheKey}_${userId}`;

        await this.cache.set(cacheKey, aggregation);
      }),
    );
  }

  private async cachePayoutAggregations(
    aggregations: Map<string, Aggregation>,
  ) {
    const payoutsAggregations =
      (await this.cache.get<PayoutAggregation[]>(
        this.payoutAggregationCacheKey,
      )) ?? [];

    for (const [userId, userAggregation] of aggregations) {
      if (userAggregation.payout > 0) {
        payoutsAggregations.push({ userId, payout: userAggregation.payout });
      }
    }

    await this.cache.set(this.payoutAggregationCacheKey, payoutsAggregations);
  }

  async fetchUserAggregation(userId: string): Promise<Aggregation | null> {
    return this.cache.get(`${this.userAggregationCacheKey}_${userId}`);
  }

  async fetchPayoutAggregations(): Promise<PayoutAggregation[]> {
    const payoutAggregations = await this.cache.get<PayoutAggregation[]>(
      this.payoutAggregationCacheKey,
    );

    return payoutAggregations ?? [];
  }
}
