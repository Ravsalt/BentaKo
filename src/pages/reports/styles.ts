import styled from "styled-components";

export const pageContainer = styled.div`
padding: 2rem;
font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
background-color: #f8f9fa;
min-height: 100vh;

@media (max-width: 767px) {
  padding: 1rem;
}
`;

export const headerSection = styled.div`
text-align: center;
margin-bottom: 3rem;

@media (max-width: 767px) {
  margin-bottom: 1.5rem;
}
`;

export const pageTitle = styled.h1`
  font-size: 2.5rem;
  fontWeight: "700",
  color: "#2c3e50",
  marginBottom: "0.5rem",
  
  @media (max-width: 767px) {
    font-size: 1.75rem;
  }
`;

export const subtitle = styled.p`
  font-size: 1.1rem;
  color: #7f8c8d;
  font-weight: 400;
  
  @media (max-width: 767px) {
    font-size: 0.95rem;
  }
`;

export const reportsGrid = styled.div`
display: grid;
grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
gap: 2rem;
margin-bottom: 2rem;

@media (max-width: 767px) {
  grid-template-columns: 1fr;
  gap: 1rem;
}
`;

export const card = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  @media (max-width: 767px) {
    padding: 1.25rem;
  }
`;

export const cardHeader = styled.div`
margin-bottom: 1.5rem;
padding-bottom: 1rem;
border-bottom: 2px solid #f0f0f0;

@media (max-width: 767px) {
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
}
`;

export const sectionTitle = styled.h2`
  font-size: 1.4rem;
  fontWeight: "600",
  color: "#34495e",
  marginBottom: "0.5rem",
  display: "flex",
  alignItems: "center",
  
  @media (max-width: 767px) {
    font-size: 1.2rem;
  }
`;

export const insightText = styled.p`
  fontSize: "0.95rem",
  color: "#7f8c8d",
  fontStyle: "italic",
  marginTop: "0.5rem",
`;

export const summaryContainer = styled.div`
  display: flex,
  flexDirection: "column",
  gap: "0.75rem",
`;

export const summaryItem = styled.div`
  display: flex,
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem",
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  transition: "background-color 0.2s ease",
`;


export const labelContainer = styled.div`
  display: flex,
  alignItems: "center",
  gap: "0.5rem",
`;

export const itemIcon = styled.span`
  fontSize: "1.2rem",
`;

export const summaryLabel = styled.span`
  fontSize: "1rem",
  color: "#555",
  fontWeight: "500",
`;

export const summaryValue = styled.span`
  fontSize: "1.4rem",
  fontWeight: "700",
  color: "#2c3e50",
`;

export const footerNote = styled.div`
  marginTop: "2rem",
  padding: "1.5rem",
  backgroundColor: "#e8f4f8",
  borderRadius: "8px",
  borderLeft: "4px solid #3498db",
`;

export const footerText = styled.p`
  fontSize: "0.95rem",
  color: "#34495e",
  margin: "0",
  lineHeight: "1.6",
`;