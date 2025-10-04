import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { FiHome, FiPackage, FiPieChart, FiCreditCard, FiSettings, FiPlusCircle, FiWifi, FiWifiOff } from 'react-icons/fi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useInventoryList } from './hooks/useInventory';
import type { InventoryItem } from './types/inventory';

// Import theme
import { AppThemeProvider } from './contexts/ThemeContext';
// Update these imports to match your actual filenames
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import UtangList from './pages/Utang';
import Settings from './pages/Settings';
// Styled Components
const AppContainer = styled.div`
  display: grid;
  grid-template-columns: 64px 1fr;
  grid-template-rows: 60px 1fr 60px;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Sidebar = styled.nav`
  grid-row: 1 / -1;
  background: ${({ theme }) => theme.colors.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
`;

const NavItem = styled(Link)<{ $isActive?: boolean }>`
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
    background: ${({ theme, $isActive }) => 
      $isActive 
        ? 'rgba(255, 255, 255, 0.9)' // Slightly darker when active and hovered
        : 'rgba(255, 255, 255, 0.1)'};
    transform: ${({ $isActive }) => $isActive ? 'scale(1.05)' : 'none'};
  }
`;

const Navbar = styled.header`
  grid-column: 2;
  background: ${({ theme }) => theme.colors.white};
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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

const MainContent = styled.main`
  grid-column: 2;
  padding: 2rem;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.background};
`;

const BottomBar = styled.footer`
  grid-column: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  background: ${({ theme }) => theme.colors.white};
  border-top: 1px solid #eee;
`;

const SyncStatus = styled.div<{ $isOnline: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme, $isOnline }) => $isOnline ? theme.colors.success : theme.colors.warning};
  font-size: 0.875rem;
`;




// Main App Component
const AppContent = () => {
  const location = useLocation(); // Get current location
  const isOnline = true; // This would come from a network status hook in a real app
  
  const navItems = [
    { path: '/', icon: <FiHome />, label: 'Dashboard' },
    { path: '/inventory', icon: <FiPackage />, label: 'Inventory' },
    { path: '/reports', icon: <FiPieChart />, label: 'Reports' },
    { path: '/utang', icon: <FiCreditCard />, label: 'Utang List' },
    { path: '/settings', icon: <FiSettings />, label: 'Settings' },
  ];

  return (
    <AppContainer>
      <Sidebar>
        {navItems.map((item) => (
          <NavItem 
            key={item.path} 
            to={item.path}
            title={item.label}
            $isActive={location.pathname === item.path || 
                     (item.path !== '/' && location.pathname.startsWith(item.path))}
          >
            {item.icon}
          </NavItem>
        ))}
      </Sidebar>
      
      <Navbar>
        <Logo>BentaKo!</Logo>
        <NavControls>
          <DailyTotal>
            <span>Daily Total:</span>
            <span>₱0.00</span>
          </DailyTotal>
        </NavControls>
      </Navbar>
      
      <MainContent>
      <Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/inventory" element={<Inventory />} />
  <Route path="/reports" element={<Reports />} />
  <Route path="/utang" element={<UtangList />} />
  <Route path="/settings" element={<Settings />} />
</Routes>
      </MainContent>
      
      <BottomBar>
        <SyncStatus $isOnline={isOnline}>
          {isOnline ? <FiWifi /> : <FiWifiOff />}
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </SyncStatus>
      </BottomBar>
      
        <Toaster position="top-right" />
    </AppContainer>
  );
};

// App component with providers
const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </AppThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
