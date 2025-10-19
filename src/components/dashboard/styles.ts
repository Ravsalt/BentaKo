import styled from 'styled-components';

export const CartButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  position: relative;
`;

export const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
`;

export const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
`;

export const Spinner = styled.div`
  animation: spin 1s linear infinite;
  border-radius: 50%;
  height: 12px;
  width: 12px;
  border-top: 2px solid ${({ theme }) => theme.colors.primary};
  border-right: 2px solid ${({ theme }) => theme.colors.primary};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
  border-left: 2px solid transparent;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const ErrorWrapper = styled.div`
  background: ${({ theme }) => theme.colors.error}1A; // 1A is hex for 10% opacity
  border-left: 4px solid ${({ theme }) => theme.colors.error};
  padding: 1rem;
  display: flex;
`;

export const ErrorIcon = styled.div`
  flex-shrink: 0;
  svg {
    height: 20px;
    width: 20px;
    color: ${({ theme }) => theme.colors.error};
  }
`;

export const ErrorMessage = styled.p`
  margin-left: 0.75rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.error};
`;

export const CartSidebar = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: ${({ isOpen }) => (isOpen ? '100%' : '0')};
  max-width: 350px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  z-index: 1000;
  display: flex;
  flex-direction: column;

  @media (max-width: 480px) {
  }
`;

export const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background};
  border-top: 1px solid ${({ theme }) => theme.colors.primary};
  position: sticky;
  top: 0;
  z-index: 1;
`;

export const CartTitle = styled.h2`
{{ ... }}
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textLight};
`;

export const EmptyCartWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textLight};
  text-align: center;
  padding: 2rem;

  svg {
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;

export const CartItemsWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1.5rem;
  padding: 0 1rem;
  -webkit-overflow-scrolling: touch;
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    width: 5px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 4px;
  }
`;

export const CartItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background};
`;

export const CartItemImage = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  font-size: 1.25rem;
  flex-shrink: 0;
`;

export const CartItemDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

export const CartItemName = styled.div`
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.colors.text};
`;

export const CartItemPrice = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  font-size: 0.9rem;
  margin-top: 0.25rem;
`;

export const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 0.5rem;
`;

export const QuantityButton = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.background};
  background: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const RemoveButton = styled.button`
  margin-left: 0.5rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
`;

export const CartFooter = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.background};
  padding-top: 1rem;
`;

export const TotalWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const CheckoutButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: ${({ theme, disabled }) => (disabled ? theme.colors.textLight : theme.colors.primary)};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1rem;
  font-weight: 600;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

export const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  padding: 1.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  position: relative;
`;

export const ModalCloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textLight};
  padding: 0.25rem;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

export const ModalHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const ModalImage = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto 1.5rem;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 2px solid ${({ theme }) => theme.colors.primary}20;
  transform: translateY(-20px);
  margin-top: -20px;
  transition: all 0.3s ease;

  span {
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
  }
`;

export const ModalTitle = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.01em;
`;

export const ModalPrice = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 800;
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;

  span {
    font-size: 1rem;
    opacity: 0.8;
    margin-right: 0.25rem;
  }
`;

export const ModalStock = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.875rem;
  margin-bottom: 2rem;
  padding: 0.35rem 1rem;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: 0 2px 4px rgba(0,0,0,0.03);
`;

export const StockIndicator = styled.span<{ available: boolean }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ available, theme }) => (available ? theme.colors.success : theme.colors.warning)};
`;

export const ModalQuantityWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const ModalQuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const ModalQuantityButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.background};
  background: ${({ theme }) => theme.colors.white};
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const ModalQuantityInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ModalQuantityInput = styled.input`
  width: 80px;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.background};
  text-align: center;
  font-size: 1rem;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

export const CancelButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.background};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

export const AddToCartButton = styled.button`
  flex: 2;
  padding: 0.75rem;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

export const EmptyCartMessage = styled.p`
  font-size: 0.875rem;
  margin-top: 0.5rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

export const ModalQuantityDisplay = styled.div`
  min-width: 60px;
  text-align: center;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const CustomAmountLabel = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
  white-space: nowrap;
`;
