import { useState } from 'react';
import type { ProductModalState } from '../types/cart';
import type { InventoryItem } from '../types/inventory';

export const useProductModal = () => {
  const [productModal, setProductModal] = useState<ProductModalState>({
    isOpen: false,
    product: null,
    quantity: 1,
  });

  const openProductModal = (product: InventoryItem) => {
    console.log('Opening modal for product:', product.name);
    setProductModal({
      isOpen: true,
      product,
      quantity: 1,
    });
  };

  const closeProductModal = () => {
    setProductModal({
      isOpen: false,
      product: null,
      quantity: 1,
    });
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (productModal.product && newQuantity > productModal.product.stock) return;
    setProductModal(prev => ({
      ...prev,
      quantity: newQuantity,
    }));
  };

  return {
    productModal,
    openProductModal,
    closeProductModal,
    handleQuantityChange,
  };
};
