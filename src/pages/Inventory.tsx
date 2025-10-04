import React, { useRef } from "react";
import type { InventoryItem } from "../types/inventory";
import { useInventoryList } from "../hooks/useInventory";
import AddItemModal from "../components/add-item-modal";
import type { AddItemModalRef } from "../components/add-item-modal";
// Using kebab-case for the file name
import InventoryItemCard from '../components/inventory/inventory-item-card';
import { FiPlusCircle } from "react-icons/fi";
import { AddItemButton } from "../components/layout/BottomBar";
const InventoryPage = () => {
  const { data: inventoryData, isLoading, error, refetch } = useInventoryList();
  const products = Array.isArray(inventoryData) ? inventoryData : [];
  const addItemModalRef = useRef<AddItemModalRef>(null);
  
  const handleItemUpdated = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Error loading inventory: {error.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>Inventory</h1>
        <AddItemButton 
          onClick={() => addItemModalRef.current?.show()}
          style={{ margin: 0 }}
        >
          <FiPlusCircle size={18} />
          <span>Add New Item</span>
        </AddItemButton>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
        gap: '1.25rem',
      }}>
        {products.map((product: InventoryItem) => (
          <InventoryItemCard 
            key={product.id}
            item={product}
            onUpdate={handleItemUpdated}
          />
        ))}
      </div>

      <AddItemModal 
        ref={addItemModalRef}
        onItemAdded={handleItemUpdated}
      />
    </div>
  );
};

export default InventoryPage;