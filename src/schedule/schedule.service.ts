import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AggregationService } from 'src/aggregation/aggregation.service';

@Injectable()
export class ScheduleService {
  constructor(private readonly aggregationService: AggregationService) {}

  // @Cron('*/2 * * * *')
  @Cron('*/10 * * * * *')
  async handleCron() {
    const startDate = new Date().toISOString();
    const endDate = new Date().toISOString();

    await this.aggregationService.runAggregation(startDate, endDate);
  }
}
