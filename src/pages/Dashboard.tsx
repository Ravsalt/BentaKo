import { useState, type RefObject } from 'react';
import styled from 'styled-components';
import { FiShoppingCart } from 'react-icons/fi';
import { useInventoryList } from '../hooks/useInventory';
import { useCart } from '../hooks/useCart';
import { useProductSearch } from '../hooks/useProductSearch';
import { useProductModal } from '../hooks/useProductModal';
import { useCheckout } from '../hooks/useCheckout';
import { SearchBar } from '../components/dashboard/SearchBar';
import { ProductGrid } from '../components/dashboard/ProductGrid';
import { Cart } from '../components/dashboard/Cart';
import { ProductModal } from '../components/dashboard/ProductModal';
import { CartButton, CartBadge, LoadingWrapper, Spinner, ErrorWrapper, ErrorIcon, ErrorMessage } from '../components/dashboard/styles';

// Responsive styled components
const DashboardContainer = styled.div`
  display: flex;
  min-height: calc(100vh - 64px);
  
  @media (max-width: 767px) {
    flex-direction: column;
    min-height: auto;
  }
`;

const MainSection = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  
  @media (max-width: 767px) {
    padding: 1rem;
  }
`;

const HeaderSection = styled.div`
  margin-bottom: 1.5rem;
  
  @media (max-width: 767px) {
    margin-bottom: 1rem;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
  
  @media (max-width: 767px) {
    flex-wrap: wrap;
  }
`;

const PageTitle = styled.h1`
  margin: 0;
  color: #2c3e50;
  font-size: 1.75rem;
  
  @media (max-width: 767px) {
    font-size: 1.5rem;
  }
`;

const ProductGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
  
  @media (max-width: 767px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
`;

export default function Dashboard() {
  const { data: inventoryData, isLoading, error } = useInventoryList();
  const allProducts = Array.isArray(inventoryData) ? inventoryData : [];
  
  // Custom hooks
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();
  const { searchQuery, setSearchQuery, isSearchFocused, setIsSearchFocused, searchInputRef, filteredProducts } = useProductSearch(allProducts);
  const { productModal, openProductModal, closeProductModal, handleQuantityChange } = useProductModal();
  const { handleCheckout: processCheckout } = useCheckout();
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCartFromModal = () => {
    if (!productModal.product) return;
    addToCart(productModal.product, productModal.quantity);
    closeProductModal();
  };

  const handleCheckout = () => {
    processCheckout(cart, filteredProducts, clearCart);
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
    <DashboardContainer>
      <MainSection>
        <HeaderSection>
          <HeaderRow>
            <PageTitle>Dashboard</PageTitle>
            <CartButton onClick={() => setIsCartOpen(!isCartOpen)}>
              <FiShoppingCart size={20} />
              <span>Cart ({totalItems})</span>
              {cart.length > 0 && (
                <CartBadge>
                  {totalItems}
                </CartBadge>
              )}
            </CartButton>
          </HeaderRow>
          
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSearchFocused={isSearchFocused}
            setIsSearchFocused={setIsSearchFocused}
            searchInputRef={searchInputRef as RefObject<HTMLInputElement>}
            hasResults={filteredProducts.length > 0}
          />
        </HeaderSection>

        <ProductGridContainer>
          <ProductGrid
            products={filteredProducts}
            searchQuery={searchQuery}
            cart={cart}
            onProductClick={openProductModal}
          />
        </ProductGridContainer>
      </MainSection>

      <Cart
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        totalPrice={totalPrice}
        handleCheckout={handleCheckout}
      />

      <ProductModal
        productModal={productModal}
        closeProductModal={closeProductModal}
        handleQuantityChange={handleQuantityChange}
        addToCartFromModal={addToCartFromModal}
      />
    </DashboardContainer>
  );
}