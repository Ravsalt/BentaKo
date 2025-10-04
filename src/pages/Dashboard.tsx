import React, { useState } from 'react';
import { FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiDollarSign } from 'react-icons/fi';
import { useInventoryList, useUpdateInventoryItem } from '../hooks/useInventory';
import ProductCard from '../components/dashboard/ProductCard';
import {
  CartButton, CartBadge, LoadingWrapper, Spinner, ErrorWrapper, ErrorIcon, ErrorMessage,
  CartSidebar, CartHeader, CartTitle, CloseButton, EmptyCartWrapper, CartItemsWrapper,
  CartItem, CartItemImage, CartItemDetails, CartItemName, CartItemPrice, QuantityControl,
  QuantityButton, RemoveButton, CartFooter, TotalWrapper, CheckoutButton,
  ModalOverlay, ModalContent, ModalCloseButton, ModalHeader, ModalImage, ModalTitle,
  ModalPrice, ModalStock, StockIndicator, ModalQuantityWrapper, ModalQuantityControl,
  ModalQuantityButton, ModalQuantityInputWrapper, ModalQuantityInput, ModalFooter,
  CancelButton, AddToCartButton,
  EmptyCartMessage, ModalQuantityDisplay, CustomAmountLabel
} from '../components/dashboard/styles';
import type { InventoryItem } from '../types/inventory';

import { toast } from 'react-hot-toast';
import { addSale } from '../services/salesService';

// Types
type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
};

type ProductModalState = {
  isOpen: boolean;
  product: InventoryItem | null;
  quantity: number;
};

// Safe price formatting function with additional checks
const formatPrice = (price: unknown): string => {
  try {
    if (price === null || price === undefined || price === '') return '0.00';
    const num = Number(price);
    if (isNaN(num)) return '0.00';
    return num.toFixed(2);
  } catch (error) {
    console.error('Error formatting price:', { price, error });
    return '0.00';
  }
};

const Dashboard = () => {
  const { data: inventoryData, isLoading, error } = useInventoryList();
  const products = Array.isArray(inventoryData) ? inventoryData : [];
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [productModal, setProductModal] = useState<ProductModalState>({
    isOpen: false,
    product: null,
    quantity: 1,
  });

  // Open product modal
  const openProductModal = (product: InventoryItem) => {
    console.log('Opening modal for product:', product.name);
    setProductModal({
      isOpen: true,
      product,
      quantity: 1,
    });
  };

  // Close product modal
  const closeProductModal = () => {
    setProductModal({
      isOpen: false,
      product: null,
      quantity: 1,
    });
  };

  // Handle quantity change in modal
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (productModal.product && newQuantity > productModal.product.stock) return;
    setProductModal(prev => ({
      ...prev,
      quantity: newQuantity,
    }));
  };

  // Add item to cart from modal
  const addToCartFromModal = () => {
    if (!productModal.product) return;
    
    const { product, quantity } = productModal;
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // If item exists, update quantity if stock allows
        const newQuantity = Math.min(existingItem.quantity + quantity, product.stock);
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        // Add new item to cart
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: product.price || 0,
            quantity: Math.min(quantity, product.stock),
            image: product.image || '📦',
            stock: product.stock || 0
          }
        ];
      }
    });
    
    toast.success(`${quantity}x ${product.name} added to cart`);
    closeProductModal();
  };
  
  // Quick add to cart (for single click add)
  const addToCart = (product: InventoryItem) => {
    openProductModal(product);
  };

  // Update item quantity in cart
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // Calculate total price
  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  const updateItemMutation = useUpdateInventoryItem();

  // Handle checkout
  const handleCheckout = async () => {
    if (cart.length === 0) return;

    try {
      addSale(cart);

      // Process each item in the cart
      const updatePromises = cart.map(cartItem => {
        // Find the original product to get current stock
        const product = products.find(p => p.id === cartItem.id);
        if (!product) return Promise.resolve();

        // Calculate new stock
        const newStock = (product.stock || 0) - cartItem.quantity;
        
        // Update the item with new stock
        return updateItemMutation.mutateAsync({
          id: cartItem.id,
          data: {
            ...product,
            stock: Math.max(0, newStock) // Ensure stock doesn't go below 0
          }
        });
      });

      // Wait for all updates to complete
      await Promise.all(updatePromises);
      
      // Show success message
      toast.success(`Successfully processed order for ₱${formatPrice(totalPrice)}`);
      
      // Clear the cart
      setCart([]);
      
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error('Failed to process order. Please try again.');
    }
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
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
      {/* Main Products Grid */}
      <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ margin: 0 }}>Dashboard</h1>
          <CartButton onClick={() => setIsCartOpen(!isCartOpen)}>
            <FiShoppingCart size={20} />
            <span>Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
            {cart.length > 0 && (
              <CartBadge>
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </CartBadge>
            )}
          </CartButton>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '1rem',
        }}>
          {products.map((product: InventoryItem) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => openProductModal(product)}
              isInCart={cart.some(item => item.id === product.id)}
            />
          ))}
        </div>
      </div>

      {/* Shopping Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen}>
        <div style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CartHeader>
            <CartTitle>Shopping Cart</CartTitle>
            <CloseButton onClick={() => setIsCartOpen(false)}>&times;</CloseButton>
          </CartHeader>

          {cart.length === 0 ? (
            <EmptyCartWrapper>
              <FiShoppingCart size={48} />
              <p>Your cart is empty</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Click on items to add them to your cart</p>
            </EmptyCartWrapper>
          ) : (
            <>
              <CartItemsWrapper>
                {cart.map(item => (
                  <CartItem key={item.id}>
                    <CartItemImage>{item.image}</CartItemImage>
                    <CartItemDetails>
                      <CartItemName>{item.name}</CartItemName>
                      <CartItemPrice>₱{formatPrice(item.price)}</CartItemPrice>
                    </CartItemDetails>
                    <QuantityControl>
                      <QuantityButton onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, item.quantity - 1); }}>
                        <FiMinus size={14} />
                      </QuantityButton>
                      <span>{item.quantity}</span>
                      <QuantityButton onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, item.quantity + 1); }} disabled={item.quantity >= item.stock}>
                        <FiPlus size={14} />
                      </QuantityButton>
                    </QuantityControl>
                    <RemoveButton onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}>
                      <FiTrash2 size={16} />
                    </RemoveButton>
                  </CartItem>
                ))}
              </CartItemsWrapper>

              <CartFooter>
                <TotalWrapper>
                  <span>Total:</span>
                  <span>₱{formatPrice(totalPrice)}</span>
                </TotalWrapper>
                <CheckoutButton onClick={handleCheckout} disabled={cart.length === 0}>
                  <FiDollarSign size={18} />
                  Checkout
                </CheckoutButton>
              </CartFooter>
            </>
          )}
        </div>
      </CartSidebar>

      {/* Product Modal */}
      {productModal.isOpen && productModal.product && (
        <ModalOverlay onClick={closeProductModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalCloseButton onClick={closeProductModal}>&times;</ModalCloseButton>

            <ModalHeader>
              <ModalImage>
                <span>{productModal.product.image || '📦'}</span>
              </ModalImage>
              <ModalTitle>{productModal.product.name}</ModalTitle>
              <ModalPrice>
                <span>₱</span>
                {formatPrice(productModal.product.price)}
              </ModalPrice>
              <ModalStock>
                <StockIndicator available={productModal.product.stock > 10} />
                {productModal.product.stock} available in stock
              </ModalStock>
            </ModalHeader>

            <ModalQuantityWrapper>
              <ModalQuantityControl>
                <ModalQuantityButton onClick={() => handleQuantityChange(productModal.quantity - 1)} disabled={productModal.quantity <= 1}>
                  -
                </ModalQuantityButton>
                <div style={{ minWidth: '60px', textAlign: 'center', fontSize: '1.25rem', fontWeight: 600 }}>
                  {productModal.quantity}
                </div>
                <ModalQuantityButton onClick={() => handleQuantityChange(productModal.quantity + 1)} disabled={productModal.quantity >= (productModal.product.stock || 0)}>
                  +
                </ModalQuantityButton>
              </ModalQuantityControl>
              <ModalQuantityInputWrapper>
                <span style={{ fontSize: '0.875rem', color: '#64748b', whiteSpace: 'nowrap' }}>Custom amount:</span>
                <ModalQuantityInput
                  type="number"
                  min="1"
                  max={productModal.product.stock || 1}
                  value={productModal.quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (!isNaN(value) && value > 0 && value <= (productModal.product?.stock || 1)) {
                      handleQuantityChange(value);
                    }
                  }}
                />
              </ModalQuantityInputWrapper>
            </ModalQuantityWrapper>

            <ModalFooter>
              <CancelButton onClick={closeProductModal}>Cancel</CancelButton>
              <AddToCartButton onClick={() => { addToCartFromModal(); closeProductModal(); }}>
                Add to Cart - ₱{formatPrice((productModal.product.price || 0) * productModal.quantity)}
              </AddToCartButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Overlay when cart is open */}
      {isCartOpen && (
        <div 
          onClick={() => setIsCartOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}
    </div>
  );
};
export default Dashboard;