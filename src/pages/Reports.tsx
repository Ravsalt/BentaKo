import React from "react";
import { useInventoryList, useLowStockItems } from "../hooks/useInventory";
import { useDebtList } from "../hooks/useDebt";

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

export default function Reports() {
  const { data: inventoryItems, isLoading: isLoadingInventory } =
    useInventoryList();
  const { data: lowStockItems, isLoading: isLoadingLowStock } =
    useLowStockItems();
  const { data: debts, isLoading: isLoadingDebts } = useDebtList();

  const activeDebts = debts?.filter((debt) => debt.status !== "Paid");
  const paidDebts = debts?.filter((debt) => debt.status === "Paid");

  const totalAmountDue =
    activeDebts?.reduce((acc, debt) => acc + debt.amount, 0) ?? 0;

  const reportsData = [
    {
      category: "Inventory",
      icon: "📦",
      summary: [
        {
          label: "Inventory Count",
          value: inventoryItems?.length ?? 0,
          isLoading: isLoadingInventory,
        },
        {
          label: "Low Stock Items",
          value: lowStockItems?.length ?? 0,
          isLoading: isLoadingLowStock,
        },
      ],
    },
    {
      category: "Utang",
      icon: "💸",
      summary: [
        {
          label: "Active Debts",
          value: activeDebts?.length ?? 0,
          isLoading: isLoadingDebts,
        },
        {
          label: "Paid Off",
          value: paidDebts?.length ?? 0,
          isLoading: isLoadingDebts,
        },
        {
          label: "Total Amount Due",
          value: `₱${totalAmountDue.toLocaleString()}`,
          isLoading: isLoadingDebts,
        },
      ],
    },
  ];

  return (
    <div style={pageContainer}>
      <h1 style={pageTitle}>Reports</h1>
      <div style={reportsGrid}>
        {reportsData.map((report) => (
          <div key={report.category} style={card}>
            <h2 style={sectionTitle}>
              <span style={{ marginRight: "0.5rem" }}>{report.icon}</span>
              {report.category}
            </h2>
            <div style={summaryContainer}>
              {report.summary.map((item) => (
                <div key={item.label} style={summaryItem}>
                  <span style={summaryLabel}>{item.label}</span>
                  <span style={summaryValue}>
                    {item.isLoading ? <Spinner /> : item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Styles ---

const pageContainer: React.CSSProperties = {
  padding: "2rem",
  fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  backgroundColor: "#f4f7f9",
  minHeight: "100vh",
};

const pageTitle: React.CSSProperties = {
  fontSize: "2.5rem",
  fontWeight: "bold",
  color: "#2c3e50",
  marginBottom: "2rem",
  textAlign: "center",
};

const reportsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
  gap: "2rem",
};

const card: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  padding: "2rem",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
};

const sectionTitle: React.CSSProperties = {
  fontSize: "1.5rem",
  fontWeight: 600,
  color: "#34495e",
  marginBottom: "1.5rem",
  display: "flex",
  alignItems: "center",
};

const summaryContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const summaryItem: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem",
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
};

const summaryLabel: React.CSSProperties = {
  fontSize: "1rem",
  color: "#555",
};

const summaryValue: React.CSSProperties = {
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: "#2c3e50",
};