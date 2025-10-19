import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
  
  @media (max-width: 767px) {
    padding: 1rem;
    padding-bottom: 80px;
  }
`;

export const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  @media (max-width: 767px) {
    margin-bottom: 1.5rem;
    text-align: left;
  }
`;

export const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  
  @media (max-width: 767px) {
    font-size: 1.5rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1rem;
  color: #7f8c8d;
  margin: 0;
  
  @media (max-width: 767px) {
    font-size: 0.9rem;
  }
`;

export const ReportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const Card = styled.div<{ borderColor: string }>`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-top: 4px solid ${({ borderColor }) => borderColor};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
  
  @media (max-width: 767px) {
    padding: 1.25rem;
    border-radius: 12px;
    
    &:hover {
      transform: none;
    }
    
    &:active {
      transform: scale(0.98);
    }
  }
`;

export const CardHeader = styled.div`
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
  
  @media (max-width: 767px) {
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #34495e;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 767px) {
    font-size: 1.1rem;
  }
`;

export const IconWrapper = styled.span`
  font-size: 1.5rem;
  
  @media (max-width: 767px) {
    font-size: 1.25rem;
  }
`;

export const InsightText = styled.p`
  font-size: 0.875rem;
  color: #7f8c8d;
  font-style: italic;
  margin: 0.5rem 0 0 0;
  line-height: 1.5;
  
  @media (max-width: 767px) {
    font-size: 0.8rem;
  }
`;

export const SummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const SummaryItem = styled.div<{ borderColor: string; highlight?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: ${({ highlight }) => highlight ? 'rgba(255, 247, 205, 0.3)' : '#f8f9fa'};
  border-radius: 10px;
  border-left: 4px solid ${({ borderColor }) => borderColor};
  border: ${({ highlight }) => highlight ? '1px solid #fef08a' : 'none'};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ highlight }) => highlight ? 'rgba(255, 247, 205, 0.5)' : '#f1f3f5'};
  }
  
  @media (max-width: 767px) {
    padding: 0.875rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

export const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ItemIcon = styled.span`
  font-size: 1.1rem;
  
  @media (max-width: 767px) {
    font-size: 1rem;
  }
`;

export const SummaryLabel = styled.span`
  font-size: 0.95rem;
  color: #555;
  font-weight: 500;
  
  @media (max-width: 767px) {
    font-size: 0.875rem;
  }
`;

export const ValueContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  
  @media (max-width: 767px) {
    align-items: flex-start;
    width: 100%;
  }
`;

export const SummaryValue = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: #2c3e50;
  
  @media (max-width: 767px) {
    font-size: 1.1rem;
  }
`;

export const TrendIndicator = styled.span<{ trend: number }>`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ trend }) => trend > 0 ? '#10b981' : trend < 0 ? '#ef4444' : '#6b7280'};
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
  
  @media (max-width: 767px) {
    font-size: 0.7rem;
  }
`;

export const FooterNote = styled.div`
  margin-top: 2rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, #e8f4f8 0%, #d4e9f2 100%);
  border-radius: 12px;
  border-left: 4px solid #3498db;
  
  @media (max-width: 767px) {
    margin-top: 1.5rem;
    padding: 1rem;
  }
`;

export const FooterText = styled.p`
  font-size: 0.9rem;
  color: #34495e;
  margin: 0;
  line-height: 1.6;
  
  strong {
    font-weight: 600;
    color: #2c3e50;
  }
  
  @media (max-width: 767px) {
    font-size: 0.85rem;
  }
`;

export const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #e2e8f0;
  border-top-color: #3498db;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const ErrorText = styled.span`
  color: #ef4444;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  @media (max-width: 767px) {
    font-size: 0.8rem;
  }
`;
