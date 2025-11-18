import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export const useStore = create((set, get) => ({

  /* =============================
       WALLET
  ==============================*/
  wallet: 750,
  addMoney: (amount) =>
    set((s) => ({ wallet: s.wallet + Number(amount) })),

  /* =============================
      VEHICLE TYPE (car / scooter)
  ==============================*/
  vehicleType: null,
  setVehicleType: (type) => {
    set({ vehicleType: type });
    localStorage.setItem("ev_vehicle_type", JSON.stringify(type));
  },

  /* =============================
      SELECTED VEHICLE MODEL
  ==============================*/
  selectedVehicle: null,
  setSelectedVehicle: (v) => {
    set({ selectedVehicle: v });
    localStorage.setItem("ev_selected_vehicle", JSON.stringify(v));
  },

  // Load vehicle from localStorage on startup
  loadVehicleFromLocal: () => {
    try {
      const t = localStorage.getItem("ev_vehicle_type");
      const v = localStorage.getItem("ev_selected_vehicle");
      if (t) set({ vehicleType: JSON.parse(t) });
      if (v) set({ selectedVehicle: JSON.parse(v) });
    } catch (e) {
      console.error("loadVehicleFromLocal error", e);
    }
  },

  /* =============================
      BOOKINGS
  ==============================*/
  bookings: [],

  createBooking: (booking) => {
    const b = {
      id: uuidv4(),
      status: "Booked",
      createdAt: Date.now(),
      ...booking,
    };
    set((s) => ({ bookings: [b, ...s.bookings] }));
    return b;
  },

  cancelBooking: (id) =>
    set((s) => ({
      bookings: s.bookings.map((b) =>
        b.id === id ? { ...b, status: "Cancelled" } : b
      ),
    })),

  /* =============================
      HOST STATIONS
  ==============================*/

  stations: [], // THIS WILL CONTAIN HOST-ADDED STATIONS

  loadStationsFromLocal: () => {
    try {
      const raw = localStorage.getItem("ev_stations_v1");
      if (raw) set({ stations: JSON.parse(raw) });
    } catch (e) {
      console.error("loadStationsFromLocal", e);
    }
  },

  saveStationsToLocal: () => {
    try {
      const s = get().stations;
      localStorage.setItem("ev_stations_v1", JSON.stringify(s));
    } catch (e) {
      console.error("saveStationsToLocal", e);
    }
  },

  addStation: (station) => {
    const st = {
      id: uuidv4(),
      createdAt: Date.now(),
      ...station,
    };

    // Add station to store
    set((s) => ({ stations: [st, ...s.stations] }));

    // Save to localStorage (slight delay so state updates first)
    setTimeout(() => get().saveStationsToLocal(), 50);

    return st;
  },

  /* =============================
      CHARGING SESSIONS
  ==============================*/
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
      sessions: s.sessions.map((ss) =>
        ss.id === id ? { ...ss, ...data } : ss
      ),
    })),

  endSession: (id) => {
    const store = get();
    const session = store.sessions.find((s) => s.id === id);
    if (!session) return;

    const finalCost = session.kwh * session.pricePerKwh;

    if (store.wallet >= finalCost) {
      // Enough money → deduct wallet
      set((st) => ({
        wallet: st.wallet - finalCost,
        sessions: st.sessions.filter((s) => s.id !== id),
        bookings: st.bookings.map((b) =>
          b.id === session.bookingId
            ? { ...b, status: "Completed" }
            : b
        ),
      }));

      return { success: true, amount: finalCost };
    } else {
      // Not enough money
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
