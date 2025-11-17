import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export const useStore = create((set, get) => ({
  // user/wallet
  wallet: 750,
  addMoney: (amount) => set((s) => ({ wallet: s.wallet + Number(amount) })),

  // vehicle
  selectedVehicle: null,
  setSelectedVehicle: (v) => set({ selectedVehicle: v }),

  // bookings
  bookings: [],
  createBooking: (booking) => {
    const b = { id: uuidv4(), status: "Booked", createdAt: Date.now(), ...booking };
    set((s) => ({ bookings: [b, ...s.bookings] }));
    return b;
  },
  cancelBooking: (id) =>
    set((s) => ({
      bookings: s.bookings.map((b) => (b.id === id ? { ...b, status: "Cancelled" } : b)),
    })),

  // charging sessions
  sessions: [],
  startSession: (session) => {
    const s = {
      id: uuidv4(),
      startedAt: Date.now(),
      kwh: 0,
      cost: 0,
      ...session,
    };
    set((st) => ({ sessions: [...st.sessions, s] }));
    return s;
  },

  updateSession: (id, data) =>
    set((s) => ({
      sessions: s.sessions.map((ss) => (ss.id === id ? { ...ss, ...data } : ss)),
    })),

  endSession: (id) => {
    const store = get();
    const session = store.sessions.find((s) => s.id === id);
    if (!session) return;

    const finalCost = session.kwh * session.pricePerKwh;

    if (store.wallet >= finalCost) {
      set((st) => ({
        wallet: st.wallet - finalCost,
        sessions: st.sessions.filter((s) => s.id !== id),
        bookings: st.bookings.map((b) =>
          b.id === session.bookingId ? { ...b, status: "Completed" } : b
        ),
      }));
      return { success: true, amount: finalCost };
    } else {
      set((st) => ({
        sessions: st.sessions.filter((s) => s.id !== id),
        bookings: st.bookings.map((b) =>
          b.id === session.bookingId
            ? { ...b, status: "Completed (Unpaid)" }
            : b
        ),
      }));
      return { success: false, amount: finalCost };
    }
  },
}));
