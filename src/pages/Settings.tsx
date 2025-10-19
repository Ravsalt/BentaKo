import React, { useContext, useState } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { FiAlertTriangle, FiX, FiCheck, FiXCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export default function Settings() {
  const { theme, setTheme } = useContext(ThemeContext);
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
    <div style={styles.container}>
      <h1 style={styles.title}>Settings</h1>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Appearance</h2>
        <div style={styles.settingItem}>
          <label style={styles.label}>Theme</label>
          <div style={styles.themeSelector}>
            <button 
              style={theme === 'light' ? {...styles.themeButton, ...styles.activeTheme} : styles.themeButton} 
              onClick={() => setTheme('light')}
            >
              Light
            </button>
            <button 
              style={theme === 'dark' ? {...styles.themeButton, ...styles.activeTheme} : styles.themeButton} 
              onClick={() => setTheme('dark')}
            >
              Dark
            </button>
          </div>
        </div>
      </div>

      
     
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Data Management</h2>
        <div style={styles.settingItem}>
          <label style={styles.label}>Export Data</label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              style={{ ...styles.button, backgroundColor: '#4CAF50' }} 
              onClick={() => handleExport('csv')}
            >
              Export as CSV
            </button>
            <button 
              style={{ ...styles.button, backgroundColor: '#2196F3' }} 
              onClick={() => handleExport('json')}
            >
              Export as JSON
            </button>
            <label style={{
              ...styles.button,
              backgroundColor: '#FF9800',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              Import Data
              <input
                type="file"
                accept=".json,.csv"
                style={{ display: 'none' }}
                onChange={handleImport}
              />
            </label>
          </div>
        </div>
        <div style={styles.settingItem}>
          
          <label style={styles.label}>Wipe Data</label>
          <button style={{...styles.button, ...styles.dangerButton}} onClick={handleClearData}>Wipe All Data</button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: theme === 'dark' ? '#2d3748' : 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1rem',
              color: '#e53e3e',
            }}>
              <FiAlertTriangle size={24} style={{ marginRight: '0.5rem' }} />
              <h3 style={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: 600,
                color: theme === 'dark' ? 'white' : '#2d3748',
              }}>
                Confirm Action
              </h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                style={{
                  marginLeft: 'auto',
                  background: 'none',
                  border: 'none',
                  color: theme === 'dark' ? '#a0aec0' : '#718096',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FiX size={20} />
              </button>
            </div>

            <p style={{
              margin: '0 0 1.5rem',
              color: theme === 'dark' ? '#e2e8f0' : '#4a5568',
              lineHeight: '1.5',
            }}>
              This will permanently delete all local data including sales, inventory, and settings.
              <strong> This action cannot be undone.</strong>
            </p>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
            }}>
              <button
                onClick={() => setShowConfirmModal(false)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e0',
                  background: 'transparent',
                  color: theme === 'dark' ? '#e2e8f0' : '#4a5568',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = theme === 'dark' ? '#2d3748' : '#f7fafc';
                  e.currentTarget.style.borderColor = theme === 'dark' ? '#4a5568' : '#a0aec0';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = theme === 'dark' ? '#4a5568' : '#cbd5e0';
                }}
              >
                <FiXCircle />
                Cancel
              </button>
              <button
                onClick={confirmClearData}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #e53e3e',
                  background: '#e53e3e',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#c53030';
                  e.currentTarget.style.borderColor = '#c53030';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#e53e3e';
                  e.currentTarget.style.borderColor = '#e53e3e';
                }}
              >
                <FiCheck />
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '2rem',
    fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
    backgroundColor: '#f4f7f9',
    minHeight: '100vh',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '2rem',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#34495e',
    marginBottom: '1.5rem',
    borderBottom: '1px solid #eee',
    paddingBottom: '1rem',
  },
  settingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 0',
  },
  label: {
    fontSize: '1rem',
    color: '#555',
  },
  input: {
    fontSize: '1rem',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    border: '1px solid #ddd',
    width: '80px',
    textAlign: 'center',
  },
  button: {
    fontSize: '1rem',
    padding: '0.5rem 1.5rem',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#4a90e2',
    color: 'white',
    cursor: 'pointer',
    margin: '0 0.5rem',
  },
  dangerButton: {
    backgroundColor: '#f44336',
  },
  themeSelector: {
    display: 'flex',
    border: '1px solid #ddd',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  themeButton: {
    fontSize: '1rem',
    padding: '0.5rem 1.5rem',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  activeTheme: {
    backgroundColor: '#4a90e2',
    color: 'white',
  },
  toggleButton: {
    // Basic toggle button style
    fontSize: '1rem',
    padding: '0.5rem 1.5rem',
    borderRadius: '6px',
    border: '1px solid #ddd',
    backgroundColor: '#eee',
    cursor: 'pointer',
  }
};