import styled from 'styled-components';

export const SettingsContainer = styled.div`
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
  
  @media (max-width: 767px) {
    padding: 1rem;
    padding-bottom: 100px; /* Space for bottom navigation */
  }
`;

export const PageHeader = styled.div`
  margin-bottom: 2rem;
  
  @media (max-width: 767px) {
    margin-bottom: 1.5rem;
  }
`;

export const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  @media (max-width: 767px) {
    font-size: 1.5rem;
  }
`;

export const PageSubtitle = styled.p`
  font-size: 1rem;
  color: #7f8c8d;
  margin: 0;
  
  @media (max-width: 767px) {
    font-size: 0.9rem;
  }
`;

export const Section = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  }
  
  @media (max-width: 767px) {
    padding: 1.25rem;
    border-radius: 12px;
    margin-bottom: 1rem;
    
    &:hover {
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    }
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
  
  @media (max-width: 767px) {
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
  }
`;

export const SectionIcon = styled.span`
  font-size: 1.5rem;
  
  @media (max-width: 767px) {
    font-size: 1.25rem;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #34495e;
  margin: 0;
  
  @media (max-width: 767px) {
    font-size: 1.1rem;
  }
`;

export const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  gap: 1rem;
  
  &:not(:last-child) {
    border-bottom: 1px solid #f8f9fa;
  }
  
  @media (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 0.875rem 0;
  }
`;

export const SettingLabel = styled.div`
  flex: 1;
`;

export const LabelText = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0.25rem;
  
  @media (max-width: 767px) {
    font-size: 0.95rem;
  }
`;

export const LabelDescription = styled.div`
  font-size: 0.875rem;
  color: #7f8c8d;
  line-height: 1.4;
  
  @media (max-width: 767px) {
    font-size: 0.8rem;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  
  @media (max-width: 767px) {
    width: 90%;
    flex-direction: column;
    gap: 0.25rem;
  }
`;

export const Button = styled.button<{ variant?: 'primary' | 'success' | 'warning' | 'danger' }>`
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  border: none;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  ${({ variant }) => {
    switch (variant) {
      case 'success':
        return `
          background: #27ae60;
          color: white;
          &:hover { background: #229954; }
          &:active { transform: scale(0.98); }
        `;
      case 'warning':
        return `
          background: #f39c12;
          color: white;
          &:hover { background: #e67e22; }
          &:active { transform: scale(0.98); }
        `;
      case 'danger':
        return `
          background: #e74c3c;
          color: white;
          &:hover { background: #c0392b; }
          &:active { transform: scale(0.98); }
        `;
      default:
        return `
          background: #3498db;
          color: white;
          &:hover { background: #2980b9; }
          &:active { transform: scale(0.98); }
        `;
    }
  }}
  
  @media (max-width: 767px) {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
`;

export const FileInputLabel = styled.label<{ variant?: 'primary' | 'success' | 'warning' | 'danger' }>`
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  border: none;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  ${({ variant }) => {
    switch (variant) {
      case 'warning':
        return `
          background: #f39c12;
          color: white;
          &:hover { background: #e67e22; }
          &:active { transform: scale(0.98); }
        `;
      default:
        return `
          background: #3498db;
          color: white;
          &:hover { background: #2980b9; }
          &:active { transform: scale(0.98); }
        `;
    }
  }}
  
  @media (max-width: 767px) {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 767px) {
    padding: 1.25rem;
    max-width: 100%;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.75rem;
`;

export const ModalIcon = styled.div`
  color: #e74c3c;
  display: flex;
  align-items: center;
`;

export const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  flex: 1;
  
  @media (max-width: 767px) {
    font-size: 1.1rem;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: #7f8c8d;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  
  &:hover {
    background: #f8f9fa;
    color: #2c3e50;
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

export const ModalBody = styled.p`
  margin: 0 0 1.5rem;
  color: #4a5568;
  line-height: 1.6;
  font-size: 0.95rem;
  
  strong {
    color: #e74c3c;
    font-weight: 600;
  }
  
  @media (max-width: 767px) {
    font-size: 0.9rem;
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  
  @media (max-width: 767px) {
    flex-direction: column-reverse;
  }
`;

export const ModalButton = styled.button<{ variant?: 'cancel' | 'danger' }>`
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  
  ${({ variant }) => {
    if (variant === 'danger') {
      return `
        background: #e74c3c;
        color: white;
        border: 1px solid #e74c3c;
        &:hover { background: #c0392b; border-color: #c0392b; }
      `;
    }
    return `
      background: transparent;
      color: #4a5568;
      border: 1px solid #cbd5e0;
      &:hover { background: #f7fafc; border-color: #a0aec0; }
    `;
  }}
  
  &:active {
    transform: scale(0.98);
  }
  
  @media (max-width: 767px) {
    width: 100%;
    justify-content: center;
    padding: 0.75rem 1rem;
  }
`;

export const InfoBox = styled.div`
  background: linear-gradient(135deg, #e8f4f8 0%, #d4e9f2 100%);
  border-left: 4px solid #3498db;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1.5rem;
  
  @media (max-width: 767px) {
    padding: 0.875rem;
    margin-top: 1rem;
  }
`;

export const InfoText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #34495e;
  line-height: 1.6;
  
  strong {
    font-weight: 600;
  }
  
  @media (max-width: 767px) {
    font-size: 0.85rem;
  }
`;
