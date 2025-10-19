import styled from 'styled-components';
import { useSalesList } from '../../hooks/useSales';

const NavbarContainer = styled.header`
  background: ${({ theme }) => theme.colors.white};
  padding: 0 2rem;
  display: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  /* Only show on desktop */
  @media (min-width: 768px) {
    grid-column: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;


const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: black;
  margin: 0;
`;

const NavControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const DailyTotal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 0.875rem;
  
  span:first-child {
    color: ${({ theme }) => theme.colors.textLight};
  }
  
  span:last-child {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Navbar: React.FC = () => {
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
    
  const totalSales = salesData
    ?.reduce((total, sale) => total + (sale.price * sale.quantity || 0), 0) || 0;

  return (
    <NavbarContainer>
      <LogoContainer>
        <Logo>BentaKo!</Logo>
      </LogoContainer>
      <NavControls>
        <DailyTotal>
          <span>Daily Sales:</span>
          <span>₱{dailySales.toFixed(2)}</span>
        </DailyTotal>
        <DailyTotal>
          <span>Total Sales:</span>
          <span>₱{totalSales.toFixed(2)}</span>
        </DailyTotal>
      </NavControls>
    </NavbarContainer>
  );
};

export default Navbar;
