import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AggregationService } from 'src/aggregation/aggregation.service';

@Injectable()
export class JobService {
  constructor(private readonly aggregationService: AggregationService) {}

  @Cron('*/10 * * * * *')
  async runJob() {
    const startDate = new Date().toISOString();
    const endDate = new Date().toISOString();

    await this.aggregationService.runAggregation(startDate, endDate);
  }
}
