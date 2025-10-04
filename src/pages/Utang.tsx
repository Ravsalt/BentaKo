import React, { useState } from "react";
import { theme } from "../theme";
import { useDebtList, useCreateDebt, useUpdateDebt, useDeleteDebt } from "../hooks/useDebt";
import type { Debt, CreateDebt } from "../types/debt";

const Utang = () => {
  const { data: debts = [], isLoading, error } = useDebtList();
  const createDebtMutation = useCreateDebt();
  const updateDebtMutation = useUpdateDebt();
  const deleteDebtMutation = useDeleteDebt();

  const [debtToDelete, setDebtToDelete] = useState<Debt | null>(null);
  const [editingDebt, setEditingDebt] = useState<Debt | CreateDebt | null>(null);

  const handleEdit = (debt: Debt) => {
    setEditingDebt({ ...debt });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDebt) return;

    try {
      if ('id' in editingDebt) {
        // Update existing debt
        const { id, ...updateData } = editingDebt;
        await updateDebtMutation.mutateAsync({ id, data: updateData });
      } else {
        // Create new debt
        await createDebtMutation.mutateAsync(editingDebt);
      }
      setEditingDebt(null);
    } catch (error) {
      console.error('Error saving debt:', error);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editingDebt) {
      const { name, value } = e.target;
      setEditingDebt({
        ...editingDebt,
        [name]: name === 'amount' ? parseFloat(value) || 0 : value
      });
    }
  };

  const handlePaid = async (debt: Debt) => {
    try {
      await updateDebtMutation.mutateAsync({
        id: debt.id,
        data: { 
          status: 'Paid',
          paidDate: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error marking as paid:', error);
    }
  };

  const handleDelete = (debt: Debt) => {
    setDebtToDelete(debt);
  };

  const confirmDelete = async () => {
    if (debtToDelete) {
      try {
        await deleteDebtMutation.mutateAsync(debtToDelete.id);
        setDebtToDelete(null);
      } catch (error) {
        console.error('Error deleting debt:', error);
      }
    }
  };

  const cancelDelete = () => {
    setDebtToDelete(null);
  };

  if (isLoading) return <div>Loading debts...</div>;
  if (error) return <div>Error loading debts: {error.message}</div>;

  // Form Styles
  const formGroup = {
    marginBottom: '1rem',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ced4da',
    fontSize: '1rem',
    marginTop: '0.25rem',
  };

  // Component Styles
  const btn = {
    marginRight: "0.5rem",
    padding: "0.4rem 0.8rem",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const modalOverlay = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const modalContent = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginTop: '1rem',
  };

  const thStyle = {
    backgroundColor: '#f8f9fa',
    padding: '0.75rem',
    textAlign: 'left' as const,
    borderBottom: '1px solid #dee2e6',
  };

  const tdStyle = {
    padding: '0.75rem',
    borderBottom: '1px solid #dee2e6',
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Debt Management</h2>
        <button 
          onClick={() => setEditingDebt({
            debtor: '',
            amount: 0,
            date: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            description: '',
            status: 'Unpaid'
          })}
          style={{
            ...btn,
            backgroundColor: theme.colors.primary,
            padding: '0.5rem 1rem'
          }}
        >
          Add New Debt
        </button>
      </div>
      
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Debtor</th>
            <th style={thStyle}>Amount</th>
            <th style={thStyle}>Due Date</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {debts.map((debt) => (
            <tr key={debt.id}>
              <td style={tdStyle}>{debt.debtor}</td>
              <td style={tdStyle}>₱{debt.amount.toFixed(2)}</td>
              <td style={tdStyle}>{new Date(debt.dueDate).toLocaleDateString()}</td>
              <td style={tdStyle}>
                <span style={{ 
                  color: debt.status === 'Paid' ? '#28a745' : '#dc3545',
                  fontWeight: 'bold'
                }}>
                  {debt.status}
                </span>
              </td>
              <td style={tdStyle}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => handleEdit(debt)}
                    style={{ 
                      ...btn, 
                      backgroundColor: theme.colors.primary,
                      flex: '1 0 auto',
                      minWidth: '80px'
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(debt)}
                    style={{ 
                      ...btn, 
                      backgroundColor: '#dc3545',
                      flex: '1 0 auto',
                      minWidth: '80px'
                    }}
                  >
                    Delete
                  </button>
                  {debt.status === 'Unpaid' ? (
                    <button 
                      onClick={() => handlePaid(debt)}
                      style={{ 
                        ...btn, 
                        backgroundColor: '#28a745',
                        flex: '1 0 auto',
                        minWidth: '80px'
                      }}
                    >
                      Mark Paid
                    </button>
                  ) : (
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '0.5rem',
                      color: '#28a745',
                      fontSize: '0.85rem',
                      flex: '1 0 100%',
                      marginTop: '0.5rem',
                      borderTop: '1px solid #e9ecef',
                      width: '100%'
                    }}>
                      <div>Paid on:</div>
                      <div style={{ fontWeight: 'bold' }}>
                        {debt.paidDate ? new Date(debt.paidDate).toLocaleString() : 'N/A'}
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Debt Modal */}
      {editingDebt && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>{'id' in editingDebt ? 'Edit' : 'Add New'} Debt</h3>
            <form onSubmit={handleEditSubmit}>
              <div style={formGroup}>
                <label>Debtor Name</label>
                <input
                  type="text"
                  name="debtor"
                  value={editingDebt.debtor}
                  onChange={handleEditChange}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={formGroup}>
                <label>Amount (₱)</label>
                <input
                  type="number"
                  name="amount"
                  value={editingDebt.amount}
                  onChange={handleEditChange}
                  style={inputStyle}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div style={formGroup}>
                <label>Due Date</label>
                <input
                  type="date"
                  name="date"
                  value={editingDebt.date}
                  onChange={handleEditChange}
                  style={inputStyle}
                  required
                  disabled={editingDebt?.id ? true : false} // Disable editing of creation date for existing debts
                />
              </div>
              <div style={formGroup}>
                <label>Description</label>
                <input
                  name="description"
                  value={editingDebt.description}
                  onChange={handleEditChange}
                  style={inputStyle}
                />
              </div>
              <div style={formGroup}>
                <label>Status</label>
                <select
                  name="status"
                  value={editingDebt.status}
                  onChange={handleEditChange}
                  style={inputStyle}
                >
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
                <button 
                  type="button"
                  onClick={() => setEditingDebt(null)}
                  style={{ ...btn, backgroundColor: '#6c757d' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ ...btn, backgroundColor: theme.colors.primary }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {debtToDelete && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete the debt for <strong>{debtToDelete.debtor}</strong> (₱{debtToDelete.amount.toFixed(2)})?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button 
                onClick={cancelDelete}
                style={{ ...btn, backgroundColor: '#6c757d' }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                style={{ ...btn, backgroundColor: '#dc3545' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Utang;
