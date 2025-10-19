import React, { useState } from 'react';
import { FiAlertTriangle, FiX, FiCheck, FiXCircle, FiDownload, FiUpload, FiTrash2, FiSettings as FiSettingsIcon } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import {
  SettingsContainer, PageHeader, PageTitle, PageSubtitle, Section, SectionHeader,
  SectionIcon, SectionTitle, SettingItem, SettingLabel, LabelText, LabelDescription,
  ButtonGroup, Button, FileInputLabel, HiddenFileInput, ModalOverlay, ModalContent,
  ModalHeader, ModalIcon, ModalTitle, CloseButton, ModalBody, ModalFooter,
  ModalButton, InfoBox, InfoText
} from './settings/styles';

export default function Settings() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

 

  // Improved export function with better CSV handling
  const handleExport = async (format: 'csv' | 'json') => {
    try {
      console.log('Starting export...');
      
      // Get all data from localStorage
      const data: Record<string, any> = {};
      const localStorageLength = localStorage.length;
      console.log(`Found ${localStorageLength} items in localStorage`);
      
      if (localStorageLength === 0) {
        console.warn('localStorage is empty');
        toast.error('No data found to export');
        return;
      }
      
      // Get all data first
      for (let i = 0; i < localStorageLength; i++) {
        const key = localStorage.key(i);
        if (key && !key.startsWith('_')) { // Skip internal keys
          try {
            const value = localStorage.getItem(key);
            if (value !== null) {
              try {
                data[key] = JSON.parse(value);
              } catch {
                data[key] = value; // Store as string if not valid JSON
              }
            }
          } catch (e) {
            console.error(`Error processing key ${key}:`, e);
            data[key] = null;
          }
        }
      }

      if (Object.keys(data).length === 0) {
        toast.error('No valid data found to export');
        return;
      }

      let content = '';
      let filename = `bentako-export-${new Date().toISOString().split('T')[0]}`;
      let mimeType = '';

      if (format === 'json') {
        content = JSON.stringify(data, null, 2);
        filename += '.json';
        mimeType = 'application/json';
      } else {
        // For CSV, we'll create a simplified format since localStorage data can be complex
        const csvRows: string[] = [];
        
        // CSV Header
        csvRows.push('key,value');
        
        // Add data rows
        Object.entries(data).forEach(([key, value]) => {
          const row = [
            `"${key.replace(/"/g, '""')}"`,
            `"${JSON.stringify(value).replace(/"/g, '""')}"`
          ];
          csvRows.push(row.join(','));
        });
        
        content = csvRows.join('\n');
        filename += '.csv';
        mimeType = 'text/csv;charset=utf-8;';
      }

      // Create and trigger download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`Data exported successfully as ${format.toUpperCase()}!`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Import data from file
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      if (!content) {
        toast.error('Failed to read file');
        return;
      }

      try {
        let data: Record<string, any> = {};
        const isJSON = file.name.endsWith('.json');
        
        if (isJSON) {
          data = JSON.parse(content);
        } else {
          // Simple CSV parsing
          const lines = content.split('\n').filter(line => line.trim() !== '');
          if (lines.length < 2) {
            throw new Error('Invalid CSV format');
          }
          
          // Skip header if it exists
          const startLine = lines[0].startsWith('key,') ? 1 : 0;
          
          for (let i = startLine; i < lines.length; i++) {
            const line = lines[i];
            try {
              // Simple CSV parsing - this is a basic implementation
              const [key, ...rest] = line.split(',');
              const value = rest.join(',');
              if (key && value) {
                const cleanKey = key.replace(/^"|"$/g, '');
                try {
                  data[cleanKey] = JSON.parse(value.replace(/^"|"$/g, '').replace(/\\(")/g, '$1'));
                } catch {
                  data[cleanKey] = value.replace(/^"|"$/g, '');
                }
              }
            } catch (e) {
              console.error(`Error parsing line ${i + 1}:`, e);
            }
          }
        }

        // Ask for confirmation before importing
        if (!window.confirm(`This will import ${Object.keys(data).length} items. Continue?`)) {
          return;
        }

        // Import the data
        let importedCount = 0;
        for (const [key, value] of Object.entries(data)) {
          try {
            const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
            localStorage.setItem(key, valueToStore);
            importedCount++;
          } catch (e) {
            console.error(`Failed to import key ${key}:`, e);
          }
        }

        toast.success(`Successfully imported ${importedCount} items!`);
        
        // Refresh the page to reflect changes
        setTimeout(() => window.location.reload(), 1000);
        
      } catch (error) {
        console.error('Import failed:', error);
        toast.error(`Import failed: ${error instanceof Error ? error.message : 'Invalid file format'}`);
      }
    };

    reader.onerror = () => {
      toast.error('Error reading file');
    };

    if (file.name.endsWith('.json') || file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      toast.error('Unsupported file type. Please use .json or .csv');
    }
    
    // Reset the input to allow re-uploading the same file
    event.target.value = '';
  };

  const handleClearData = () => {
    setShowConfirmModal(true);
  };

  const confirmClearData = async () => {
    setShowConfirmModal(false);
    try {
      // Clear all localStorage data
      localStorage.clear();
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // If using IndexedDB, you can clear it here
      // Note: This is a simplified example, you might need to handle IndexedDB cleanup based on your implementation
      
      // Clear any cookies (optional, if used)
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.trim().split('=');
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });

      
      // Refresh the application to reset state
      window.location.reload();
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('Failed to clear all data. Please try again.');
    }
  };

  return (
    <SettingsContainer>
      <PageHeader>
        <PageTitle>
          <FiSettingsIcon />
          Settings
        </PageTitle>
        <PageSubtitle>Manage your application data and preferences</PageSubtitle>
      </PageHeader>

      <Section>
        <SectionHeader>
          <SectionIcon>💾</SectionIcon>
          <SectionTitle>Data Management</SectionTitle>
        </SectionHeader>
        
        <SettingItem>
          <SettingLabel>
            <LabelText>Export Data</LabelText>
            <LabelDescription>
              Download your sales, inventory, and debt data as CSV or JSON
            </LabelDescription>
          </SettingLabel>
          <ButtonGroup>
            <Button variant="success" onClick={() => handleExport('csv')}>
              <FiDownload />
              Export CSV
            </Button>
            <Button variant="primary" onClick={() => handleExport('json')}>
              <FiDownload />
              Export JSON
            </Button>
          </ButtonGroup>
        </SettingItem>
        
        <SettingItem>
          <SettingLabel>
            <LabelText>Import Data</LabelText>
            <LabelDescription>
              Restore your data from a previously exported file
            </LabelDescription>
          </SettingLabel>
          <ButtonGroup>
            <FileInputLabel variant="warning">
              <FiUpload />
              Import Data
              <HiddenFileInput
                type="file"
                accept=".json,.csv"
                onChange={handleImport}
              />
            </FileInputLabel>
          </ButtonGroup>
        </SettingItem>
        
        <SettingItem>
          <SettingLabel>
            <LabelText>Clear All Data</LabelText>
            <LabelDescription>
              Permanently delete all local data. This action cannot be undone.
            </LabelDescription>
          </SettingLabel>
          <ButtonGroup>
            <Button variant="danger" onClick={handleClearData}>
              <FiTrash2 />
              Wipe All Data
            </Button>
          </ButtonGroup>
        </SettingItem>
      </Section>
      
      <InfoBox>
        <InfoText>
          💡 <strong>Tip:</strong> Regularly export your data to keep backups. 
          Your data is stored locally in your browser and will be lost if you clear browser data.
        </InfoText>
      </InfoBox>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalIcon>
                <FiAlertTriangle size={24} />
              </ModalIcon>
              <ModalTitle>Confirm Action</ModalTitle>
              <CloseButton onClick={() => setShowConfirmModal(false)}>
                <FiX size={20} />
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              This will permanently delete all local data including sales, inventory, and settings.
              <strong> This action cannot be undone.</strong>
            </ModalBody>

            <ModalFooter>
              <ModalButton variant="cancel" onClick={() => setShowConfirmModal(false)}>
                <FiXCircle />
                Cancel
              </ModalButton>
              <ModalButton variant="danger" onClick={confirmClearData}>
                <FiCheck />
                Clear All Data
              </ModalButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </SettingsContainer>
  );
}
