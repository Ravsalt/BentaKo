import styled from 'styled-components';

export const MainContent = styled.main`
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.background};
  scroll-behavior: smooth;
  
  /* Desktop */
  @media (min-width: 768px) {
    grid-column: 2;
    padding: 2rem;
    
    /* Custom scrollbar for desktop */
    &::-webkit-scrollbar {
      width: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: ${({ theme }) => theme.colors.background};
    }
    
    &::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
      background: #aaa;
    }
  }
  
  /* Mobile */
  @media (max-width: 767px) {
    padding: 0 1rem 80px; /* Remove top padding, keep horizontal and bottom padding */
    
    /* Hide scrollbar on mobile for cleaner look */
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

interface MainContentProps {
  children: React.ReactNode;
  className?: string;
}

export const MainContentWrapper: React.FC<MainContentProps> = ({
  children,
  className = ''
}) => {
  return (
    <MainContent className={className}>
      {children}
    </MainContent>
  );
};

export default MainContentWrapper;
