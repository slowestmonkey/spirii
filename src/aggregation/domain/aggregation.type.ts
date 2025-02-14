import { UserId } from './user.type';

export type Aggregation = {
  userId: UserId;
  balance: number;
  earned: number;
  spent: number;
  payout: number;
  paid_out: number;
};
