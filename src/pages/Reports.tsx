import React from "react";
import { useInventoryList, useLowStockItems } from "../hooks/useInventory";
import { useDebtList } from "../hooks/useDebt";
import { useSalesList } from "../hooks/useSales";

// Error component for displaying error states
const ErrorIndicator = ({ message }: { message: string }) => (
  <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
    <span>⚠️</span>
    <span>{message}</span>
  </span>
);


const Spinner = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="#09f"
      strokeWidth="4"
      fill="none"
      strokeDasharray="15 80"
      strokeLinecap="round"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 12 12"
        to="360 12 12"
        dur="1s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);

// Helper function to get insights
const getInventoryInsight = (_total: number, lowStock: number, outOfStock: number) => {
  if (outOfStock > 0) {
    return `${outOfStock} ${outOfStock === 1 ? 'item needs' : 'items need'} restocking urgently`;
  }
  if (lowStock > 0) {
    return `${lowStock} ${lowStock === 1 ? 'item is' : 'items are'} running low`;
  }
  return "All items are well-stocked! 🎉";
};

const getSalesInsight = (revenue: number, itemsSold: number) => {
  if (revenue === 0) {
    return "No sales recorded yet. Time to start selling!";
  }
  const avgPrice = revenue / itemsSold;
  return `Average sale value: ₱${avgPrice.toFixed(2)}`;
};

const getDebtsInsight = (active: number, totalDue: number) => {
  if (active === 0) {
    return "All caught up! No outstanding debts 🎊";
  }
  if (totalDue > 0) {
    const avgDebt = totalDue / active;
    return `Average debt: ₱${avgDebt.toFixed(2)}`;
  }
  return `${active} ${active === 1 ? 'debt' : 'debts'} to follow up on`;
};

export default function Reports() {
  const { 
    data: inventoryItems, 
    isLoading: isLoadingInventory, 
    error: inventoryError 
  } = useInventoryList();
  
  const { 
    data: lowStockItems, 
    isLoading: isLoadingLowStock,
    error: lowStockError
  } = useLowStockItems();
  
  const { 
    data: debts, 
    isLoading: isLoadingDebts,
    error: debtsError
  } = useDebtList();
  
  const { 
    data: sales, 
    isLoading: isLoadingSales,
    error: salesError
  } = useSalesList();
  
  const outOfStockCount = React.useMemo(() => {
    if (!inventoryItems) return 0;
    return inventoryItems.filter(item => item.stock <= 0).length;
  }, [inventoryItems]);

  const activeDebts = debts?.filter((debt) => debt.status !== "Paid");
  const paidDebts = debts?.filter((debt) => debt.status === "Paid");
  const totalAmountDue = activeDebts?.reduce((acc, debt) => acc + debt.amount, 0) ?? 0;
  const totalRevenue = sales?.reduce((acc, item) => acc + (item.price * item.quantity), 0) ?? 0;
  const itemsSoldCount = sales?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

  const reportsData = [
    {
      category: "Inventory Overview",
      icon: "📦",
      color: "#3498db",
      insight: getInventoryInsight(
        inventoryItems?.length ?? 0,
        lowStockItems?.length ?? 0,
        outOfStockCount
      ),
      summary: [
        {
          label: "Total Items",
          value: inventoryItems?.length ?? 0,
          isLoading: isLoadingInventory,
          error: inventoryError ? "Error loading inventory" : undefined,
          icon: "📋",
        },
        {
          label: "Low Stock Items",
          value: lowStockItems?.length ?? 0,
          isLoading: isLoadingLowStock,
          error: lowStockError ? "Error loading low stock items" : undefined,
          icon: "⚠️",
          highlight: (lowStockItems?.length ?? 0) > 0,
        },
        {
          label: "Out of Stock",
          value: outOfStockCount,
          isLoading: isLoadingInventory,
          error: inventoryError ? "Error loading inventory" : undefined,
          icon: "🚫",
          highlight: outOfStockCount > 0,
        },
      ],
    },
    {
      category: "Sales Performance",
      icon: "💰",
      color: "#27ae60",
      insight: getSalesInsight(totalRevenue, itemsSoldCount),
      summary: [
        {
          label: "Total Revenue",
          value: `₱${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          isLoading: isLoadingSales,
          error: salesError ? "Error loading sales data" : undefined,
          icon: "💵",
        },
        {
          label: "Items Sold",
          value: itemsSoldCount,
          isLoading: isLoadingSales,
          error: salesError ? "Error loading sales data" : undefined,
          icon: "📊",
        },
      ],
    },
    {
      category: "Debt Tracking",
      icon: "📝",
      color: "#e67e22",
      insight: getDebtsInsight(activeDebts?.length ?? 0, totalAmountDue),
      summary: [
        {
          label: "Active Debts",
          value: activeDebts?.length ?? 0,
          isLoading: isLoadingDebts,
          error: debtsError ? "Error loading debts" : undefined,
          icon: "⏳",
          highlight: (activeDebts?.length ?? 0) > 0,
        },
        {
          label: "Paid Off",
          value: paidDebts?.length ?? 0,
          isLoading: isLoadingDebts,
          error: debtsError ? "Error loading debts" : undefined,
          icon: "✅",
        },
        {
          label: "Total Amount Due",
          value: `₱${totalAmountDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          isLoading: isLoadingDebts,
          error: debtsError ? "Error loading debts" : undefined,
          icon: "💳",
          highlight: totalAmountDue > 0,
        },
      ],
    },
  ];

  return (
    <div style={pageContainer}>
      <div style={headerSection}>
        <h1 style={pageTitle}>📈 Business Overview</h1>
        <p style={subtitle}>Here's a quick snapshot of how your business is doing today</p>
      </div>
      
      <div style={reportsGrid}>
        {reportsData.map((report) => (
          <div key={report.category} style={{...card, borderTop: `4px solid ${report.color}`}}>
            <div style={cardHeader}>
              <h2 style={sectionTitle}>
                <span style={{ marginRight: "0.5rem", fontSize: "1.75rem" }}>{report.icon}</span>
                {report.category}
              </h2>
              <p style={insightText}>{report.insight}</p>
            </div>
            
            <div style={summaryContainer}>
              {report.summary.map((item) => (
                <div 
                  key={item.label} 
                  style={{
                    ...summaryItem                  }}
                >
                  <div style={labelContainer}>
                    <span style={itemIcon}>{item.icon}</span>
                    <span style={summaryLabel}>{item.label}</span>
                  </div>
                  <span style={summaryValue}>
                    {item.isLoading ? (
                      <Spinner />
                    ) : item.error ? (
                      <ErrorIndicator message={item.error} />
                    ) : (
                      item.value
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div style={footerNote}>
        <p style={footerText}>
          💡 <strong>Tip:</strong> Check your inventory regularly to avoid stockouts, 
          and follow up on active debts to maintain healthy cash flow!
        </p>
      </div>
    </div>
  );
}

const pageContainer: React.CSSProperties = {
  padding: "2rem",
  fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  backgroundColor: "#f8f9fa",
  minHeight: "100vh",
};

const headerSection: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "3rem",
};

const pageTitle: React.CSSProperties = {
  fontSize: "2.5rem",
  fontWeight: "700",
  color: "#2c3e50",
  marginBottom: "0.5rem",
};

const subtitle: React.CSSProperties = {
  fontSize: "1.1rem",
  color: "#7f8c8d",
  fontWeight: "400",
};

const reportsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
  gap: "2rem",
  marginBottom: "2rem",
};

const card: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  padding: "2rem",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

const cardHeader: React.CSSProperties = {
  marginBottom: "1.5rem",
  paddingBottom: "1rem",
  borderBottom: "2px solid #f0f0f0",
};

const sectionTitle: React.CSSProperties = {
  fontSize: "1.4rem",
  fontWeight: "600",
  color: "#34495e",
  marginBottom: "0.5rem",
  display: "flex",
  alignItems: "center",
};

const insightText: React.CSSProperties = {
  fontSize: "0.95rem",
  color: "#7f8c8d",
  fontStyle: "italic",
  marginTop: "0.5rem",
};

const summaryContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
};

const summaryItem: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem",
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  transition: "background-color 0.2s ease",
};


const labelContainer: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

const itemIcon: React.CSSProperties = {
  fontSize: "1.2rem",
};

const summaryLabel: React.CSSProperties = {
  fontSize: "1rem",
  color: "#555",
  fontWeight: "500",
};

const summaryValue: React.CSSProperties = {
  fontSize: "1.4rem",
  fontWeight: "700",
  color: "#2c3e50",
};

const footerNote: React.CSSProperties = {
  marginTop: "2rem",
  padding: "1.5rem",
  backgroundColor: "#e8f4f8",
  borderRadius: "8px",
  borderLeft: "4px solid #3498db",
};

const footerText: React.CSSProperties = {
  fontSize: "0.95rem",
  color: "#34495e",
  margin: "0",
  lineHeight: "1.6",
};