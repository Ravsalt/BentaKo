export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
  barcode?: string;
  minStockLevel: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateInventoryItem = Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateInventoryItem = Partial<CreateInventoryItem>;
