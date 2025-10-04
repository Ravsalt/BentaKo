import { useQuery } from '@tanstack/react-query';
import { getSales } from '../services/salesService';
import type { Sale } from '../types/sales';

const SALES_QUERY_KEYS = {
  all: ['sales'],
  lists: () => [...SALES_QUERY_KEYS.all, 'list'],
};

export const useSalesList = () => {
  return useQuery<Sale[], Error>({
    queryKey: SALES_QUERY_KEYS.lists(),
    queryFn: getSales,
  });
};
