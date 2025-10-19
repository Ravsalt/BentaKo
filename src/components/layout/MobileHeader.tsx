import styled from 'styled-components';
import { FiMenu, FiShoppingCart } from 'react-icons/fi';
import { useSalesList } from '../../hooks/useSales';

const HeaderContainer = styled.header`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 1rem;
  display: none;
  
  /* Only show on mobile */
  @media (max-width: 767px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 99;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;



const Logo = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background 0.2s;
  position: relative;

  &:active {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(0.95);
  }
`;

const SalesInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 0.75rem;
  
  span:first-child {
    opacity: 0.9;
  }
  
  span:last-child {
    font-weight: 600;
    font-size: 0.85rem;
  }
`;

interface MobileHeaderProps {
  onMenuClick?: () => void;
  onCartClick?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  onMenuClick,
  onCartClick
}) => {
  const { data: salesData } = useSalesList();
  
  const dailySales = salesData
    ?.filter(sale => {
      const saleDate = new Date(sale.date);
      const today = new Date();
      return saleDate.getDate() === today.getDate() &&
            saleDate.getMonth() === today.getMonth() &&
            saleDate.getFullYear() === today.getFullYear();
    })
    .reduce((total, sale) => total + (sale.price * sale.quantity || 0), 0) || 0;

  return (
    <HeaderContainer>
      <LogoContainer>
        <Logo>BentaKo!</Logo>
      </LogoContainer>
      <HeaderActions>
        <SalesInfo>
          <span>Today</span>
          <span>₱{dailySales.toFixed(2)}</span>
        </SalesInfo>
        {onCartClick && (
          <IconButton onClick={onCartClick}>
            <FiShoppingCart size={20} />
          </IconButton>
        )}
        {onMenuClick && (
          <IconButton onClick={onMenuClick}>
            <FiMenu size={20} />
          </IconButton>
        )}
      </HeaderActions>
    </HeaderContainer>
  );
};

export default MobileHeader;
