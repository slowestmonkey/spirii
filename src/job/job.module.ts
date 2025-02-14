import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AggregationModule } from 'src/aggregation/aggregation.module';
import { JobService } from './job.service';

@Module({
  imports: [ScheduleModule.forRoot(), AggregationModule],
  providers: [JobService],
})
export class JobModule {}
