import { FiPlusCircle, FiWifi, FiWifiOff } from 'react-icons/fi';
import styled, { css } from 'styled-components';

export const BottomBarContainer = styled.footer`
  grid-column: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  background: ${({ theme }) => theme.colors.white};
  border-top: 1px solid #eee;
`;

export const AddItemButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  min-width: 120px;
  width: 100%;
  max-width: 300px;
  margin: 2rem auto;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%, -50%);
    transform-origin: 50% 50%;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary}80;
    outline-offset: 2px;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const SyncStatus = styled.div<{ $isOnline: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme, $isOnline }) => $isOnline ? theme.colors.success : theme.colors.warning};
  font-size: 0.875rem;
  
  svg {
    font-size: 1.1rem;
  }
`;

interface BottomBarProps {
  onAddItem: () => void;
  isOnline: boolean;
  addButtonText?: string;
  className?: string;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  onAddItem,
  isOnline,
  addButtonText = 'Add New Item',
  className = ''
}) => {
  return (
    <BottomBarContainer className={className}>
      <AddItemButton onClick={onAddItem}>
        <FiPlusCircle />
        <span>{addButtonText}</span>
      </AddItemButton>
      
      <SyncStatus $isOnline={isOnline}>
        {isOnline ? <FiWifi /> : <FiWifiOff />}
        <span>{isOnline ? 'Online' : 'Offline'}</span>
      </SyncStatus>
    </BottomBarContainer>
  );
};

export default BottomBar;
