export type DebtStatus = 'Paid' | 'Unpaid';

export interface Debt {
  id: string;
  debtor: string;
  amount: number;
  date: string;
  dueDate: string;
  description: string;
  status: DebtStatus;
  paidDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDebt {
  debtor: string;
  amount: number;
  date: string;
  dueDate: string;
  description: string;
  paidDate?: string;
  status: DebtStatus;
}

export type UpdateDebt = Partial<Omit<CreateDebt, 'date'>>;
