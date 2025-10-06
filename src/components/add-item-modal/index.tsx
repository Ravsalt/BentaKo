import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useCreateInventoryItem } from '../../hooks/useInventory';
import type { InventoryItem } from '../../types/inventory';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  Form,
  FormGroup,
  Label,
  Input,
  TextArea,
  FormActions,
  Button,
  HelpText
} from './styles';

export type AddItemModalRef = {
  show: () => void;
  hide: () => void;
};

interface AddItemModalProps {
  onItemAdded: () => void;
  ref: React.RefObject<AddItemModalRef>;
}

const AddItemModal: React.ForwardRefRenderFunction<AddItemModalRef, Omit<AddItemModalProps, 'ref'>> = ({ onItemAdded }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    minStockLevel: 5,
    image: '📦',
  });

  const createItem = useCreateInventoryItem();

  React.useImperativeHandle(ref, () => ({
    show: () => setIsOpen(true),
    hide: () => setIsOpen(false),
  }));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' || name === 'minStockLevel'
        ? Number(value) || 0
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await createItem.mutateAsync(formData);
      onItemAdded();
      setIsOpen(false);
      setFormData({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        minStockLevel: 5,
        image: '📦',
      });
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Add New Item</ModalTitle>
          <CloseButton onClick={() => setIsOpen(false)}>
            <FiX size={20} />
          </CloseButton>
        </ModalHeader>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Item Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter item name"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter item description"
            />
          </FormGroup>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormGroup>
              <Label htmlFor="price">Price (₱)</Label>
              <Input
                type="number"
                id="price"
                name="price"
                value={formData.price || ''}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="stock">Stock</Label>
              <Input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock || ''}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                required
              />
            </FormGroup>
          </div>
          
          <FormGroup>
            <Label htmlFor="minStockLevel">Minimum Stock Level</Label>
            <Input
              type="number"
              id="minStockLevel"
              name="minStockLevel"
              value={formData.minStockLevel || ''}
              onChange={handleInputChange}
              placeholder="5"
              min="0"
              required
            />
            <HelpText>Receive alerts when stock falls below this level</HelpText>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="image">Emoji or Image URL</Label>
            <Input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="Paste an emoji or image URL"
            />
            <HelpText>Use an emoji (e.g., 📦) or paste an image URL</HelpText>
          </FormGroup>
          
          <FormActions>
            <Button 
              type="button" 
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Item'}
            </Button>
          </FormActions>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default React.forwardRef(AddItemModal);
