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
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin: 0.5rem 0;
  border-radius: 8px;
  color: ${({ theme, $isActive }) => $isActive ? theme.colors.primary : theme.colors.white};
  background: ${({ theme, $isActive }) => $isActive ? theme.colors.white : 'transparent'};
  transition: all 0.2s;
  text-decoration: none;
  font-size: 1.25rem;
  
  &:hover {
    background: ${({ theme, $isActive }) => $isActive ? theme.colors.white : 'rgba(255, 255, 255, 0.1)'};
  }
`;

export const SidebarContainer = styled.nav`
  grid-row: 1 / -1;
  background: ${({ theme }) => theme.colors.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
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
        </NavItem>
      ))}
    </SidebarContainer>
  );
};

export default Sidebar;
