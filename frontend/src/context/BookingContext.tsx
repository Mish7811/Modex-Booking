import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { fetchSlots } from "../api/api";

export interface Slot {
  id: number;
  doctor_name: string;
  start_time: string;
  is_booked: boolean;
}

interface BookingContextType {
  slots: Slot[];
  loading: boolean;
  error: string | null;
  refreshSlots: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: React.ReactNode }) => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSlots = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchSlots();
      setSlots(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to load slots");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSlots();
  }, [refreshSlots]);

  return (
    <BookingContext.Provider value={{ slots, loading, error, refreshSlots }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
};
