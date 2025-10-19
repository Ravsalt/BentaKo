import React from "react";
import { useInventoryList, useLowStockItems } from "../hooks/useInventory";
import { useDebtList } from "../hooks/useDebt";
import { useSalesList } from "../hooks/useSales";
import {
  PageContainer, HeaderSection, PageTitle, Subtitle, ReportsGrid, Card,
  CardHeader, SectionTitle, IconWrapper, InsightText, SummaryContainer,
  SummaryItem, LabelContainer, ItemIcon, SummaryLabel, ValueContainer,
  SummaryValue, TrendIndicator, FooterNote, FooterText, LoadingSpinner, ErrorText
} from './reports/newStyles';

// Error component for displaying error states
const ErrorIndicator = ({ message }: { message: string }) => (
  <ErrorText>
    <span>⚠️</span>
    <span>{message}</span>
  </ErrorText>
);

const Spinner = () => <LoadingSpinner />;

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
    <PageContainer>
      <HeaderSection>
        <PageTitle>📈 Business Overview</PageTitle>
        <Subtitle>Here's a quick snapshot of how your business is doing today</Subtitle>
      </HeaderSection>
      
      <ReportsGrid>
        {reportsData.map((report) => (
          <Card key={report.category} borderColor={report.color}>
            <CardHeader>
              <SectionTitle>
                <IconWrapper>{report.icon}</IconWrapper>
                {report.category}
              </SectionTitle>
              <InsightText>{report.insight}</InsightText>
            </CardHeader>
            
            <SummaryContainer>
              {report.summary.map((item: SummaryItem) => {
                const hasHighlight = 'highlight' in item ? item.highlight : false;
                const hasTrend = 'trend' in item && item.trend !== undefined;
                
                return (
                  <SummaryItem 
                    key={item.label} 
                    borderColor={report.color}
                    highlight={hasHighlight}
                  >
                    <LabelContainer>
                      <ItemIcon>{item.icon}</ItemIcon>
                      <SummaryLabel>{item.label}</SummaryLabel>
                    </LabelContainer>
                    
                    <ValueContainer>
                      {item.isLoading ? (
                        <Spinner />
                      ) : item.error ? (
                        <ErrorIndicator message={item.error} />
                      ) : (
                        <>
                          <SummaryValue>
                            {('prefix' in item && item.prefix) || ''}{item.value}
                          </SummaryValue>
                          {hasTrend && (
                            <TrendIndicator trend={item.trend}>
                              {item.trend > 0 ? '↑' : item.trend < 0 ? '↓' : '→'}
                              {Math.abs(item.trend)}% {item.trendLabel}
                            </TrendIndicator>
                          )}
                        </>
                      )}
                    </ValueContainer>
                  </SummaryItem>
                );
              })}
            </SummaryContainer>
          </Card>
        ))}
      </ReportsGrid>
      
      <FooterNote>
        <FooterText>
          💡 <strong>Tip:</strong> Check your inventory regularly to avoid stockouts, 
          and follow up on active debts to maintain healthy cash flow!
        </FooterText>
      </FooterNote>
    </PageContainer>
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