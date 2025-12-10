import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import { bookSlot } from "../api/api";

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { slots, loading, error, refreshSlots } = useBooking();

  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // if slots not loaded yet, refresh
  useEffect(() => {
    if (slots.length === 0) {
      refreshSlots();
    }
  }, [slots.length, refreshSlots]);

  const slot = slots.find((s) => s.id === Number(id));

  const handleBooking = async () => {
    if (!id) return;
    setBooking(true);
    setBookingError(null);

    try {
      // mock user id
      await bookSlot(Number(id), 999);
      setBookingSuccess(true);
      await refreshSlots();
    } catch (err) {
      setBookingError("Failed to book appointment. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return <p>Loading appointment...</p>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => navigate("/")}>Back to Appointments</button>
      </div>
    );
  }

  if (!slot) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <p>Appointment slot not found.</p>
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: 12,
            padding: "8px 12px",
            borderRadius: 6,
            border: "none",
            background: "#4c8cff",
            color: "white",
            cursor: "pointer",
          }}
        >
          Back to Appointments
        </button>
      </div>
    );
  }

  const formattedTime = new Date(slot.start_time).toLocaleString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  // success screen
  if (bookingSuccess) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div
          style={{
            marginTop: 24,
            padding: 24,
            borderRadius: 12,
            border: "1px solid #2f4f2f",
            background: "#162516",
            textAlign: "center",
          }}
        >
          <div
            style={{
              margin: "0 auto 16px",
              height: 56,
              width: 56,
              borderRadius: "50%",
              background: "#22c55e22",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
          >
            ✅
          </div>
          <h1 style={{ fontSize: "1.4rem", marginBottom: 8 }}>
            Booking Confirmed
          </h1>
          <p style={{ opacity: 0.8, marginBottom: 16 }}>
            Your appointment with <strong>{slot.doctor_name}</strong> is
            scheduled.
          </p>

          <div
            style={{
              marginBottom: 16,
              padding: 12,
              borderRadius: 8,
              background: "#111",
              textAlign: "left",
              fontSize: 14,
            }}
          >
            <div>{formattedTime}</div>
          </div>

          <button
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "none",
              background: "#4c8cff",
              color: "white",
              cursor: "pointer",
              width: "100%",
            }}
            onClick={() => navigate("/")}
          >
            Back to Appointments
          </button>
        </div>
      </div>
    );
  }

  // confirmation screen
  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: 16,
          marginBottom: 12,
          padding: "4px 0",
          border: "none",
          background: "transparent",
          color: "#9ca3af",
          cursor: "pointer",
        }}
      >
        ← Back to Appointments
      </button>

      <div
        style={{
          padding: 24,
          borderRadius: 12,
          border: "1px solid #333",
          background: "#1f1f1f",
        }}
      >
        <h1 style={{ fontSize: "1.4rem", marginBottom: 16 }}>
          Confirm Appointment
        </h1>

        <div
          style={{
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              height: 40,
              width: 40,
              borderRadius: "50%",
              background: "#4c8cff22",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
            }}
          >
            {slot.doctor_name.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{slot.doctor_name}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              Doctor • Appointment
            </div>
          </div>
        </div>

        <div
          style={{
            marginBottom: 16,
            padding: 12,
            borderRadius: 8,
            background: "#111",
            fontSize: 14,
          }}
        >
          {formattedTime}
        </div>

        {bookingError && (
          <div
            style={{
              marginBottom: 12,
              padding: 8,
              borderRadius: 8,
              background: "#451b1b",
              color: "#fecaca",
              fontSize: 14,
            }}
          >
            {bookingError}
          </div>
        )}

        {slot.is_booked ? (
          <button
            disabled
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "none",
              background: "#4b5563",
              color: "#e5e7eb",
              width: "100%",
            }}
          >
            Already Booked
          </button>
        ) : (
          <button
            onClick={handleBooking}
            disabled={booking}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "none",
              background: booking ? "#6b7280" : "#22c55e",
              color: "#111827",
              width: "100%",
              cursor: booking ? "default" : "pointer",
            }}
          >
            {booking ? "Booking..." : "Confirm Booking"}
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
