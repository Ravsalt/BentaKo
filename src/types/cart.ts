import type { InventoryItem } from './inventory';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
}

export interface ProductModalState {
  isOpen: boolean;
  product: InventoryItem | null;
  quantity: number;
}
