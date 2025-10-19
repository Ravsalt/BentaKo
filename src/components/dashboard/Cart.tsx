import { FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiDollarSign } from 'react-icons/fi';
import {
  CartSidebar, CartHeader, CartTitle, CloseButton, EmptyCartWrapper, CartItemsWrapper,
  CartItem, CartItemImage, CartItemDetails, CartItemName, CartItemPrice, QuantityControl,
  QuantityButton, RemoveButton, CartFooter, TotalWrapper, CheckoutButton,
} from './styles';
import { formatPrice } from '../../utils/formatPrice';
import type { CartItem as CartItemType } from '../../types/cart';

interface CartProps {
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cart: CartItemType[];
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  totalPrice: number;
  handleCheckout: () => void;
}

export const Cart = ({
  isCartOpen,
  setIsCartOpen,
  cart,
  updateQuantity,
  removeFromCart,
  totalPrice,
  handleCheckout,
}: CartProps) => {
  return (
    <>
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
    </>
  );
};
