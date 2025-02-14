import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Aggregation } from './domain/aggregation.type';
import { PayoutAggregation } from './domain/payout-aggregation.type';

@Injectable()
export class AggregationCacheService {
  private readonly userAggregationCacheKey = 'user_aggregation';
  private readonly payoutAggregationsCacheKey = 'payout_aggregations';

  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async cacheUserAggregations(aggregations: Map<string, Aggregation>) {
    await Promise.all(
      Array.from(aggregations.entries()).map(async ([userId, aggregation]) => {
        const cacheKey = `${this.userAggregationCacheKey}_${userId}`;

        await this.cache.set(cacheKey, aggregation);
      }),
    );
  }

  async cachePayoutAggregations(aggregations: Map<string, Aggregation>) {
    const payoutAggregations =
      (await this.cache.get<PayoutAggregation[]>(
        this.payoutAggregationsCacheKey,
      )) ?? [];

    for (const [userId, userAggregation] of aggregations) {
      if (userAggregation.payout > 0) {
        payoutAggregations.push({ userId, payout: userAggregation.payout });
      }
    }

    await this.cache.set(this.payoutAggregationsCacheKey, payoutAggregations);
  }

  async fetchUserAggregation(userId: string): Promise<Aggregation | null> {
    return this.cache.get(`${this.userAggregationCacheKey}_${userId}`);
  }

  async fetchPayoutAggregations(): Promise<PayoutAggregation[]> {
    const payoutAggregations = await this.cache.get<PayoutAggregation[]>(
      this.payoutAggregationsCacheKey,
    );

    return payoutAggregations ?? [];
  }
}
