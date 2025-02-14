import { Module } from '@nestjs/common';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { AggregationModule } from 'src/aggregation/aggregation.module';
import { ScheduleService } from './schedule.service';

@Module({
  imports: [NestScheduleModule.forRoot(), AggregationModule],
  providers: [ScheduleService],
})
export class ScheduleModule {}
