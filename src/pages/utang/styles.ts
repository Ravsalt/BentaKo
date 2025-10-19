import styled from 'styled-components';

export const UtangWrapper = styled.div`
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

export const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.75rem;
  
  @media (max-width: 767px) {
    font-size: 1.5rem;
  }
`;

export const AddButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 0.5rem 1rem;
  cursor: pointer;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  
  @media (max-width: 767px) {
    display: none; /* Hide table on mobile, use card layout instead */
  }
`;

export const Th = styled.th`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

export const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

export const Status = styled.span<{ status: string }>`
  color: ${({ status, theme }) => (status === 'Paid' ? theme.colors.success : theme.colors.error)};
  font-weight: bold;
`;

export const ActionButton = styled.button`
  margin-right: 0.5rem;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-size: 0.875rem;
  transition: all 0.2s;

  &.delete {
    background-color: ${({ theme }) => theme.colors.error};
  }

  &.paid {
    background-color: ${({ theme }) => theme.colors.success};
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (max-width: 767px) {
    padding: 0.5rem 0.75rem;
    margin-right: 0.25rem;
    margin-bottom: 0.25rem;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  
  @media (max-width: 767px) {
    padding: 1.5rem;
    margin: 1rem;
    max-width: calc(100% - 2rem);
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.background};
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.background};
  font-size: 1rem;
  margin-top: 0.25rem;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.background};
  font-size: 1rem;
  margin-top: 0.25rem;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

// Mobile card layout
export const MobileCardList = styled.div`
  display: none;
  
  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }
`;

export const DebtCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 0.5rem;
`;

export const DebtorName = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
`;

export const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background};
  
  &:last-child {
    border-bottom: none;
  }
`;

export const CardLabel = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
  font-weight: 500;
`;

export const CardValue = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
`;

export const CardActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.colors.background};
`;
