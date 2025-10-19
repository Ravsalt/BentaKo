import styled from 'styled-components';

export const InventoryWrapper = styled.div`
  padding: 2rem;
  
  @media (max-width: 767px) {
    padding: 1rem;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
  
  @media (max-width: 767px) {
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }
`;

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.75rem;
  
  @media (max-width: 767px) {
    font-size: 1.5rem;
  }
`;

export const InventoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.25rem;
  
  @media (max-width: 767px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;
