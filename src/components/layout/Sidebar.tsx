import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiHome, 
  FiPackage, 
  FiPieChart, 
  FiCreditCard, 
  FiSettings,
  FiDollarSign, 
  FiShoppingCart

} from 'react-icons/fi';

import React from 'react';
export const NavItem = styled(Link)<{ $isActive?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  border-radius: 12px;
  color: ${({ theme, $isActive }) => $isActive ? theme.colors.primary : theme.colors.white};
  background: ${({ theme, $isActive }) => $isActive ? theme.colors.white : 'transparent'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  position: relative;
  overflow: hidden;
  
  /* Desktop: square icons */
  @media (min-width: 768px) {
    width: 52px;
    height: 52px;
    margin: 0.5rem 0;
    font-size: 1.4rem;
    
    span {
      display: none;
    }

    /* Tooltip on hover for desktop */
    &::after {
      content: attr(title);
      position: absolute;
      left: 100%;
      margin-left: 0.75rem;
      padding: 0.5rem 0.75rem;
      background: ${({ theme }) => theme.colors.white};
      color: ${({ theme }) => theme.colors.primary};
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transform: translateX(-10px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
    }

    &:hover::after {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  /* Mobile: icons with labels */
  @media (max-width: 767px) {
    flex: 1;
    padding: 0.625rem 0.25rem;
    font-size: 1.25rem;
    min-width: 0;
    max-width: 80px;
    
    svg {
      flex-shrink: 0;
    }
    
    span {
      font-size: 0.65rem;
      font-weight: ${({ $isActive }) => $isActive ? 600 : 400};
      text-align: center;
      line-height: 1.2;
      margin-top: 0.125rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
    }
  }

  /* Smaller phones - extra compact */
  @media (max-width: 380px) {
    font-size: 1.1rem;
    padding: 0.5rem 0.125rem;
    
    span {
      font-size: 0.6rem;
    }
  }
  
  &:hover {
    background: ${({ theme, $isActive }) => $isActive ? theme.colors.white : 'rgba(255, 255, 255, 0.15)'};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: scale(0.95) translateY(0);
  }

  /* Active indicator ripple effect */
  ${({ $isActive }) => $isActive && `
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      transform: translate(-50%, -50%) scale(0);
      animation: ripple 0.6s ease-out;
    }

    @keyframes ripple {
      to {
        transform: translate(-50%, -50%) scale(1.5);
        opacity: 0;
      }
    }
  `}
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
    padding: 1.5rem 0.75rem;
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);
  }
  
  /* Mobile: horizontal bottom nav */
  @media (max-width: 767px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    flex-direction: row;
    justify-content: space-around;
    padding: 0.75rem 0.5rem;
    padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
    box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    background: ${({ theme }) => `${theme.colors.primary}f5`};
  }

  /* Notch/Island support for iOS devices */
  @supports (padding-bottom: env(safe-area-inset-bottom)) {
    @media (max-width: 767px) {
      padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
    }
  }
`;

export const Logo = styled.div`
  display: none;
  
  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    margin-bottom: 1.5rem;
    background: ${({ theme }) => theme.colors.white};
    border-radius: 12px;
    font-size: 1.5rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const NavDivider = styled.div`
  display: none;
  
  @media (min-width: 768px) {
    display: block;
    width: 32px;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
    margin: 0.75rem auto;
  }
`;

const navItems = [
  { path: '/', icon: <FiHome />, label: 'Dashboard', section: 'main' },
  { path: '/inventory', icon: <FiPackage />, label: 'Inventory', section: 'main' },
  { path: '/reports', icon: <FiPieChart />, label: 'Reports', section: 'main' },
  { path: '/transactions', icon: <FiDollarSign />, label: 'History', section: 'finance' },
  { path: '/utang', icon: <FiCreditCard />, label: 'Utang List', section: 'finance' },
  { path: '/settings', icon: <FiSettings />, label: 'Settings', section: 'settings' },
];

export const Sidebar = () => {
  const location = useLocation();
  
  return (
    <SidebarContainer>
      {/* Logo only shows on desktop */}
      <Logo>
        <FiShoppingCart />
      </Logo>
      
      {navItems.map((item, index) => (
        <React.Fragment key={item.path}>
          {/* Add divider before finance section on desktop */}
          {index > 0 && 
           item.section !== navItems[index - 1].section && 
           <NavDivider />
          }
          
          <NavItem 
            to={item.path}
            title={item.label}
            $isActive={location.pathname === item.path}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavItem>
        </React.Fragment>
      ))}
    </SidebarContainer>
  );
};

export default Sidebar;