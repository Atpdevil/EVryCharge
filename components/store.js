import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

/* LocalStorage helpers */
const put = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const getJSON = (k, fb) => {
  try {
    const x = localStorage.getItem(k);
    return x ? JSON.parse(x) : fb;
  } catch {
    return fb;
  }
};

const STATIONS_KEY = "ev_stations_v1";
const BOOKINGS_KEY = "ev_bookings_v1";
const VEHICLE_TYPE_KEY = "ev_vehicle_type";
const VEHICLE_SELECTED_KEY = "ev_selected_vehicle";

/* ============================================================
   MAIN STORE
============================================================ */
export const useStore = create((set, get) => ({

  /* ============================================================
        WALLET
  ============================================================ */
  wallet: 750,
  addMoney: (amount) =>
    set((s) => ({ wallet: s.wallet + Number(amount) })),

  /* ============================================================
        VEHICLE TYPE (Car / Scooter)
  ============================================================ */
  vehicleType: null,
  setVehicleType: (t) => {
    set({ vehicleType: t });
    put(VEHICLE_TYPE_KEY, t);
  },

  selectedVehicle: null,
  setSelectedVehicle: (v) => {
    set({ selectedVehicle: v });
    put(VEHICLE_SELECTED_KEY, v);
  },

  loadVehicleFromLocal: () => {
    set({
      vehicleType: getJSON(VEHICLE_TYPE_KEY, null),
      selectedVehicle: getJSON(VEHICLE_SELECTED_KEY, null)
    });
  },

  /* ============================================================
        STATIONS
  ============================================================ */
  stations: [],

  loadStationsFromLocal: () => {
    set({ stations: getJSON(STATIONS_KEY, []) });
  },

  saveStationsToLocal: () => {
    put(STATIONS_KEY, get().stations);
  },

  addStation: (station) => {
    const st = {
      id: uuidv4(),
      createdAt: Date.now(),
      ...station,
      lat: Number(station.lat),
      lng: Number(station.lng),
    };

    const updated = [st, ...get().stations];
    set({ stations: updated });
    put(STATIONS_KEY, updated);
    return st;
  },

  updateStation: (id, data) => {
    const updated = get().stations.map((st) =>
      st.id === id ? { ...st, ...data } : st
    );
    set({ stations: updated });
    put(STATIONS_KEY, updated);
  },

  deleteStation: (id) => {
    const updated = get().stations.filter((st) => st.id !== id);
    set({ stations: updated });
    put(STATIONS_KEY, updated);
  },

  /* ============================================================
        BOOKINGS
  ============================================================ */
  bookings: [],

  loadBookingsFromLocal: () => {
    set({ bookings: getJSON(BOOKINGS_KEY, []) });
  },

  addBooking: (booking) => {
    const updated = [...get().bookings, booking];
    set({ bookings: updated });
    put(BOOKINGS_KEY, updated);
    return booking;
  },

  createBooking: (payload) => {
    const booking = {
      id: uuidv4(),
      createdAt: Date.now(),
      status: "Booked",
      ...payload,
    };

    const updated = [booking, ...get().bookings];
    set({ bookings: updated });
    put(BOOKINGS_KEY, updated);

    return booking;
  },

  cancelBooking: (id) => {
    const updated = get().bookings.map((b) =>
      b.id === id ? { ...b, status: "Cancelled" } : b
    );
    set({ bookings: updated });
    put(BOOKINGS_KEY, updated);
  },

  /* ============================================================
        SESSIONS
  ============================================================ */
  sessions: [],

  startSession: (session) => {
    const newS = {
      id: uuidv4(),
      startedAt: Date.now(),
      kwh: 0,
      cost: 0,
      ...session,
    };

    set((s) => ({ sessions: [...s.sessions, newS] }));
    return newS;
  },

  updateSession: (id, data) => {
    set((s) => ({
      sessions: s.sessions.map((ss) =>
        ss.id === id ? { ...ss, ...data } : ss
      ),
    }));
  },

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
          b.id === session.bookingId
            ? { ...b, status: "Completed" }
            : b
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
