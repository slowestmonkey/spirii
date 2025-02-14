import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { AggregationModule } from './aggregation/aggregation.module';
import { JobModule } from './job/job.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    TransactionModule,
    JobModule,
    AggregationModule,
  ],
})
export class AppModule {}
