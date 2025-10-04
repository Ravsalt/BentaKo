import React, { useState } from "react";
import { useDebtList, useCreateDebt, useUpdateDebt, useDeleteDebt } from "../hooks/useDebt";
import type { Debt, CreateDebt } from "../types/debt";
import { 
  UtangWrapper, Header, Title, AddButton, Table, Th, Td, Status, ActionButton, 
  ModalOverlay, ModalContent, FormGroup, Input, Select 
} from './utang/styles';
import { LoadingWrapper, Spinner, ErrorWrapper, ErrorIcon, ErrorMessage } from '../components/dashboard/styles';

const Utang = () => {
  const { data: debts = [], isLoading, error } = useDebtList();
  const createDebtMutation = useCreateDebt();
  const updateDebtMutation = useUpdateDebt();
  const deleteDebtMutation = useDeleteDebt();

  const [debtToDelete, setDebtToDelete] = useState<Debt | null>(null);
  const [editingDebt, setEditingDebt] = useState<Debt | CreateDebt | null>(null);

  // ... (handler functions remain the same)

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
            </tr>
          ))}
        </tbody>
      </Table>

      {editingDebt && (
        <ModalOverlay>
          <ModalContent>
            <h3>{'id' in editingDebt ? 'Edit' : 'Add New'} Debt</h3>
            <form onSubmit={handleEditSubmit}>
              {/* FormGroups with Inputs and Selects */}
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
