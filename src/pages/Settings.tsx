import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

export default function Settings() {
  const { theme, setTheme } = useContext(ThemeContext);

 

  const handleExport = (format: 'csv' | 'json') => {
    console.log('Exporting data to:', format);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      console.log('Clearing all data...');
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
          <div>
            <button style={styles.button} onClick={() => handleExport('csv')}>Export as CSV</button>
            <button style={styles.button} onClick={() => handleExport('json')}>Export as JSON</button>
          </div>
        </div>
        <div style={styles.settingItem}>
          <label style={styles.label}>Clear Data</label>
          <button style={{...styles.button, ...styles.dangerButton}} onClick={handleClearData}>Clear All Data</button>
        </div>
      </div>
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