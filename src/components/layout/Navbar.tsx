import styled from 'styled-components';

export const NavbarContainer = styled.header`
  grid-column: 2;
  background: ${({ theme }) => theme.colors.white};
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

export const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;

export const NavControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

export const DailyTotal = styled.div`
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

export const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
  }
`;

interface NavbarProps {
  dailyTotal?: number;
  userName?: string;
}

export const Navbar = ({ 
  dailyTotal = 0, 
}: NavbarProps) => {
  return (
    <NavbarContainer>
      <Logo>SariSmart 🧾</Logo>
      <NavControls>
        <DailyTotal>
          <span>Daily Total:</span>
          <span>₱{dailyTotal.toFixed(2)}</span>
        </DailyTotal>
      </NavControls>
    </NavbarContainer>
  );
};

export default Navbar;
