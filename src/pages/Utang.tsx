import React, { useState } from "react";
import { useDebtList, useCreateDebt, useUpdateDebt, useDeleteDebt } from "../hooks/useDebt";
import type { Debt, CreateDebt } from "../types/debt";
import { 
  UtangWrapper, Header, Title, AddButton, Table, Th, Td, Status, ActionButton, 
  ModalOverlay, ModalContent, FormGroup, FormActions, Input, Select 
} from './utang/styles';
import { LoadingWrapper, Spinner, ErrorWrapper, ErrorIcon, ErrorMessage } from '../components/dashboard/styles';

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
        const { id, ...updateData } = editingDebt;
        await updateDebtMutation.mutateAsync({ id, data: updateData });
      } else {
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

  if (isLoading) return <LoadingWrapper><Spinner /></LoadingWrapper>;
  if (error) return <ErrorWrapper><ErrorIcon>...</ErrorIcon><ErrorMessage>Error loading debts: {error.message}</ErrorMessage></ErrorWrapper>;

  return (
    <UtangWrapper>
      <Header>
        <Title>Debt Management</Title>
        <AddButton onClick={() => setEditingDebt({ debtor: '', amount: 0, date: new Date().toISOString().split('T')[0], dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], description: '', status: 'Unpaid' })}>
          Add New Debt
        </AddButton>
      </Header>
      
      <Table>
        <thead>
          <tr>
            <Th>Debtor</Th>
            <Th>Amount</Th>
            <Th>Due Date</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
            <Th>Date Paid</Th>
          </tr>
        </thead>
        <tbody>
          {debts.map((debt) => (
            <tr key={debt.id}>
              <Td>{debt.debtor}</Td>
              <Td>₱{debt.amount.toFixed(2)}</Td>
              <Td>{new Date(debt.dueDate).toLocaleDateString()}</Td>
              <Td><Status status={debt.status}>{debt.status}</Status></Td>
              <Td>
                <ActionButton onClick={() => handleEdit(debt)}>Edit</ActionButton>
                <ActionButton className="delete" onClick={() => handleDelete(debt)}>Delete</ActionButton>
                {debt.status === 'Unpaid' && <ActionButton className="paid" onClick={() => handlePaid(debt)}>Mark Paid</ActionButton>}
              </Td>
              <Td>{debt.status === 'Paid' ? (debt.paidDate ? new Date(debt.paidDate).toLocaleDateString() : 'N/A') : ''}</Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {editingDebt && (
        <ModalOverlay>
          <ModalContent>
            <h3>{'id' in editingDebt ? 'Edit' : 'Add New'} Debt</h3>
            <form onSubmit={handleEditSubmit}>
              <FormGroup>
                <label>Debtor Name</label>
                <Input type="text" name="debtor" value={editingDebt.debtor} onChange={handleEditChange} required />
              </FormGroup>
              <FormGroup>
                <label>Amount (₱)</label>
                <Input type="number" name="amount" value={editingDebt.amount} onChange={handleEditChange} min="0" step="0.01" required />
              </FormGroup>
              <FormGroup>
                <label>Due Date</label>
                <Input type="date" name="dueDate" value={editingDebt.dueDate} onChange={handleEditChange} required />
              </FormGroup>
              <FormGroup>
                <label>Description</label>
                <Input name="description" value={editingDebt.description} onChange={handleEditChange} />
              </FormGroup>
              <FormGroup>
                <label>Status</label>
                <Select name="status" value={editingDebt.status} onChange={handleEditChange}>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                </Select>
              </FormGroup>
              <FormActions>
                <ActionButton type="button" onClick={() => setEditingDebt(null)}>Cancel</ActionButton>
                <ActionButton type="submit">Save Changes</ActionButton>
              </FormActions>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}

      {debtToDelete && (
        <ModalOverlay>
          <ModalContent>
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete the debt for <strong>{debtToDelete.debtor}</strong> (₱{debtToDelete.amount.toFixed(2)})?</p>
            <div>
              <ActionButton onClick={cancelDelete}>Cancel</ActionButton>
              <ActionButton className="delete" onClick={confirmDelete}>Delete</ActionButton>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </UtangWrapper>
  );
};

export default Utang;