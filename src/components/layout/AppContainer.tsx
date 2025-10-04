import styled from 'styled-components';

export const AppContainer = styled.div`
  display: grid;
  grid-template-columns: 64px 1fr;
  grid-template-rows: 60px 1fr 60px;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;
