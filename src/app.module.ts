import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { AggregationModule } from './aggregation/aggregation.module';
import { ScheduleModule } from './schedule/schedule.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    TransactionModule,
    ScheduleModule,
    AggregationModule,
  ],
})
export class AppModule {}
