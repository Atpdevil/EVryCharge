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

export const useStore = create((set, get) => ({

  /* ============================================================
     WALLET + TRANSACTIONS
  ============================================================ */
  wallet: 750,
  walletHistory: getJSON("ev_wallet_history", []),
  hostEarnings: getJSON("ev_host_earnings", []),

  addMoney: (amount) => {
    const newAmount = Number(amount);
    if (!newAmount || newAmount <= 0) return;

    const updatedWallet = get().wallet + newAmount;

    // Add wallet history entry
    const updatedHistory = [
      {
        id: uuidv4(),
        type: "credit",
        amount: newAmount,
        message: "Money Added to Wallet",
        time: Date.now(),
      },
      ...get().walletHistory,
    ];

    set({
      wallet: updatedWallet,
      walletHistory: updatedHistory,
    });

    put("ev_wallet_history", updatedHistory);
  },

  /* ============================================================
     VEHICLE SECTION
  ============================================================ */
  vehicleType: null,
  setVehicleType: (t) => {
    set({ vehicleType: t });
    put(VEHICLE_TYPE_KEY, t);

    const user = getJSON("ev_user", null);
    if (user) {
      user.vehicleType = t;
      put("ev_user", user);
    }
  },

  selectedVehicle: null,
  setSelectedVehicle: (v) => {
    const state = get();

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
    const user = JSON.parse(localStorage.getItem("ev_user") || "{}");

    const st = {
      id: uuidv4(),
      createdAt: Date.now(),
      ownerId: user.id,
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

  /* ============================================================
     BOOKINGS WITH WALLET & HOST TRANSFER
  ============================================================ */
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

  createBooking: (payload) => {
    const store = get();

    const userWallet = store.wallet;
    const walletHistory = store.walletHistory;
    const hostEarnings = store.hostEarnings;

    // Cost calculation
    const rate = payload.pricePerKwh;
    const mins = payload.durationMinutes;
    const cost = (rate / 60) * mins;

    if (userWallet < cost) {
      alert("Insufficient wallet balance!");
      return null;
    }

    const booking = {
      id: uuidv4(),
      createdAt: Date.now(),
      status: "Booked",
      totalCost: cost,
      ...payload,
    };

    // Save booking
    const updatedBookings = [booking, ...store.bookings];
    set({ bookings: updatedBookings });
    put(BOOKINGS_KEY, updatedBookings);

    /* -------------------------------------
       WALLET DEDUCT
    ------------------------------------- */
    const newWallet = userWallet - cost;

    const newWalletHistory = [
      {
        id: uuidv4(),
        type: "debit",
        amount: cost,
        message: `Booking: ${payload.stationName}`,
        time: Date.now(),
      },
      ...walletHistory,
    ];

    set({
      wallet: newWallet,
      walletHistory: newWalletHistory,
    });

    put("ev_wallet_history", newWalletHistory);

    /* -------------------------------------
       CREDIT HOST
    ------------------------------------- */
    const earningEntry = {
      id: uuidv4(),
      stationId: payload.stationId,
      hostId: payload.hostId,
      fromUser: payload.userName,
      amount: cost,
      time: Date.now(),
    };

    const newEarnings = [earningEntry, ...hostEarnings];

    set({ hostEarnings: newEarnings });
    put("ev_host_earnings", newEarnings);

    /* -------------------------------------
       UPDATE STATION BOOKING COUNT
    ------------------------------------- */
    const updatedStations = store.stations.map((s) =>
      s.id === payload.stationId
        ? { ...s, bookings: (s.bookings || 0) + 1 }
        : s
    );

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

    const updatedStations = store.stations.map((s) => {
      if (s.id === target.stationId) {
        const count = Math.max((s.bookingsCount || 1) - 1, 0);
        return { ...s, status: "Available", bookingsCount: count };
      }
      return s;
    });

    set({ stations: updatedStations });
    put(STATIONS_KEY, updatedStations);
  },

  deleteBooking: (id) => {
    const updated = get().bookings.filter((b) => b.id !== id);
    set({ bookings: updated });
    put(BOOKINGS_KEY, updated);
  },

}));
