import { UserId } from 'src/aggregation/domain/user.type';

export type TransactionType = 'payout' | 'spent' | 'earned' | 'paid_out';

export type Transaction = {
  id: string;
  userId: UserId;
  createdAt: string;
  type: TransactionType;
  amount: number;
};
