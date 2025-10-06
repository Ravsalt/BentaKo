import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiDollarSign, FiSearch } from 'react-icons/fi';
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
  const allProducts = Array.isArray(inventoryData) ? inventoryData : [];
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input with Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        setSearchQuery('');
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounce search
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter products based on search query
  const products = allProducts.filter(product => 
    debouncedQuery === '' || 
    product.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(debouncedQuery.toLowerCase()))
  );
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
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h1 style={{ margin: 0, color: '#2c3e50' }}>Dashboard</h1>
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
            position: 'relative', 
            maxWidth: '500px', 
            margin: '0 auto',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ position: 'relative' }}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'relative',
                  boxShadow: isSearchFocused ? '0 4px 20px rgba(59, 130, 246, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <FiSearch 
                    style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: isSearchFocused ? '#3b82f6' : '#94a3b8',
                      transition: 'all 0.2s ease',
                      zIndex: 1,
                    }}
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem 0.85rem 3rem',
                      border: 'none',
                      fontSize: '0.95rem',
                      color: '#1e293b',
                      backgroundColor: isSearchFocused ? '#ffffff' : '#f8fafc',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      borderRadius: '12px',
                      outline: 'none',
                    }}
                  />
                  <AnimatePresence>
                    {searchQuery && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                        onClick={() => {
                          setSearchQuery('');
                          searchInputRef.current?.focus();
                        }}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'transparent',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          padding: '4px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.color = '#ef4444')}
                        onMouseOut={(e) => (e.currentTarget.style.color = '#94a3b8')}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
                
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                  transform: isSearchFocused ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'left center',
                  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }} />
              </motion.div>
              
              <div style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                pointerEvents: 'none',
                opacity: isSearchFocused ? 0 : 1,
                transition: 'opacity 0.2s ease',
              }}>
                <span style={{
                  fontSize: '0.7rem',
                  backgroundColor: '#e2e8f0',
                  color: '#64748b',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                }}>
                  {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
                </span>
                <span style={{
                  fontSize: '0.7rem',
                  backgroundColor: '#e2e8f0',
                  color: '#64748b',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                }}>
                  K
                </span>
              </div>
            </div>
            
            <AnimatePresence>
              {searchQuery && products.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    right: 0,
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    padding: '1rem',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    zIndex: 50,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '1.5rem 0',
                    color: '#64748b',
                  }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '0.75rem' }}>
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      <line x1="11" y1="8" x2="11" y2="14"></line>
                      <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                    <p style={{ margin: '0.25rem 0', fontWeight: 500, color: '#334155' }}>No results found</p>
                    <p style={{ margin: 0, fontSize: '0.9rem', textAlign: 'center' }}>We couldn't find any products matching "{searchQuery}"</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '1rem',
        }}>
          {products.length === 0 && !searchQuery ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ 
                gridColumn: '1 / -1', 
                textAlign: 'center', 
                padding: '3rem 2rem',
                color: '#64748b',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                </svg>
              </div>
              <h3 style={{ margin: 0, color: '#334155', fontSize: '1.25rem', fontWeight: 600 }}>No products available</h3>
              <p style={{ margin: 0, maxWidth: '400px' }}>There are currently no products in your inventory. Add some products to get started.</p>
            </motion.div>
          ) : products.length === 0 && searchQuery ? (
            <div style={{ gridColumn: '1 / -1' }}></div>
          ) : (
            products.map((product: InventoryItem) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => openProductModal(product)}
                isInCart={cart.some(item => item.id === product.id)}
              />
            ))
          )}
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