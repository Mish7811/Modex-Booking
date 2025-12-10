import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import SlotsPage from "./pages/SlotsPage";
import BookingPage from "./pages/BookingPage";
import AdminPage from "./pages/AdminPage";
import { BookingProvider } from "./context/BookingContext";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111827", // dark background
        color: "#e5e7eb",
      }}
    >
      {/* Top navbar */}
      <header
        style={{
          borderBottom: "1px solid #374151",
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "12px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span style={{ fontWeight: 700 }}>Clinic Booking</span>
          <nav style={{ display: "flex", gap: 12, fontSize: 14 }}>
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "#e5e7eb",
                padding: "6px 10px",
                borderRadius: 999,
                background: "#1f2937",
              }}
            >
              Appointments
            </Link>
            <Link
              to="/admin"
              style={{
                textDecoration: "none",
                color: "#e5e7eb",
                padding: "6px 10px",
                borderRadius: 999,
                background: "#374151",
              }}
            >
              Admin
            </Link>
          </nav>
        </div>
      </header>

      {/* Centered content */}
      <main
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "24px 16px 40px",
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BookingProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<SlotsPage />} />
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </BookingProvider>
  );
}
