import { useState } from "react";
import { createDoctor, createSlot } from "../api/api";
import { useBooking } from "../context/BookingContext";

const AdminPage = () => {
  const { refreshSlots } = useBooking();

  // Doctor form state
  const [doctorName, setDoctorName] = useState("");
  const [doctorLoading, setDoctorLoading] = useState(false);

  // Slot form state
  const [slotDoctorId, setSlotDoctorId] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [slotLoading, setSlotLoading] = useState(false);

  const [message, setMessage] = useState<string | null>(null);

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName.trim()) return;

    setDoctorLoading(true);
    setMessage(null);
    try {
      await createDoctor(doctorName.trim());
      setMessage(`Doctor "${doctorName}" created ✅`);
      setDoctorName("");
    } catch (err) {
      setMessage("Failed to create doctor ❌");
    } finally {
      setDoctorLoading(false);
    }
  };

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotDoctorId.trim() || !slotTime) return;

    setSlotLoading(true);
    setMessage(null);
    try {
      // backend expects doctor_id + start_time; helper already does that
      await createSlot(Number(slotDoctorId), new Date(slotTime).toISOString());
      setMessage("Slot created ✅");
      setSlotDoctorId("");
      setSlotTime("");
      refreshSlots();
    } catch (err) {
      setMessage("Failed to create slot ❌");
    } finally {
      setSlotLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 8 }}>
        Admin Panel
      </h1>
      <p style={{ marginBottom: 24, opacity: 0.8 }}>
        Manage doctors and appointment slots
      </p>

      {message && (
        <div
          style={{
            marginBottom: 16,
            padding: "8px 12px",
            borderRadius: 8,
            background: "#2a2a2a",
          }}
        >
          {message}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gap: 24,
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        {/* Create Doctor Form */}
        <div
          style={{
            padding: 16,
            borderRadius: 12,
            background: "#222",
            border: "1px solid #333",
          }}
        >
          <h2 style={{ fontSize: "1.1rem", marginBottom: 12 }}>Add Doctor</h2>
          <form onSubmit={handleCreateDoctor} style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gap: 4 }}>
              <label htmlFor="doctorName">Doctor Name</label>
              <input
                id="doctorName"
                type="text"
                placeholder="Dr. John Smith"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                style={{
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "1px solid #444",
                  background: "#111",
                  color: "white",
                }}
                required
              />
            </div>
            <button
              type="submit"
              disabled={doctorLoading || !doctorName.trim()}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                border: "none",
                background: doctorLoading ? "#666" : "#4c8cff",
                color: "white",
                cursor: doctorLoading ? "default" : "pointer",
              }}
            >
              {doctorLoading ? "Creating..." : "Create Doctor"}
            </button>
          </form>
        </div>

        {/* Create Slot Form */}
        <div
          style={{
            padding: 16,
            borderRadius: 12,
            background: "#222",
            border: "1px solid #333",
          }}
        >
          <h2 style={{ fontSize: "1.1rem", marginBottom: 12 }}>Add Slot</h2>
          <form onSubmit={handleCreateSlot} style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gap: 4 }}>
              <label htmlFor="doctorId">Doctor ID</label>
              <input
                id="doctorId"
                type="number"
                placeholder="1"
                value={slotDoctorId}
                onChange={(e) => setSlotDoctorId(e.target.value)}
                style={{
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "1px solid #444",
                  background: "#111",
                  color: "white",
                }}
                required
              />
            </div>
            <div style={{ display: "grid", gap: 4 }}>
              <label htmlFor="slotTime">Date &amp; Time</label>
              <input
                id="slotTime"
                type="datetime-local"
                value={slotTime}
                onChange={(e) => setSlotTime(e.target.value)}
                style={{
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "1px solid #444",
                  background: "#111",
                  color: "white",
                }}
                required
              />
            </div>
            <button
              type="submit"
              disabled={slotLoading || !slotDoctorId.trim() || !slotTime}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                border: "none",
                background: slotLoading ? "#666" : "#22c55e",
                color: "white",
                cursor: slotLoading ? "default" : "pointer",
              }}
            >
              {slotLoading ? "Creating..." : "Create Slot"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
