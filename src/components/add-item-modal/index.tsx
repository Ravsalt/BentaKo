import React, { useState } from 'react';
import { FiX, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
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

// Validation message component
const ValidationMessage = ({ message, type = 'error' }: { message: string; type?: 'error' | 'success' }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '0.5rem',
    fontSize: '0.875rem',
    color: type === 'error' ? '#dc2626' : '#16a34a',
  }}>
    {type === 'error' ? <FiAlertCircle size={16} /> : <FiCheckCircle size={16} />}
    <span>{message}</span>
  </div>
);

// Stock level indicator
const StockLevelIndicator = ({ stock, minLevel }: { stock: number; minLevel: number }) => {
  if (stock === 0) {
    return <span style={{ color: '#dc2626', fontSize: '0.875rem' }}>⚠️ Out of stock</span>;
  }
  if (stock < minLevel) {
    return <span style={{ color: '#ea580c', fontSize: '0.875rem' }}>⚠️ Below minimum level</span>;
  }
  if (stock >= minLevel * 2) {
    return <span style={{ color: '#16a34a', fontSize: '0.875rem' }}>✅ Well stocked</span>;
  }
  return <span style={{ color: '#ca8a04', fontSize: '0.875rem' }}>📊 Adequate stock</span>;
};

const AddItemModal: React.ForwardRefRenderFunction<AddItemModalRef, Omit<AddItemModalProps, 'ref'>> = ({ onItemAdded }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    minStockLevel: 5,
    image: '📦',
    category: 'uncategorized', // or another default category
  });

  const createItem = useCreateInventoryItem();

  React.useImperativeHandle(ref, () => ({
    show: () => setIsOpen(true),
    hide: () => setIsOpen(false),
  }));

  // Validation function
  const validateField = (name: string, value: any) => {
    switch (name) {
      case 'name':
        if (!value || value.trim() === '') {
          return 'Item name is required';
        }
        if (value.length < 2) {
          return 'Item name must be at least 2 characters';
        }
        if (value.length > 100) {
          return 'Item name must be less than 100 characters';
        }
        break;
      case 'price':
        if (value < 0) {
          return 'Price cannot be negative';
        }
        if (value === 0) {
          return 'Please enter a valid price';
        }
        break;
      case 'stock':
        if (value < 0) {
          return 'Stock cannot be negative';
        }
        break;
      case 'minStockLevel':
        if (value < 0) {
          return 'Minimum stock level cannot be negative';
        }
        if (value > 1000) {
          return 'Minimum stock level seems too high';
        }
        break;
    }
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newValue = name === 'price' || name === 'stock' || name === 'minStockLevel'
      ? Number(value) || 0
      : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    // Validate on change if field was touched
    if (touched[name]) {
      const error = validateField(name, newValue);
      setErrors(prev => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, name === 'price' || name === 'stock' || name === 'minStockLevel' 
      ? Number(value) 
      : value);
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) {
        newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createItem.mutateAsync(formData);
      onItemAdded();
      handleClose();
    } catch (error) {
      console.error('Error adding item:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to add item. Please try again.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setErrors({});
    setTouched({});
  };

  if (!isOpen) return null;

  const hasErrors = Object.values(errors).some(error => error !== '');
  const estimatedValue = formData.stock * formData.price;

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <ModalContent>
        <ModalHeader>
          <div>
            <ModalTitle>📦 Add New Item</ModalTitle>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
              Fill in the details below to add a new item to your inventory
            </p>
          </div>
          <CloseButton onClick={handleClose}>
            <FiX size={20} />
          </CloseButton>
        </ModalHeader>
        
        <Form onSubmit={handleSubmit}>
          {errors.submit && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
            }}>
              <ValidationMessage message={errors.submit} type="error" />
            </div>
          )}

          <FormGroup>
            <Label htmlFor="name">
              Item Name <span style={{ color: '#dc2626' }}>*</span>
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="e.g., Rice, Noodles"
              required
              style={errors.name && touched.name ? { borderColor: '#dc2626' } : {}}
            />
            {errors.name && touched.name && (
              <ValidationMessage message={errors.name} type="error" />
            )}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Add details about this item (optional)"
              rows={3}
            />
            <HelpText>Help your team identify this item quickly</HelpText>
          </FormGroup>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormGroup>
              <Label htmlFor="price">
                Price (₱) <span style={{ color: '#dc2626' }}>*</span>
              </Label>
              <Input
                type="number"
                id="price"
                name="price"
                value={formData.price || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
                style={errors.price && touched.price ? { borderColor: '#dc2626' } : {}}
              />
              {errors.price && touched.price && (
                <ValidationMessage message={errors.price} type="error" />
              )}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="stock">
                Initial Stock <span style={{ color: '#dc2626' }}>*</span>
              </Label>
              <Input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="0"
                min="0"
                required
                style={errors.stock && touched.stock ? { borderColor: '#dc2626' } : {}}
              />
              {errors.stock && touched.stock ? (
                <ValidationMessage message={errors.stock} type="error" />
              ) : formData.stock > 0 && (
                <StockLevelIndicator stock={formData.stock} minLevel={formData.minStockLevel} />
              )}
            </FormGroup>
          </div>
          
          <FormGroup>
            <Label htmlFor="minStockLevel">
              Minimum Stock Level <span style={{ color: '#dc2626' }}>*</span>
            </Label>
            <Input
              type="number"
              id="minStockLevel"
              name="minStockLevel"
              value={formData.minStockLevel || ''}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="5"
              min="0"
              required
              style={errors.minStockLevel && touched.minStockLevel ? { borderColor: '#dc2626' } : {}}
            />
            {errors.minStockLevel && touched.minStockLevel ? (
              <ValidationMessage message={errors.minStockLevel} type="error" />
            ) : (
              <HelpText>You'll be alerted when stock falls below this level</HelpText>
            )}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="image">Item Icon</Label>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(50px, 1fr))', 
              gap: '0.5rem',
              padding: '1rem',
              backgroundColor: '#f9fafb',
              borderRadius: '0.5rem',
              marginBottom: '0.75rem'
            }}>
              {['🍚', '🥫', '🍜', '☕', '🧃', '🍫', '🍪', '🧼', '🧻', '🥚', '🧂', '🧴', '🍞', '🥛', '💊', '🔋'].map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, image: emoji }))}
                  style={{
                    fontSize: '2rem',
                    padding: '0.75rem',
                    backgroundColor: formData.image === emoji ? '#dbeafe' : '#ffffff',
                    border: formData.image === emoji ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (formData.image !== emoji) {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (formData.image !== emoji) {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <Input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="Or paste a custom emoji"
              style={{ marginTop: '0.5rem' }}
            />
            <HelpText>Click an icon above or enter your own emoji</HelpText>
          </FormGroup>

          {formData.price > 0 && formData.stock > 0 && (
            <div style={{
              padding: '1rem',
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '0.5rem',
              marginTop: '1rem',
            }}>
              <p style={{ fontSize: '0.875rem', color: '#0369a1', margin: 0 }}>
                <strong>💡 Inventory Value:</strong> ₱{estimatedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#0284c7', margin: '0.25rem 0 0 0' }}>
                Based on {formData.stock} {formData.stock === 1 ? 'unit' : 'units'} at ₱{formData.price.toFixed(2)} each
              </p>
            </div>
          )}
          
          <FormActions style={{ marginTop: '1.5rem' }}>
            <Button 
              type="button" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              disabled={isSubmitting || hasErrors}
              style={isSubmitting || hasErrors ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
            >
              {isSubmitting ? '💾 Saving...' : '✨ Add Item'}
            </Button>
          </FormActions>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default React.forwardRef(AddItemModal);