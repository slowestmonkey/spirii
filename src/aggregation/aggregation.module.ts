import { Module } from '@nestjs/common';
import { TransactionModule } from 'src/transaction/transaction.module';
import { AggregationCacheService } from './aggregation-cache.service';
import { AggregationController } from './aggregation.controller';
import { AggregationService } from './aggregation.service';

@Module({
  imports: [TransactionModule],
  controllers: [AggregationController],
  providers: [AggregationService, AggregationCacheService],
  exports: [AggregationService],
})
export class AggregationModule {}
