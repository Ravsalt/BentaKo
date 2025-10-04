import styled from 'styled-components';

export const MainContent = styled.main`
  grid-column: 2;
  padding: 2rem;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.background};
  
  /* Add smooth scrolling for the entire content area */
  scroll-behavior: smooth;
  
  /* Custom scrollbar */
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
