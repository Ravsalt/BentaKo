import React, { useRef } from "react";
import type { InventoryItem } from "../types/inventory";
import { useInventoryList } from "../hooks/useInventory";
import AddItemModal from "../components/add-item-modal";
import type { AddItemModalRef } from "../components/add-item-modal";
import InventoryItemCard from '../components/inventory/inventory-item-card';
import { FiPlusCircle } from "react-icons/fi";
import { AddItemButton } from "../components/layout/BottomBar";
import { InventoryWrapper, Header, Title, InventoryGrid } from './inventory/styles';
import { LoadingWrapper, Spinner, ErrorWrapper, ErrorIcon, ErrorMessage } from '../components/dashboard/styles';

const InventoryPage = () => {
  const { data: inventoryData, isLoading, error, refetch } = useInventoryList();
  const products = Array.isArray(inventoryData) ? inventoryData : [];
  const addItemModalRef = useRef<AddItemModalRef>(null);
  
  const handleItemUpdated = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <LoadingWrapper>
        <Spinner />
      </LoadingWrapper>
    );
  }

  if (error) {
    return (
      <ErrorWrapper>
        <ErrorIcon>
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </ErrorIcon>
        <ErrorMessage>
          Error loading inventory: {error.message}
        </ErrorMessage>
      </ErrorWrapper>
    );
  }

  return (
    <InventoryWrapper>
      <Header>
        <Title>Inventory</Title>
        <AddItemButton onClick={() => addItemModalRef.current?.show()}>
          <FiPlusCircle size={18} />
          <span>Add New Item</span>
        </AddItemButton>
      </Header>
      
      <InventoryGrid>
        {products.map((product: InventoryItem) => (
          <InventoryItemCard 
            key={product.id}
            item={product}
            onUpdate={handleItemUpdated}
          />
        ))}
      </InventoryGrid>

      <AddItemModal 
        ref={addItemModalRef}
        onItemAdded={handleItemUpdated}
      />
    </InventoryWrapper>
  );
};

export default InventoryPage;