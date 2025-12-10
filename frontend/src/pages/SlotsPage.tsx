import { useEffect } from "react";
import { useBooking } from "../context/BookingContext";
import { useNavigate } from "react-router-dom";

export default function SlotsPage() {
  const { slots, loading, error, refreshSlots } = useBooking();
  const navigate = useNavigate();

  useEffect(() => {
    refreshSlots();
  }, [refreshSlots]);

  const availableSlots = slots.filter((s) => !s.is_booked);
  const bookedSlots = slots.filter((s) => s.is_booked);

  if (loading) {
    return <p>Loading slots...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 8 }}>
        Available Appointments
      </h1>
      <p style={{ marginBottom: 24, opacity: 0.8 }}>
        Select a time slot to book your appointment.
      </p>

      {slots.length === 0 && (
        <div
          style={{
            padding: 40,
            borderRadius: 12,
            border: "1px dashed #444",
            background: "#111",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 16, marginBottom: 4 }}>
            No appointment slots available
          </p>
          <p style={{ fontSize: 14, opacity: 0.7 }}>
            Check back later or contact an admin.
          </p>
        </div>
      )}

      {availableSlots.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: 12 }}>
            Available ({availableSlots.length})
          </h2>
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            }}
          >
            {availableSlots.map((slot) => (
              <div
                key={slot.id}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  background: "#1f1f1f",
                  border: "1px solid #333",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{slot.doctor_name}</div>
                  <div
                    style={{
                      fontSize: 13,
                      opacity: 0.8,
                      marginTop: 4,
                    }}
                  >
                    {new Date(slot.start_time).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/booking/${slot.id}`)}
                  style={{
                    marginTop: 12,
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "none",
                    background: "#4c8cff",
                    color: "white",
                    cursor: "pointer",
                    alignSelf: "flex-end",
                  }}
                >
                  Book
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {bookedSlots.length > 0 && (
        <section>
          <h2
            style={{
              fontSize: "1.1rem",
              marginBottom: 12,
              opacity: 0.8,
            }}
          >
            Booked ({bookedSlots.length})
          </h2>
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            }}
          >
            {bookedSlots.map((slot) => (
              <div
                key={slot.id}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  background: "#18181b",
                  border: "1px solid #333",
                  opacity: 0.7,
                }}
              >
                <div style={{ fontWeight: 600 }}>{slot.doctor_name}</div>
                <div
                  style={{
                    fontSize: 13,
                    opacity: 0.8,
                    marginTop: 4,
                    marginBottom: 8,
                  }}
                >
                  {new Date(slot.start_time).toLocaleString()}
                </div>
                <span
                  style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: "#4b5563",
                    fontSize: 12,
                  }}
                >
                  Booked
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
