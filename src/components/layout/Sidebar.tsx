import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiHome, 
  FiPackage, 
  FiPieChart, 
  FiCreditCard, 
  FiSettings 
} from 'react-icons/fi';

export const NavItem = styled(Link)<{ $isActive?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  border-radius: 8px;
  color: ${({ theme, $isActive }) => $isActive ? theme.colors.primary : theme.colors.white};
  background: ${({ theme, $isActive }) => $isActive ? theme.colors.white : 'transparent'};
  transition: all 0.2s;
  text-decoration: none;
  
  /* Desktop: square icons */
  @media (min-width: 768px) {
    width: 48px;
    height: 48px;
    margin: 0.5rem 0;
    font-size: 1.25rem;
    
    span {
      display: none;
    }
  }
  
  /* Mobile: icons with labels */
  @media (max-width: 767px) {
    flex: 1;
    padding: 0.5rem;
    font-size: 1.1rem;
    
    span {
      font-size: 0.7rem;
      font-weight: ${({ $isActive }) => $isActive ? 600 : 400};
    }
  }
  
  &:hover {
    background: ${({ theme, $isActive }) => $isActive ? theme.colors.white : 'rgba(255, 255, 255, 0.1)'};
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

export const SidebarContainer = styled.nav`
  background: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  z-index: 100;
  
  /* Desktop: vertical sidebar */
  @media (min-width: 768px) {
    grid-row: 1 / -1;
    flex-direction: column;
    padding: 1rem 0;
  }
  
  /* Mobile: horizontal bottom nav */
  @media (max-width: 767px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    flex-direction: row;
    justify-content: space-around;
    padding: 0.75rem 0;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  }
`;

const navItems = [
  { path: '/', icon: <FiHome />, label: 'Dashboard' },
  { path: '/inventory', icon: <FiPackage />, label: 'Inventory' },
  { path: '/reports', icon: <FiPieChart />, label: 'Reports' },
  { path: '/utang', icon: <FiCreditCard />, label: 'Utang List' },
  { path: '/settings', icon: <FiSettings />, label: 'Settings' },
];

export const Sidebar = () => {
  const location = useLocation();
  
  return (
    <SidebarContainer>
      {navItems.map((item) => (
        <NavItem 
          key={item.path} 
          to={item.path}
          title={item.label}
          $isActive={location.pathname === item.path}
        >
          {item.icon}
          <span>{item.label}</span>
        </NavItem>
      ))}
    </SidebarContainer>
  );
};

export default Sidebar;
