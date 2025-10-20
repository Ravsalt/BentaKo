import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { useSalesList } from '../hooks/useSales';
import styled from 'styled-components';
import { FiDollarSign, FiCreditCard, FiClock, FiPackage } from 'react-icons/fi';

// Styled Components
const PageContainer = styled.div`
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 120px);
  padding-bottom: 5rem;
  
  @media (min-width: 768px) {
    padding: 1.5rem 2rem 2rem;
    min-height: calc(100vh - 180px);
  }
`;

const HeaderSection = styled.div`
  margin-bottom: 1.5rem;
  
  @media (max-width: 767px) {
    margin-bottom: 1.25rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  @media (max-width: 767px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin: 0;
  opacity: 0.9;
  
  @media (max-width: 767px) {
    font-size: 0.875rem;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  padding: 3rem 0;
  
  &::after {
    content: "";
    width: 2.5rem;
    height: 2.5rem;
    border: 3px solid ${({ theme }) => theme.colors.primary};
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorText = styled.div`
  background: ${({ theme }) => `${theme.colors.error}15`};
  color: ${({ theme }) => theme.colors.error};
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  margin: 1rem 0;
  font-weight: 500;
  
  span:first-child {
    margin-right: 0.5rem;
  }
`;

const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
  
  @media (max-width: 767px) {
    gap: 0.75rem;
    margin-top: 1.25rem;
  }
`;

const TransactionCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  
  @media (max-width: 767px) {
    padding: 1rem;
    border-radius: 10px;
  }
`;

const TransactionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  
  @media (max-width: 767px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const TransactionInfo = styled.div`
  flex: 1;
`;

const TransactionDate = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

const TransactionTitle = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  
  @media (max-width: 767px) {
    font-size: 1.05rem;
  }
`;

const TransactionAmount = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-align: right;
  
  @media (max-width: 767px) {
    font-size: 1.1rem;
    text-align: left;
    width: 100%;
    padding-top: 0.5rem;
    border-top: 1px dashed ${({ theme }) => theme.colors.primary};
    margin-top: 0.75rem;
  }
`;

const TransactionItems = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TransactionItem = styled.li`
  display: flex;
  justify-content: space-between;
  font-size: 0.9375rem;
  
  @media (max-width: 767px) {
    font-size: 0.875rem;
  }
`;

const ItemName = styled.span`
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
`;

const ItemPrice = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  margin-left: 1rem;
  min-width: 80px;
  text-align: right;
`;

const TransactionFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.colors.primary};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
  
  @media (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const PaymentMethod = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    font-size: 1.1em;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.colors.textLight};
  
  svg {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    opacity: 0.7;
  }
  
  p {
    margin: 0.5rem 0 0;
    font-size: 0.9375rem;
  }
`;

// Transaction type
type Transaction = {
  id: string;
  date: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  paymentMethod: 'Cash' | 'GCash' | 'Bank Transfer' | 'Credit Card' | 'Other';
  status: 'completed' | 'pending' | 'refunded';
};

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Fetch sales data using your existing hook
  const { data: salesData, isLoading, error } = useSalesList();

  // Transform sales data into transactions
  useEffect(() => {
    if (salesData) {
      // Group sales by transaction (assuming sales have a transactionId or similar)
      // This is a simplified example - adjust according to your actual data structure
      const transactionMap = new Map<string, Transaction>();
      
      salesData.forEach((sale: any) => {
        const transactionDate = new Date(sale.date).toISOString().split('T')[0];
        
        if (!transactionMap.has(transactionDate)) {
          transactionMap.set(transactionDate, {
            id: transactionDate,
            date: transactionDate,
            items: [],
            total: 0,
            paymentMethod: 'Cash', // Default or get from your data
            status: 'completed',
          });
        }
        
        const transaction = transactionMap.get(transactionDate)!;
        transaction.items.push({
          id: sale.id,
          name: sale.name,
          price: sale.price,
          quantity: sale.quantity,
        });
        
        transaction.total += sale.price * sale.quantity;
      });
      
      setTransactions(Array.from(transactionMap.values()));
    }
  }, [salesData]);

  // Format payment method icon
  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'GCash':
        return <FiCreditCard />;
      case 'Cash':
        return <FiDollarSign />;
      default:
        return <FiCreditCard />;
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <HeaderSection>
          <PageTitle>Transaction History</PageTitle>
          <Subtitle>Loading your transactions...</Subtitle>
        </HeaderSection>
        <LoadingSpinner />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <HeaderSection>
          <PageTitle>Transaction History</PageTitle>
          <Subtitle>View and manage your sales transactions</Subtitle>
        </HeaderSection>
        <ErrorText>⚠️ Error loading transactions. Please try again later.</ErrorText>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <HeaderSection>
        <PageTitle>
          <FiDollarSign />
          Transaction History
        </PageTitle>
        <Subtitle>{transactions.length} total transactions</Subtitle>
      </HeaderSection>

      <TransactionList>
        {transactions.length === 0 ? (
          <EmptyState>
            <FiPackage />
            <h3>No transactions yet</h3>
            <p>Your sales will appear here</p>
          </EmptyState>
        ) : (
          transactions.map((transaction) => (
            <TransactionCard key={transaction.id}>
              <TransactionHeader>
                <TransactionInfo>
                  <TransactionDate>
                    <FiClock size={14} />
                    {format(parseISO(transaction.date), 'MMM d, yyyy • h:mm a')}
                  </TransactionDate>
                  <TransactionTitle>
                    {transaction.items.length} {transaction.items.length === 1 ? 'Item' : 'Items'}
                  </TransactionTitle>
                </TransactionInfo>
                <TransactionAmount>
                  ₱{transaction.total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </TransactionAmount>
              </TransactionHeader>
              
              <TransactionItems>
                {transaction.items.slice(0, 3).map((item) => (
                  <TransactionItem key={item.id}>
                    <ItemName>
                      {item.quantity} × {item.name}
                    </ItemName>
                    <ItemPrice>
                      ₱{(item.price * item.quantity).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                    </ItemPrice>
                  </TransactionItem>
                ))}
                {transaction.items.length > 3 && (
                  <TransactionItem>
                    <ItemName style={{ color: 'inherit', opacity: 0.8 }}>
                      +{transaction.items.length - 3} more items
                    </ItemName>
                  </TransactionItem>
                )}
              </TransactionItems>
              
              <TransactionFooter>
                <PaymentMethod>
                  {getPaymentIcon(transaction.paymentMethod)}
                  {transaction.paymentMethod}
                </PaymentMethod>
                <span>
                  {transaction.status === 'completed' ? 'Completed' : 
                   transaction.status === 'pending' ? 'Pending' : 'Refunded'}
                </span>
              </TransactionFooter>
            </TransactionCard>
          ))
        )}
      </TransactionList>
    </PageContainer>
  );
};

export default Transactions;
