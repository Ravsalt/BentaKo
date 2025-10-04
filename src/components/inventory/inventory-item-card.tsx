import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiX, FiSave } from 'react-icons/fi';
import { theme } from '../../theme';
import type { InventoryItem } from '../../types/inventory';
import { useUpdateInventoryItem, useDeleteInventoryItem } from '../../hooks/useInventory';

interface InventoryItemCardProps {
  item: InventoryItem;
  onUpdate: () => void;
}

const InventoryItemCard: React.FC<InventoryItemCardProps> = ({ item, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price?.toString() || '0',
    stock: item?.stock?.toString() || '0',
    minStockLevel: item?.minStockLevel?.toString() || '',
    image: item?.image || '',
  });

  const updateItem = useUpdateInventoryItem();
  const deleteItem = useDeleteInventoryItem();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const price = editedItem.price ? parseFloat(editedItem.price) : 0;
      const stock = editedItem.stock ? parseInt(editedItem.stock, 10) : 0;
      const minStockLevel = editedItem.minStockLevel ? parseInt(editedItem.minStockLevel, 10) : 0;

      await updateItem.mutateAsync({
        id: item.id,
        data: {
          name: editedItem.name,
          description: editedItem.description,
          price: isNaN(price) ? 0 : price,
          stock: isNaN(stock) ? 0 : stock,
          minStockLevel: isNaN(minStockLevel) ? 0 : minStockLevel,
          image: editedItem.image || undefined,
        }
      });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      try {
        await deleteItem.mutateAsync(item.id);
        onUpdate();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const formatPrice = (price: unknown): string => {
    try {
      if (price === null || price === undefined || price === '') return '0.00';
      const num = Number(price);
      return isNaN(num) ? '0.00' : num.toFixed(2);
    } catch (error) {
      console.error('Error formatting price:', { price, error });
      return '0.00';
    }
  };

  if (isEditing) {
    return (
      <div style={{
        background: 'white',
        borderRadius: theme.borderRadius,
        padding: '1rem',
        boxShadow: theme.shadows.small,
        position: 'relative',
      }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <button 
            onClick={handleSave}
            disabled={updateItem.isPending}
            style={{
              background: theme.colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '0.25rem 0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <FiSave size={14} />
            {updateItem.isPending ? 'Saving...' : 'Save'}
          </button>
          <button 
            onClick={() => setIsEditing(false)}
            style={{
              background: theme.colors.error,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '0.25rem 0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <FiX size={14} />
            Cancel
          </button>
        </div>
        
        <div style={{ marginBottom: '0.75rem' }}>
          <input
            type="text"
            name="name"
            value={editedItem.name}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: `1px solid #e2e8f0`,
              borderRadius: '4px',
              marginBottom: '0.5rem',
            }}
            placeholder="Item name"
          />
          <input
            type="text"
            name="description"
            value={editedItem.description}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: `1px solid #e2e8f0`,
              borderRadius: '4px',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
            }}
            placeholder="Description"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div>
            <input
              type="number"
              name="price"
              value={editedItem.price}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: `1px solid #e2e8f0`,
                borderRadius: '4px',
              }}
              placeholder="Price"
            />
          </div>
          <div>
            <input
              type="number"
              name="stock"
              value={editedItem.stock}
              onChange={handleInputChange}
              min="0"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: `1px solid #e2e8f0`,
                borderRadius: '4px',
              }}
              placeholder="Stock"
            />
          </div>
        </div>

        <div style={{ marginBottom: '0.75rem' }}>
          <input
            type="number"
            name="minStockLevel"
            value={editedItem.minStockLevel}
            onChange={handleInputChange}
            min="1"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: `1px solid #e2e8f0`,
              borderRadius: '4px',
            }}
            placeholder="Min Stock Level"
          />
        </div>

        <div>
          <input
            type="text"
            name="image"
            value={editedItem.image}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: `1px solid #e2e8f0`,
              borderRadius: '4px',
              fontSize: '0.875rem',
            }}
            placeholder="Emoji or image URL"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'white',
        borderRadius: theme.borderRadius,
        padding: '1rem',
        textAlign: 'center',
        boxShadow: theme.shadows.small,
        transition: 'transform 0.2s, box-shadow 0.2s',
        position: 'relative',
        transform: 'translateY(0)',
        ':hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows.medium,
        }
      } as React.CSSProperties}
    >
      <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', gap: '0.25rem' }}>
        <button
          onClick={() => setIsEditing(true)}
          style={{
            background: theme.colors.primary,
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '0.75rem',
          }}
          title="Edit item"
        >
          <FiEdit2 size={12} />
        </button>
        <button
          onClick={handleDelete}
          style={{
            background: theme.colors.error,
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '0.75rem',
          }}
          disabled={deleteItem.isPending}
          title="Delete item"
        >
          {deleteItem.isPending ? '...' : <FiTrash2 size={12} />}
        </button>
      </div>

      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
        {item.image || '📦'}
      </div>
      <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{item.name}</div>
      {item.description && (
        <div style={{ fontSize: '0.75rem', color: theme.colors.textLight, marginBottom: '0.5rem' }}>
          {item.description}
        </div>
      )}
      <div style={{
        color: item.stock <= (item.minStockLevel || 5)
          ? theme.colors.error
          : theme.colors.primary,
        fontWeight: 700,
        margin: '0.5rem 0',
        fontSize: '1.1rem'
      }}>
        ₱{formatPrice(item.price)}
      </div>
      <div style={{
        fontSize: '0.75rem',
        color: item.stock <= (item.minStockLevel || 5)
          ? theme.colors.error
          : theme.colors.textLight,
        fontWeight: item.stock <= (item.minStockLevel || 5) ? 600 : 400,
      }}>
        Stock: {item.stock}
        {item.minStockLevel !== undefined && item.stock <= item.minStockLevel && (
          <span style={{ marginLeft: '4px' }}>(Low Stock)</span>
        )}
      </div>
    </div>
  );
};

export default InventoryItemCard;
