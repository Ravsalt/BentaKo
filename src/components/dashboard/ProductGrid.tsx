import ProductCard from './ProductCard';
import { EmptyState } from './EmptyState';
import type { InventoryItem } from '../../types/inventory';
import type { CartItem } from '../../types/cart';

interface ProductGridProps {
  products: InventoryItem[];
  searchQuery: string;
  cart: CartItem[];
  onProductClick: (product: InventoryItem) => void;
}

export const ProductGrid = ({ products, searchQuery, cart, onProductClick }: ProductGridProps) => {
  if (products.length === 0 && !searchQuery) {
    return <EmptyState />;
  }

  if (products.length === 0 && searchQuery) {
    return <div style={{ gridColumn: '1 / -1' }}></div>;
  }

  return (
    <>
      {products.map((product: InventoryItem) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onProductClick(product)}
          isInCart={cart.some(item => item.id === product.id)}
        />
      ))}
    </>
  );
};
