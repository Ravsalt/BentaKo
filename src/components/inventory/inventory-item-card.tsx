import React, { useState } from 'react';
import styled from 'styled-components';
import { FiEdit2, FiTrash2, FiX, FiSave } from 'react-icons/fi';
import type { InventoryItem } from '../../types/inventory';
import { useUpdateInventoryItem, useDeleteInventoryItem } from '../../hooks/useInventory';

// Styled Components
const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1rem;
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.small};
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  transform: translateY(0);

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const EditControls = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.25rem;
`;

const ControlButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.75rem;

  &.delete {
    background: ${({ theme }) => theme.colors.error};
  }
`;

const ItemImage = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const ItemName = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: ${({ theme }) => theme.colors.text};
`;

const ItemDescription = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 0.5rem;
`;

const ItemPrice = styled.div<{ isLowStock: boolean }>`
  color: ${({ theme, isLowStock }) => (isLowStock ? theme.colors.error : theme.colors.primary)};
  font-weight: 700;
  margin: 0.5rem 0;
  font-size: 1.1rem;
`;

const ItemStock = styled.div<{ isLowStock: boolean }>`
  font-size: 0.75rem;
  color: ${({ theme, isLowStock }) => (isLowStock ? theme.colors.error : theme.colors.textLight)};
  font-weight: ${({ isLowStock }) => (isLowStock ? 600 : 400)};
`;

const EditForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const EditButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const FormButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &.cancel {
    background: ${({ theme }) => theme.colors.textLight};
  }
  
  &.delete {
    background: ${({ theme }) => theme.colors.error};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.background};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  color: ${({ theme }) => theme.colors.text};
`;

const ModalTitle = styled.h3`
    margin-top: 0;
`;

const ModalButtonWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1.5rem;
`;

interface InventoryItemCardProps {
  item: InventoryItem;
  onUpdate: () => void;
}

const InventoryItemCard: React.FC<InventoryItemCardProps> = ({ item, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
    setEditedItem(prev => ({ ...prev, [name]: value }));
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

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteItem.mutateAsync(item.id);
      setShowDeleteModal(false);
      onUpdate();
    } catch (error) {
      console.error('Error deleting item:', error);
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
      <Card>
        <EditForm>
          <EditButtonGroup>
            <FormButton onClick={handleSave} disabled={updateItem.isPending}>
              <FiSave size={14} />
              {updateItem.isPending ? 'Saving...' : 'Save'}
            </FormButton>
            <FormButton className="cancel" onClick={() => setIsEditing(false)}>
              <FiX size={14} />
              Cancel
            </FormButton>
          </EditButtonGroup>
          <Input name="name" value={editedItem.name} onChange={handleInputChange} placeholder="Item name" />
          <Input name="description" value={editedItem.description} onChange={handleInputChange} placeholder="Description" />
          <Input type="number" name="price" value={editedItem.price} onChange={handleInputChange} placeholder="Price" />
          <Input type="number" name="stock" value={editedItem.stock} onChange={handleInputChange} placeholder="Stock" />
          <Input type="number" name="minStockLevel" value={editedItem.minStockLevel} onChange={handleInputChange} placeholder="Min Stock Level" />
          <Input name="image" value={editedItem.image} onChange={handleInputChange} placeholder="Emoji or image URL" />
        </EditForm>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <EditControls>
          <ControlButton onClick={() => setIsEditing(true)} title="Edit item">
            <FiEdit2 size={12} />
          </ControlButton>
          <ControlButton onClick={handleDeleteClick} className="delete" disabled={deleteItem.isPending} title="Delete item">
            {deleteItem.isPending ? '...' : <FiTrash2 size={12} />}
          </ControlButton>
        </EditControls>
        <ItemImage>{item.image || '📦'}</ItemImage>
        <ItemName>{item.name}</ItemName>
        {item.description && <ItemDescription>{item.description}</ItemDescription>}
        <ItemPrice isLowStock={item.stock <= (item.minStockLevel || 5)}>
          ₱{formatPrice(item.price)}
        </ItemPrice>
        <ItemStock isLowStock={item.stock <= (item.minStockLevel || 5)}>
          Stock: {item.stock}
          {item.minStockLevel !== undefined && item.stock <= item.minStockLevel && (
            <span style={{ marginLeft: '4px' }}>(Low Stock)</span>
          )}
        </ItemStock>
      </Card>

      {showDeleteModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Confirm Deletion</ModalTitle>
            <p>Are you sure you want to delete <strong>{item.name}</strong>?</p>
            <ModalButtonWrapper>
              <FormButton className="cancel" onClick={() => setShowDeleteModal(false)}>Cancel</FormButton>
              <FormButton className="delete" onClick={confirmDelete}>Delete</FormButton>
            </ModalButtonWrapper>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default InventoryItemCard;