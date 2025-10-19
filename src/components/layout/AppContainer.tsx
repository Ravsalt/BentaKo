import styled from 'styled-components';

export const AppContainer = styled.div`
  display: grid;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  
  /* Desktop layout: sidebar + content */
  @media (min-width: 768px) {
    grid-template-columns: 64px 1fr;
    grid-template-rows: 60px 1fr 60px;
  }
  
  /* Mobile layout: full width content with bottom nav */
  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
  }
`;
