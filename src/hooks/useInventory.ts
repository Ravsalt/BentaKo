import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import type { 
  InventoryItem, 
  CreateInventoryItem, 
  UpdateInventoryItem
} from '../types/inventory';
import {
  getInventoryItems,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  searchInventoryItems,
  checkLowStockItems,
} from '../services/inventoryService';

// Query keys
const INVENTORY_QUERY_KEYS = {
  all: ['inventory'],
  lists: () => [...INVENTORY_QUERY_KEYS.all, 'list'],
  list: (filters: any) => [...INVENTORY_QUERY_KEYS.lists(), { filters }],
  details: () => [...INVENTORY_QUERY_KEYS.all, 'detail'],
  detail: (id: string) => [...INVENTORY_QUERY_KEYS.details(), id],
  search: (query: string) => [...INVENTORY_QUERY_KEYS.all, 'search', query],
  lowStock: () => [...INVENTORY_QUERY_KEYS.all, 'low-stock'],
};

export const useInventoryList = () => {
  return useQuery<InventoryItem[]>({
    queryKey: INVENTORY_QUERY_KEYS.lists(),
    queryFn: getInventoryItems,
  });
};

export const useInventoryItem = (id: string) => {
  return useQuery<InventoryItem | undefined>({
    queryKey: INVENTORY_QUERY_KEYS.detail(id),
    queryFn: () => getInventoryItem(id),
    enabled: !!id,
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation<InventoryItem, Error, CreateInventoryItem>({
    mutationFn: createInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEYS.all });
      toast.success('Item created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Error creating item: ${error.message}`);
    },
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation<InventoryItem | undefined, Error, { id: string; data: UpdateInventoryItem }>({
    mutationFn: ({ id, data }) => updateInventoryItem(id, data).then(item => {
      if (!item) {
        throw new Error('Failed to update item');
      }
      return item;
    }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEYS.detail(variables.id) });
      toast.success('Item updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Error updating item: ${error.message}`);
    },
  });
};

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation<boolean, Error, string>({
    mutationFn: deleteInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEYS.all });
      toast.success('Item deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Error deleting item: ${error.message}`);
    },
  });
};

export const useSearchInventory = (query: string) => {
  return useQuery<InventoryItem[]>({
    queryKey: INVENTORY_QUERY_KEYS.search(query),
    queryFn: () => searchInventoryItems(query),
    enabled: query.length > 0,
  });
};
export const useLowStockItems = () => {
  return useQuery<InventoryItem[]>({
    queryKey: INVENTORY_QUERY_KEYS.lowStock(),
    queryFn: checkLowStockItems,
  });
};
