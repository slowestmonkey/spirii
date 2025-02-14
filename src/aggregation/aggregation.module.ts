import { Module } from '@nestjs/common';
import { TransactionModule } from 'src/transaction/transaction.module';
import { AggregationController } from './aggregation.controller';
import { AggregationService } from './aggregation.service';

@Module({
  imports: [TransactionModule],
  controllers: [AggregationController],
  providers: [AggregationService],
  exports: [AggregationService],
})
export class AggregationModule {}
