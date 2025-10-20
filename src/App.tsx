import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
// Import theme
import { AppThemeProvider } from './contexts/ThemeContext';

// Import pages
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import UtangList from './pages/Utang';
import Settings from './pages/Settings';
import Mobile from './pages/Mobile';
import Transactions from './pages/Transactions';

// Import layout components
import { AppContainer } from './components/layout/AppContainer';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { MobileHeader } from './components/layout/MobileHeader';
import { MainContent } from './components/layout/MainContent';
import { BottomBar } from './components/layout/BottomBar';
// Responsive layout - different experience for mobile and desktop




// Main App Component
const AppContent = () => {
  const isOnline = true; // This would come from a network status hook in a real app

  return (
    <AppContainer>
      {/* Sidebar - shows as bottom nav on mobile */}
      <Sidebar />
      
      {/* Desktop Navbar - hidden on mobile */}
      <Navbar />
      
      {/* Mobile Header - hidden on desktop */}
      <MobileHeader />
      
      {/* Main Content Area */}
      <MainContent>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/utang" element={<UtangList />} />
          <Route path="/mobile" element={<Mobile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/transactions" element={<Transactions />} />
        </Routes>
      </MainContent>
      
      {/* Desktop Bottom Bar - hidden on mobile */}
      <BottomBar   isOnline={isOnline} />
      
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
