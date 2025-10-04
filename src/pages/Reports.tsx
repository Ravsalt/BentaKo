import React from "react";

// Mock data for demonstration
const reportsData = [
  {
    category: "Inventory",
    summary: [
      { label: "Inventory Count", value: 10 },
      { label: "Low Stock Items", value: 2 },
    ],
  },
  {
    category: "Sales",
    summary: [
      { label: "Sales Count", value: 10 },
      { label: "Total Revenue", value: "₱25,000" },
    ],
  },
  {
    category: "Utang",
    summary: [
      { label: "Utang Count", value: 10 },
      { label: "Total Amount Due", value: "₱8,000" },
    ],
  },
];

export default function Reports() {
  return (
    <div style={pageContainer}>
      <h1 style={pageTitle}>Reports Dashboard</h1>
      <div style={reportsGrid}>
        {reportsData.map((report) => (
          <div key={report.category} style={card}>
            <h2 style={sectionTitle}>{report.category} Reports</h2>
            <div>
              <h3 style={summaryTitle}>{report.category} Summary</h3>
              <div style={summaryGrid}>
                {report.summary.map((item) => (
                  <div key={item.label} style={summaryCard}>
                    <h4 style={summaryLabel}>{item.label}</h4>
                    <p style={summaryValue}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Styles ---
const pageContainer = {
  padding: "2rem",
  fontFamily: "sans-serif",
};

const pageTitle = {
  marginBottom: "2rem",
  textAlign: "center",
};

const reportsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "1.5rem",
};

const card = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "1.5rem",
  backgroundColor: "#fafafa",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
};

const sectionTitle = {
  fontSize: "1.25rem",
  marginBottom: "1rem",
};

const summaryTitle = {
  fontSize: "1rem",
  marginBottom: "1rem",
  color: "#333",
};

const summaryGrid = {
  display: "grid",
  gap: "0.75rem",
};

const summaryCard = {
  backgroundColor: "#fff",
  padding: "0.75rem 1rem",
  borderRadius: "6px",
  border: "1px solid #eee",
};

const summaryLabel = {
  fontSize: "0.9rem",
  color: "#666",
  marginBottom: "0.3rem",
};

const summaryValue = {
  fontSize: "1.2rem",
  fontWeight: "bold",
  color: "#222",
};
