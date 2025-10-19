import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchFocused: boolean;
  setIsSearchFocused: (focused: boolean) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  hasResults: boolean;
}

export const SearchBar = ({
  searchQuery,
  setSearchQuery,
  isSearchFocused,
  setIsSearchFocused,
  searchInputRef,
  hasResults,
}: SearchBarProps) => {
  return (
    <div style={{ 
      position: 'relative', 
      maxWidth: '500px', 
      margin: '0 auto',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'relative',
            boxShadow: isSearchFocused ? '0 4px 20px rgba(59, 130, 246, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
            borderRadius: '12px',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <div style={{ position: 'relative' }}>
            <FiSearch 
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: isSearchFocused ? '#3b82f6' : '#94a3b8',
                transition: 'all 0.2s ease',
                zIndex: 1,
              }}
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              style={{
                width: '100%',
                padding: '0.85rem 1rem 0.85rem 3rem',
                border: 'none',
                fontSize: '0.95rem',
                color: '#1e293b',
                backgroundColor: isSearchFocused ? '#ffffff' : '#f8fafc',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                borderRadius: '12px',
                outline: 'none',
              }}
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => {
                    setSearchQuery('');
                    searchInputRef.current?.focus();
                  }}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = '#ef4444')}
                  onMouseOut={(e) => (e.currentTarget.style.color = '#94a3b8')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
            transform: isSearchFocused ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left center',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }} />
        </motion.div>
        
        <div style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          pointerEvents: 'none',
          opacity: isSearchFocused ? 0 : 1,
          transition: 'opacity 0.2s ease',
        }}>
          <span style={{
            fontSize: '0.7rem',
            backgroundColor: '#e2e8f0',
            color: '#64748b',
            padding: '2px 6px',
            borderRadius: '4px',
            fontFamily: 'monospace',
          }}>
            {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
          </span>
          <span style={{
            fontSize: '0.7rem',
            backgroundColor: '#e2e8f0',
            color: '#64748b',
            padding: '2px 6px',
            borderRadius: '4px',
            fontFamily: 'monospace',
          }}>
            K
          </span>
        </div>
      </div>
      
      <AnimatePresence>
        {searchQuery && !hasResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '1rem',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              zIndex: 50,
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '1.5rem 0',
              color: '#64748b',
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '0.75rem' }}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
              <p style={{ margin: '0.25rem 0', fontWeight: 500, color: '#334155' }}>No results found</p>
              <p style={{ margin: 0, fontSize: '0.9rem', textAlign: 'center' }}>We couldn't find any products matching "{searchQuery}"</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
