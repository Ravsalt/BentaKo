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

// Helper functions for insights
const getInventoryInsight = (_total: number, lowStock: number, outOfStock: number, inventoryValue?: number) => {
  if (outOfStock > 0) {
    return `${outOfStock} ${outOfStock === 1 ? 'item needs' : 'items need'} restocking urgently`;
  }
  if (lowStock > 0) {
    return `${lowStock} ${lowStock === 1 ? 'item is' : 'items are'} running low`;
  }
  return inventoryValue ? `Total inventory value: ₱${inventoryValue.toLocaleString()}` : "All items are well-stocked! 🎉";
};

const getSalesInsight = (revenue: number, _itemsSold: number, avgOrderValue: number, trend: number) => {
  if (revenue === 0) return "No sales recorded yet. Time to start selling!";
  
  const trendIcon = trend > 0 ? '📈' : trend < 0 ? '📉' : '➡️';
  const trendText = trend !== 0 ? `${Math.abs(trend)}% ${trend > 0 ? 'increase' : 'decrease'} from last period` : 'stable';
  
  return `Avg. order: ₱${avgOrderValue.toFixed(2)} • ${trendIcon} ${trendText}`;
};

const getDebtsInsight = (active: number, totalDue: number, avgDaysToPay: number) => {
  if (active === 0) return "All caught up! No outstanding debts 🎊";
  
  const insights = [];
  if (totalDue > 0) insights.push(`₱${totalDue.toLocaleString()} total due`);
  if (avgDaysToPay > 0) insights.push(`Avg. ${avgDaysToPay}d to pay`);
  
  return insights.length > 0 ? insights.join(' • ') : `${active} ${active === 1 ? 'debt' : 'debts'} to follow up`;
};

// Helper to calculate percentage change
const calculateTrend = (current: number, previous: number) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
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
  
  // Date helper functions
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isThisWeek = (date: Date) => {
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay());
    firstDayOfWeek.setHours(0, 0, 0, 0);
    return date >= firstDayOfWeek;
  };

  const isThisMonth = (date: Date) => {
    const today = new Date();
    return date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const calculateSalesTotal = (filterFn: (date: Date) => boolean) => {
    return sales
      ?.filter(sale => filterFn(new Date(sale.date)))
      .reduce((acc, sale) => acc + (sale.price * sale.quantity), 0) ?? 0;
  };

  const outOfStockCount = React.useMemo(() => {
    if (!inventoryItems) return 0;
    return inventoryItems.filter(item => item.stock <= 0).length;
  }, [inventoryItems]);

  const activeDebts = debts?.filter((debt) => debt.status !== "Paid");
  const paidDebts = debts?.filter((debt) => debt.status === "Paid");
  const totalAmountDue = activeDebts?.reduce((acc, debt) => acc + debt.amount, 0) ?? 0;
  const totalRevenue = sales?.reduce((acc, item) => acc + (item.price * item.quantity), 0) ?? 0;
  const itemsSoldCount = sales?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;
  
  // Enhanced metrics calculation
  const todaysSales = calculateSalesTotal(isToday);
  const weeklySales = calculateSalesTotal(isThisWeek);
  const monthlySales = calculateSalesTotal(isThisMonth);
  
  // Calculate previous period for trends
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  
  const yesterdaySales = sales
    ?.filter(sale => new Date(sale.date).toDateString() === yesterday.toDateString())
    .reduce((acc, sale) => acc + (sale.price * sale.quantity), 0) ?? 0;
    
  const lastWeekSales = sales
    ?.filter(sale => {
      const saleDate = new Date(sale.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 14); // Two weeks ago
      return saleDate >= weekAgo && saleDate < lastWeek;
    })
    .reduce((acc, sale) => acc + (sale.price * sale.quantity), 0) ?? 0;
    
  // Calculate trends
  const dailyTrend = calculateTrend(todaysSales, yesterdaySales);
  const weeklyTrend = calculateTrend(weeklySales, lastWeekSales);
  
  // Calculate average order value
  const totalOrders = sales?.length || 1; // Avoid division by zero
  const avgOrderValue = totalRevenue / totalOrders;
  
  // Inventory metrics
  const inventoryValue = inventoryItems?.reduce((acc, item) => acc + (item.price * item.stock), 0) ?? 0;
  
  // Debt metrics
  const paidDebtsWithDate = paidDebts?.filter(d => d.paidDate) || [];
  const avgDaysToPay = paidDebtsWithDate.length > 0
    ? Math.round(paidDebtsWithDate.reduce((acc, debt) => {
        const created = new Date(debt.createdAt);
        const paid = new Date(debt.paidDate!);
        const diffTime = Math.abs(paid.getTime() - created.getTime());
        return acc + Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }, 0) / paidDebtsWithDate.length)
    : 0;

  const reportsData: ReportData[] = [
    {
      category: "Inventory Overview",
      icon: "📦",
      color: "#3498db",
      insight: getInventoryInsight(
        inventoryItems?.length ?? 0,
        lowStockItems?.length ?? 0,
        outOfStockCount,
        inventoryValue
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
          label: "Inventory Value",
          value: `₱${inventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          isLoading: isLoadingInventory,
          error: inventoryError ? "Error loading inventory" : undefined,
          icon: "💰",
        },
        {
          label: "Low Stock",
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
      insight: getSalesInsight(totalRevenue, itemsSoldCount, avgOrderValue, dailyTrend),
      summary: [
        {
          label: "Today's Sales",
          value: todaysSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          isLoading: isLoadingSales,
          error: salesError ? "Error loading sales data" : undefined,
          icon: "🛒",
          prefix: "₱",
          trend: dailyTrend,
          trendLabel: 'vs yesterday'
        },
        {
          label: "This Week's Sales",
          value: weeklySales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          isLoading: isLoadingSales,
          error: salesError ? "Error loading sales data" : undefined,
          icon: "📆",
          prefix: "₱",
          trend: weeklyTrend,
          trendLabel: 'vs last week'
        },
        {
          label: "This Month's Sales",
          value: monthlySales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          isLoading: isLoadingSales,
          error: salesError ? "Error loading sales data" : undefined,
          icon: "📅",
          prefix: "₱"
        },
        {
          label: "Avg. Order Value",
          value: avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          isLoading: isLoadingSales,
          error: salesError ? "Error loading sales data" : undefined,
          icon: "📊",
          prefix: "₱"
        },
        {
          label: "Total Items Sold",
          value: itemsSoldCount.toLocaleString(),
          isLoading: isLoadingSales,
          error: salesError ? "Error loading sales data" : undefined,
          icon: "📦"
        },
      ],
    },
    {
      category: "Debt Tracking",
      icon: "📝",
      color: "#e67e22",
      insight: getDebtsInsight(activeDebts?.length ?? 0, totalAmountDue, avgDaysToPay),
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
          label: "Total Amount Due",
          value: `₱${totalAmountDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          isLoading: isLoadingDebts,
          error: debtsError ? "Error loading debts" : undefined,
          icon: "💳",
          highlight: totalAmountDue > 0,
        },
        {
          label: "Paid This Month",
          value: `₱${(paidDebts?.reduce((acc, debt) => acc + debt.amount, 0) ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          isLoading: isLoadingDebts,
          error: debtsError ? "Error loading debts" : undefined,
          icon: "✅",
        },
        {
          label: "Avg. Days to Pay",
          value: avgDaysToPay > 0 ? `${avgDaysToPay} days` : 'N/A',
          isLoading: isLoadingDebts,
          error: debtsError ? "Error loading debts" : undefined,
          icon: "⏱️"
        },
        {
          label: "Payment Success Rate",
          value: debts && debts.length > 0 && paidDebts
            ? `${Math.round((paidDebts.length / debts.length) * 100)}%` 
            : 'N/A',
          isLoading: isLoadingDebts,
          error: debtsError ? "Error loading debts" : undefined,
          icon: "📊"
        }
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
              {report.summary.map((item: SummaryItem) => {
                const hasHighlight = 'highlight' in item ? item.highlight : false;
                const hasTrend = 'trend' in item && item.trend !== undefined;
                
                return (
                  <div 
                    key={item.label} 
                    style={{
                      ...summaryItem,
                      borderLeft: `4px solid ${report.color}`,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Highlight overlay */}
                    {hasHighlight && <div style={highlightStyle(true)} />}
                    
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
                        <>
                          {('prefix' in item && item.prefix) || ''}{item.value}
                          {hasTrend && (
                            <span style={{
                              ...trendStyle(item.trend),
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontSize: '0.8rem',
                              fontWeight: 500,
                              marginTop: '0.25rem',
                              color: item.trend > 0 ? '#10b981' : item.trend < 0 ? '#ef4444' : '#6b7280'
                            }}>
                              {item.trend > 0 ? '↑' : item.trend < 0 ? '↓' : '→'}
                              {Math.abs(item.trend)}% {item.trendLabel}
                            </span>
                          )}
                        </>
                      )}
                    </span>
                  </div>
                );
              })}
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

// Define base type for summary items
interface BaseSummaryItem {
  label: string;
  value: string | number;
  isLoading: boolean;
  error?: string;
  icon: string;
  highlight?: boolean;
  prefix?: string;
}

// Define type for items with trend data
interface SummaryItemWithTrend extends BaseSummaryItem {
  trend: number;
  trendLabel: string;
}

// Define type for items without trend data
interface SummaryItemWithoutTrend extends Omit<BaseSummaryItem, 'prefix'> {
  trend?: never;
  trendLabel?: never;
  prefix?: string;
}

// Combined type for all summary items
type SummaryItem = SummaryItemWithTrend | SummaryItemWithoutTrend;

// Define report data type
interface ReportData {
  category: string;
  icon: string;
  color: string;
  insight: string;
  summary: SummaryItem[];
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
  transition: "all 0.2s ease",
  position: "relative",
  overflow: "hidden",
};


const labelContainer: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  position: "relative",
  zIndex: 1,
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
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
};

const trendStyle = (trend?: number): React.CSSProperties => ({
  fontSize: "0.8rem",
  fontWeight: "500",
  color: trend === undefined ? "#6b7280" : trend > 0 ? "#10b981" : trend < 0 ? "#ef4444" : "#6b7280",
  display: "flex",
  alignItems: "center",
  gap: "0.25rem",
  marginTop: "0.25rem",
});

const highlightStyle = (highlight?: boolean): React.CSSProperties => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: highlight ? "rgba(255, 247, 205, 0.3)" : "transparent",
  border: highlight ? "1px solid #fef08a" : "1px solid transparent",
  borderRadius: "8px",
  transition: "all 0.2s ease",
});

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