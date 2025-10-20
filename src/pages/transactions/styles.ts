// Styled Components
import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 120px);
  padding-bottom: 5rem;
  
  @media (min-width: 768px) {
    padding: 1.5rem 2rem 2rem;
    min-height: calc(100vh - 180px);
  }
`;

export const HeaderSection = styled.div`
  margin-bottom: 1.5rem;
  
  @media (max-width: 767px) {
    margin-bottom: 1.25rem;
  }
`;

export const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  @media (max-width: 767px) {
    font-size: 1.5rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin: 0;
  opacity: 0.9;
  
  @media (max-width: 767px) {
    font-size: 0.875rem;
  }
`;

export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  padding: 3rem 0;
  
  &::after {
    content: "";
    width: 2.5rem;
    height: 2.5rem;
    border: 3px solid ${({ theme }) => theme.colors.primary};
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const ErrorText = styled.div`
  background: ${({ theme }) => `${theme.colors.error}15`};
  color: ${({ theme }) => theme.colors.error};
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  margin: 1rem 0;
  font-weight: 500;
  
  span:first-child {
    margin-right: 0.5rem;
  }
`;

export const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
  
  @media (max-width: 767px) {
    gap: 0.75rem;
    margin-top: 1.25rem;
  }
`;

export const TransactionCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  
  @media (max-width: 767px) {
    padding: 1rem;
    border-radius: 10px;
  }
`;

export const TransactionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  
  @media (max-width: 767px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

export const TransactionInfo = styled.div`
  flex: 1;
`;

export const TransactionDate = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

export const TransactionTitle = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  
  @media (max-width: 767px) {
    font-size: 1.05rem;
  }
`;

export const TransactionAmount = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-align: right;
  
  @media (max-width: 767px) {
    font-size: 1.1rem;
    text-align: left;
    width: 100%;
    padding-top: 0.5rem;
    border-top: 1px dashed ${({ theme }) => theme.colors.primary};
    margin-top: 0.75rem;
  }
`;

export const TransactionItems = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const TransactionItem = styled.li`
  display: flex;
  justify-content: space-between;
  font-size: 0.9375rem;
  
  @media (max-width: 767px) {
    font-size: 0.875rem;
  }
`;

export const ItemName = styled.span`
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
`;

export const ItemPrice = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  margin-left: 1rem;
  min-width: 80px;
  text-align: right;
`;

export const TransactionFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.colors.primary};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
  
  @media (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

export const PaymentMethod = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    font-size: 1.1em;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.colors.textLight};
  
  svg {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    opacity: 0.7;
  }
  
  p {
    margin: 0.5rem 0 0;
    font-size: 0.9375rem;
  }
`;
