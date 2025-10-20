import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { useSalesList } from '../hooks/useSales';
import { FiDollarSign, FiCreditCard, FiClock, FiPackage } from 'react-icons/fi';

// Import styles from the styles file
import { PageContainer, HeaderSection, PageTitle, Subtitle, LoadingSpinner, ErrorText, TransactionList, TransactionCard, TransactionHeader, TransactionInfo, TransactionDate, TransactionTitle, TransactionAmount, TransactionItems, TransactionItem, ItemName, ItemPrice, TransactionFooter, PaymentMethod, EmptyState } from './transactions/styles';

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
