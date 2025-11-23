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
  wallet: 750,
  addMoney: (amount) =>
    set((s) => ({ wallet: s.wallet + Number(amount) })),

/* VEHICLE */
vehicleType: null,
setVehicleType: (t) => {
  set({ vehicleType: t });
  put(VEHICLE_TYPE_KEY, t);

  // also update user
  const user = getJSON("ev_user", null);
  if (user) {
    user.vehicleType = t;
    put("ev_user", user);
  }
},

selectedVehicle: null,
setSelectedVehicle: (v) => {
  const state = get();

  // update user object too
  let updatedUser = getJSON("ev_user", null);
  if (updatedUser) {
    updatedUser.vehicle = v;
    put("ev_user", updatedUser);
  }

  set({
    selectedVehicle: v,
    user: updatedUser || state.user,
  });

  put(VEHICLE_SELECTED_KEY, v);
},

loadVehicleFromLocal: () => {
  const vehicle = getJSON(VEHICLE_SELECTED_KEY, null);
  const type = getJSON(VEHICLE_TYPE_KEY, null);
  const user = getJSON("ev_user", null);

  if (user && vehicle) {
    user.vehicle = vehicle;
    put("ev_user", user);
  }

  set({
    vehicleType: type,
    selectedVehicle: vehicle,
    user,
  });
},

  /* STATIONS */
  stations: [],
  loadStationsFromLocal: () => {
    set({ stations: getJSON(STATIONS_KEY, []) });
  },

  saveStationsToLocal: () => {
    put(STATIONS_KEY, get().stations);
  },

  // When a host adds a station, auto-assign ownerId from local user if not provided
addStation: (station) => {
  const user = JSON.parse(localStorage.getItem("ev_user") || "{}");

  const st = {
    id: uuidv4(),
    createdAt: Date.now(),
    ownerId: user.id,         // ⭐ IMPORTANT
    revenue: 0,
    bookings: 0,
    status: "Available",
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

  /* BOOKINGS */
  bookings: [],
  loadBookingsFromLocal: () => {
    set({ bookings: getJSON(BOOKINGS_KEY, []) });
  },

  addBooking: (obj) => {
    const updated = [...get().bookings, obj];
    set({ bookings: updated });
    put(BOOKINGS_KEY, updated);
    return obj;
  },

  // payload should include: userId, userName, userEmail (optional), stationId, stationName,
  // stationLat, stationLng, date, time, durationMinutes, pricePerKwh
createBooking: (payload) => {
  const store = get();

  const booking = {
    id: uuidv4(),
    createdAt: Date.now(),
    status: "Booked",
    ...payload,
  };

  // Save booking
  const updatedBookings = [booking, ...store.bookings];
  set({ bookings: updatedBookings });
  put(BOOKINGS_KEY, updatedBookings);

  // Update station booking count
  const updatedStations = store.stations.map((s) => {
    if (s.id === payload.stationId) {
      return {
        ...s,
        bookings: (s.bookings || 0) + 1,   // ⭐ increase counter
      };
    }
    return s;
  });

  set({ stations: updatedStations });
  put(STATIONS_KEY, updatedStations);

  return booking;
},

  cancelBooking: (id) => {
    const store = get();
    const target = store.bookings.find((b) => b.id === id);
    if (!target) return;

    const updatedBookings = store.bookings.map((b) =>
      b.id === id ? { ...b, status: "Cancelled" } : b
    );

    set({ bookings: updatedBookings });
    put(BOOKINGS_KEY, updatedBookings);

    // Mark station available again and decrement bookingsCount if needed
    const newStations = store.stations.map((s) => {
      if (s.id === target.stationId) {
        // We will mark station available. We won't subtract revenue (bookings may still count)
        const newCount = Math.max((s.bookingsCount || 1) - 1, 0);
        return { ...s, status: "Available", bookingsCount: newCount };
      }
      return s;
    });

    set({ stations: newStations });
    put(STATIONS_KEY, newStations);
  },

  deleteBooking: (id) => {
    const updated = get().bookings.filter((b) => b.id !== id);
    set({ bookings: updated });
    put(BOOKINGS_KEY, updated);
  },
}));
