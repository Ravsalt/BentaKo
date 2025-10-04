import React, { useState } from 'react';
import { FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiDollarSign } from 'react-icons/fi';
import { useInventoryList, useUpdateInventoryItem } from '../hooks/useInventory';
import type { InventoryItem } from '../types/inventory';
import { theme } from '../theme';
import { toast } from 'react-hot-toast';

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
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
      {/* Main Products Grid */}
      <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ margin: 0 }}>Dashboard
          </h1>
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: theme.colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: theme.borderRadius,
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <FiShoppingCart size={20} />
            <span>Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
            {cart.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: theme.colors.error,
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 'bold',
              }}>
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
          gap: '1rem',
        }}>
          {products.map((product: InventoryItem) => (
            <div 
              key={product.id}
              onClick={(e) => {
                console.log('Product clicked:', product.name);
                if (product.stock > 0) {
                  e.stopPropagation();
                  openProductModal(product);
                }
              }}
              style={{
                background: 'white',
                borderRadius: theme.borderRadius,
                padding: '1.25rem',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                border: cart.some(item => item.id === product.id) 
                  ? `2px solid ${theme.colors.primary}` 
                  : '1px solid #e2e8f0',
                ':hover': product.stock > 0 ? {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                } : {},
                opacity: product.stock === 0 ? 0.6 : 1,
              } as React.CSSProperties}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {product.image || '📦'}
              </div>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{product.name}</div>
              <div style={{ 
                color: product.stock <= (product.minStockLevel || 5) 
                  ? theme.colors.error 
                  : theme.colors.primary, 
                fontWeight: 700, 
                margin: '0.5rem 0',
                fontSize: '1.1rem'
              }}>
                ₱{formatPrice(product.price)}
              </div>
              <div style={{ 
                fontSize: '0.75rem', 
                color: product.stock <= (product.minStockLevel || 5) 
                  ? theme.colors.error 
                  : theme.colors.textLight,
                fontWeight: product.stock <= (product.minStockLevel || 5) ? 600 : 400,
              }}>
                {product.stock === 0 ? 'Out of Stock' : `Stock: ${product.stock}`}
                {product.minStockLevel !== undefined && product.stock <= product.minStockLevel && product.stock > 0 && (
                  <div style={{ color: theme.colors.error, marginTop: '0.25rem', fontWeight: 600 }}>(Low Stock)</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shopping Cart Sidebar */}
      <div style={{
        width: isCartOpen ? '350px' : '0',
        height: '100vh',
        position: 'fixed',
        top: '0',
        right: '0',
        backgroundColor: 'white',
        boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.1)',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        zIndex: 1000,
      }}>
        <div style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0 }}>Shopping Cart</h2>
            <button 
              onClick={() => setIsCartOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#64748b',
              }}
            >
              &times;
            </button>
          </div>

          {cart.length === 0 ? (
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#94a3b8',
              textAlign: 'center',
              padding: '2rem',
            }}>
              <FiShoppingCart size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>Your cart is empty</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Click on items to add them to your cart</p>
            </div>
          ) : (
            <>
              <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1.5rem' }}>
                {cart.map(item => (
                  <div 
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem 0',
                      borderBottom: '1px solid #f1f5f9',
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '0.5rem',
                      backgroundColor: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '0.75rem',
                      fontSize: '1.25rem',
                      flexShrink: 0,
                    }}>
                      {item.image}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ 
                        fontWeight: 600, 
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {item.name}
                      </div>
                      <div style={{ 
                        color: theme.colors.primary, 
                        fontWeight: 700, 
                        fontSize: '0.9rem',
                        marginTop: '0.25rem',
                      }}>
                        ₱{formatPrice(item.price)}
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginLeft: '0.5rem',
                    }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(item.id, item.quantity - 1);
                        }}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '4px',
                          border: '1px solid #e2e8f0',
                          background: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: theme.colors.primary,
                        }}
                      >
                        <FiMinus size={14} />
                      </button>
                      <span style={{ minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(item.id, item.quantity + 1);
                        }}
                        disabled={item.quantity >= item.stock}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '4px',
                          border: '1px solid #e2e8f0',
                          background: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: item.quantity >= item.stock ? 'not-allowed' : 'pointer',
                          opacity: item.quantity >= item.stock ? 0.5 : 1,
                          color: theme.colors.primary,
                        }}
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCart(item.id);
                      }}
                      style={{
                        marginLeft: '0.5rem',
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.25rem',
                      }}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '1rem',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}>
                  <span>Total:</span>
                  <span>₱{formatPrice(totalPrice)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: cart.length === 0 ? '#cbd5e1' : theme.colors.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: theme.borderRadius,
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <FiDollarSign size={18} />
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {productModal.isOpen && productModal.product && (
        <div 
          onClick={closeProductModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}>
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '400px',
              padding: '1.5rem',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              position: 'relative',
            }} 
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={closeProductModal}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#64748b',
                padding: '0.25rem',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ':hover': {
                  backgroundColor: '#f1f5f9',
                },
              }}
            >
              &times;
            </button>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                width: '100px',
                height: '100px',
                margin: '0 auto 1.5rem',
                borderRadius: '16px',
                backgroundColor: '#f0f9ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                border: `2px solid ${theme.colors.primary}20`,
                transform: 'translateY(-20px)',
                marginTop: '-20px',
                transition: 'all 0.3s ease',
              }}>
                <span style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>
                  {productModal.product.image || '📦'}
                </span>
              </div>
              <h3 style={{ 
                margin: '0 0 0.5rem', 
                fontSize: '1.5rem', 
                fontWeight: 700,
                color: '#1e293b',
                letterSpacing: '-0.01em',
              }}>
                {productModal.product.name}
              </h3>
              <div style={{ 
                color: theme.colors.primary, 
                fontWeight: 800, 
                fontSize: '1.5rem', 
                marginBottom: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem',
              }}>
                <span style={{ fontSize: '1rem', opacity: 0.8, marginRight: '0.25rem' }}>₱</span>
                {formatPrice(productModal.product.price)}
              </div>
              <div style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#64748b', 
                fontSize: '0.875rem', 
                marginBottom: '2rem',
                padding: '0.35rem 1rem',
                borderRadius: '20px',
                backgroundColor: '#f8fafc',
                boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
              }}>
                <span style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: productModal.product.stock > 10 ? '#10b981' : '#f59e0b',
                }}></span>
                {productModal.product.stock} available in stock
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                gap: '1rem',
                flexWrap: 'wrap',
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                }}>
                  <button
                    onClick={() => handleQuantityChange(productModal.quantity - 1)}
                    disabled={productModal.quantity <= 1}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      background: 'white',
                      fontSize: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: productModal.quantity <= 1 ? 'not-allowed' : 'pointer',
                      opacity: productModal.quantity <= 1 ? 0.5 : 1,
                      color: theme.colors.primary,
                      fontWeight: 'bold',
                    }}
                  >
                    -
                  </button>
                  
                  <div style={{
                    minWidth: '60px',
                    textAlign: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                  }}>
                    {productModal.quantity}
                  </div>
                  
                  <button
                    onClick={() => handleQuantityChange(productModal.quantity + 1)}
                    disabled={productModal.quantity >= (productModal.product.stock || 0)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      background: 'white',
                      fontSize: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: productModal.quantity >= (productModal.product.stock || 0) ? 'not-allowed' : 'pointer',
                      opacity: productModal.quantity >= (productModal.product.stock || 0) ? 0.5 : 1,
                      color: theme.colors.primary,
                      fontWeight: 'bold',
                    }}
                  >
                    +
                  </button>
                </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: { xs: '1rem', sm: 0 },
                  width: { xs: '100%', sm: 'auto' },
                }}>
                  <span style={{ 
                    fontSize: '0.875rem',
                    color: '#64748b',
                    whiteSpace: 'nowrap',
                  }}>
                    Custom amount:
                  </span>
                  <input
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
                    style={{
                      width: '80px',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      textAlign: 'center',
                      fontSize: '1rem',
                      '&:focus': {
                        outline: 'none',
                        borderColor: theme.colors.primary,
                        boxShadow: `0 0 0 2px ${theme.colors.primary}33`,
                      },
                    }}
                  />
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '1rem',
                marginTop: '1.5rem',
              }}>
                <button
                  onClick={closeProductModal}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    background: 'white',
                    color: '#334155',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    ':hover': {
                      backgroundColor: '#f8fafc',
                    },
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    addToCartFromModal();
                    closeProductModal();
                  }}
                  style={{
                    flex: 2,
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: theme.colors.primary,
                    color: 'white',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    ':hover': {
                      opacity: 0.9,
                    },
                  }}
                >
                  Add to Cart - ₱{formatPrice((productModal.product.price || 0) * productModal.quantity)}
                </button>
              </div>
            </div>
          </div>
        </div>
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