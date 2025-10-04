import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import type { Debt, CreateDebt, UpdateDebt } from '../types/debt';
import {
  getDebts,
  getDebt,
  createDebt,
  updateDebt,
  deleteDebt,
  searchDebts,
} from '../services/debtService';

// Query keys
const DEBT_QUERY_KEYS = {
  all: ['debts'],
  lists: () => [...DEBT_QUERY_KEYS.all, 'list'],
  list: (filters: any) => [...DEBT_QUERY_KEYS.lists(), { filters }],
  details: () => [...DEBT_QUERY_KEYS.all, 'detail'],
  detail: (id: string) => [...DEBT_QUERY_KEYS.details(), id],
  search: (query: string) => [...DEBT_QUERY_KEYS.all, 'search', query],
};

export const useDebtList = () => {
  return useQuery<Debt[]>({
    queryKey: DEBT_QUERY_KEYS.lists(),
    queryFn: getDebts,
  });
};

export const useDebt = (id: string) => {
  return useQuery<Debt | undefined>({
    queryKey: DEBT_QUERY_KEYS.detail(id),
    queryFn: () => getDebt(id),
    enabled: !!id,
  });
};

export const useCreateDebt = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Debt, Error, CreateDebt>({
    mutationFn: createDebt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEBT_QUERY_KEYS.all });
      toast.success('Debt created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create debt: ${error.message}`);
    },
  });
};

export const useUpdateDebt = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Debt | undefined, Error, { id: string; data: UpdateDebt }>({
    mutationFn: ({ id, data }) => updateDebt(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: DEBT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: DEBT_QUERY_KEYS.detail(id) });
      toast.success('Debt updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update debt: ${error.message}`);
    },
  });
};

export const useDeleteDebt = () => {
  const queryClient = useQueryClient();
  
  return useMutation<boolean, Error, string>({
    mutationFn: deleteDebt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEBT_QUERY_KEYS.all });
      toast.success('Debt deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete debt: ${error.message}`);
    },
  });
};

export const useSearchDebts = (query: string) => {
  return useQuery<Debt[]>({
    queryKey: DEBT_QUERY_KEYS.search(query),
    queryFn: () => searchDebts(query),
    enabled: query.length > 0,
  });
};
