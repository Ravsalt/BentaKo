import React, { forwardRef, useImperativeHandle, useState } from 'react';
import styled from 'styled-components';
import { FiX } from 'react-icons/fi';
import { useCreateInventoryItem } from '../hooks/useInventory';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const SubmitButton = styled.button`
  background: #4a90e2;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
  
  &:hover {
    background: #3a7bc8;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export interface AddItemModalRef {
  show: () => void;
}

interface AddItemModalProps {
  onItemAdded?: () => void;
}

interface FormData {
  name: string;
  price: string;
  stock: string;
  minStockLevel: string;
  image: string;
  description: string;
  category: string;
}

const initialFormData: FormData = {
  name: '',
  price: '',
  stock: '0',
  minStockLevel: '',
  image: '',
  description: '',
  category: '',
};

const AddItemModal = forwardRef<AddItemModalRef, AddItemModalProps>(({ onItemAdded }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const createItem = useCreateInventoryItem();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue = value;
    
    // Handle number inputs
    if (type === 'number') {
      // Allow empty string or valid numbers
      if (value === '') {
        processedValue = '';
      } else {
        const numValue = parseFloat(value);
        // Only update if it's a valid number
        if (!isNaN(numValue)) {
          processedValue = Math.max(0, numValue).toString();
        } else {
          // If not a valid number, keep the previous value
          return;
        }
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };
  
  useImperativeHandle(ref, () => ({
    show: () => setIsOpen(true)
  }));
  
  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.price || formData.stock === '') {
      console.error('Please fill in all required fields');
      return;
    }

    // Parse numeric values with proper null/undefined handling
    const price = parseFloat(formData.price) || 0;
    const stock = parseInt(formData.stock, 10) || 0;
    const minStockLevel = formData.minStockLevel ? parseInt(formData.minStockLevel, 10) : 0;
    
    try {
      await createItem.mutateAsync({
        name: formData.name,
        price: price,
        stock: stock,
        minStockLevel: minStockLevel,
        image: formData.image || undefined,
        description: formData.description || '',
        category: formData.category || '',
      });
      
      // Reset form
      resetForm();
      
      // Call onItemAdded callback if provided
      if (onItemAdded) {
        onItemAdded();
      }
      
      // Close the modal
      handleClose();
    } catch (err) {
      console.error('Error adding item:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={handleClose} aria-label="Close modal">
          <FiX />
        </CloseButton>
        <h2>Add New Item</h2>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Item Name *</Label>
            <Input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleInputChange}
              required 
              placeholder="e.g., Coke 1.5L" 
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <Input 
              type="text" 
              id="description" 
              name="description" 
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of the item" 
            />
          </FormGroup>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormGroup>
              <Label htmlFor="price">Price (₱) *</Label>
              <Input 
                type="number" 
                id="price" 
                name="price" 
                value={formData.price}
                onChange={handleInputChange}
                step="0.01" 
                min="0" 
                required 
                placeholder="0.00" 
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="stock">Initial Stock *</Label>
              <Input 
                type="number" 
                id="stock" 
                name="stock" 
                value={formData.stock}
                onChange={handleInputChange}
                min="0" 
                required 
                placeholder="0" 
              />
            </FormGroup>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormGroup>
              <Label htmlFor="category">Category</Label>
              <Input 
                type="text" 
                id="category" 
                name="category" 
                placeholder="e.g., Beverages" 
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="barcode">Barcode</Label>
              <Input 
                type="text" 
                id="barcode" 
                name="barcode" 
                placeholder="Optional barcode" 
              />
            </FormGroup>
          </div>

          <FormGroup>
            <Label htmlFor="minStockLevel">Minimum Stock Level</Label>
            <Input 
              type="number" 
              id="minStockLevel" 
              name="minStockLevel" 
              value={formData.minStockLevel}
              onChange={handleInputChange}
              min="0" 
              placeholder="5" 
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="image">Emoji or Image URL</Label>
            <Input 
              type="text" 
              id="image" 
              name="image" 
              value={formData.image}
              onChange={handleInputChange}
              placeholder="e.g., 🥤 or https://..." 
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={createItem.isPending}>
            {createItem.isPending ? 'Adding...' : 'Add Item'}
          </SubmitButton>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
});

AddItemModal.displayName = 'AddItemModal';

export default AddItemModal;
