import { Controller, Get, Param } from '@nestjs/common';
import { AggregationService } from './aggregation.service';
import { UserId } from './domain/user.type';

@Controller('aggregations')
export class AggregationController {
  constructor(private readonly aggregationService: AggregationService) {}

  @Get('users/:userId')
  async fetchUserAggregations(@Param('userId') userId: UserId) {
    return this.aggregationService.fetchUserAggregation(userId);
  }

  @Get('payouts')
  async fetchPayoutAggregations() {
    return this.aggregationService.fetchPayoutAggregations();
  }
}
