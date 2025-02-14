export type TransactionType = 'payout' | 'spent' | 'earned' | 'paid_out';

export type Transaction = {
  id: string;
  userId: string;
  createdAt: string;
  type: TransactionType;
  amount: number;
};
