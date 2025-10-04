export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
};

export interface Sale extends CartItem {
  date: string;
}
