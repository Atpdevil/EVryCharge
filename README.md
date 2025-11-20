# EVryCharge – EV Charging Management System

- EVryCharge is a full-stack simulation of an EV charging platform built using Next.js, Zustand, and LocalStorage
- It provides two roles:
  - EV User – finds chargers, books slots, manages wallet, profile.
  - Charger Host – adds stations, edits them, views bookings, tracks earnings.
- The project mimics a real EV platform workflow, including station creation, booking system, cancellation, host revenue, and location-based selection using Leaflet Maps

Project Structure

```bash
EVryCharge/
│
├── components/
│   ├── Host/
│   │   ├── AddStationMap.jsx
│   │   ├── BookingRow.jsx
│   │   ├── EarningsCard.jsx
│   │   ├── HostLayout.jsx
│   │   ├── HostSidebar.jsx
│   │   ├── StationCard.jsx
│   │
│   ├── Map/
│   │   ├── ChargerCluster.jsx
│   │   ├── distance.js
│   │   ├── EVMap.jsx
│   │   ├── fixLeafletIcons.js
│   │   ├── LiveLocationMarker.jsx
│   │   ├── recommend.js
│   │   ├── UserMapCore.jsx
│   │
│   ├── User/
│   │   ├── BookingCard.jsx
│   │   ├── ProfileCard.jsx
│   │   ├── UserLayout.jsx
│   │   ├── UserSidebar.jsx
│   │   ├── WalletCard.jsx
│   │
│   ├── Vehicle/
│   │   ├── BookingModal.jsx
│   │   ├── GoogleAuthButton.jsx
│   │   ├── Navbar.jsx
│   │   ├── SessionController.jsx
│   │   ├── store.js   (Zustand Store – heart of the system)
│   │   ├── VehicleSelector.jsx
│   │
│   ├── data/
│   │   ├── static vehicle JSON etc.
│
├── pages/
│   ├── host/
│   │   ├── dashboard.jsx
│   │   ├── add-station.jsx
│   │   ├── stations.jsx
│   │   ├── earnings.jsx
│   │
│   ├── login/
│   │   ├── host.jsx
│   │   ├── user.jsx
│   │
│   ├── user/
│   │   ├── home.jsx
│   │   ├── map.jsx
│   │   ├── bookings.jsx
│   │   ├── profile.jsx
│   │   ├── wallet.jsx
│   │
│   ├── index.js
│   ├── _app.js
│
├── public/
│   ├── icons/
│
├── styles/
│   ├── globals.css
│
├── package.json
├── next.config.js
├── tailwind.config.js
├── README.md
```

## Zustand Store Overview (store.js)

### Your store handles all app logic

#### Stations

- Add station
- Update station
- Delete station
- Persist to LocalStorage
- Owner ID stored for host filtering
- Status changes to Busy/Available when user books/cancels

#### Bookings

- Create booking
- Prevent double-booking
- Save user vehicle details
- Cancel booking
- Update station availability

#### Vehicles

- Select vehicle
- Save to LocalStorage

#### Wallet (demo)

- Static ₹750 shown for UI display

## Map System (Leaflet)

### Features

- Search location via Nominatim API
- Click map to drop station pin
- Draggable marker
- Region polygon highlight
- View station on Google Maps via URL
- Fix for Leaflet default icons

#### Used in

```bash
/components/Host/AddStationMap.jsx
/pages/user/map.jsx
LiveLocationMarker.jsx
```

## EV User Features

```bash
Dashboard (pages/user/home.jsx)
```

- Shows wallet
- Displays Upcoming Booking
- “View on Map” using Google Maps
- Cancel booking

```bash
Find Chargers (/pages/user/map.jsx)
```

- Browse stations on map
- Filter by price & type
- Click station to book
- Booking Modal
- Select date
- Select time
- Select charging duration
- Creates booking in Zustand

### My Bookings

- List all bookings
- View on map
- Cancel

## Host Features

### Dashboard

- Today’s total earnings
- List of host stations
- Edit / Delete / View on map

#### NEW: View User Info button (if station has bookings)

- Add Station
- Search area
- Place pin
- Auto-fill lat/lng
- Add station to store

#### My Stations

- View revenue
- View total bookings
- Quick actions (map, edit, delete)

## LocalStorage Data Keys

```bash
ev_stations_v1      → All charging stations
ev_bookings_v1      → All bookings
ev_vehicle_type     → Selected vehicle type
ev_selected_vehicle → Vehicle object
ev_user             → Logged-in user
```

### Running the Project

Install packages

```bash
npm install
```

Run development server

```bash
npm run dev
```

Open in browser

```bash
http://localhost:3000
```

### Important Notes

- This system does not use Firebase or any backend.
- All data is stored locally using LocalStorage.
- A real backend would replace booking logic, authentication, and station storage.
- Host and User are stored inside ev_user key for simulation.

### Summary

- EVryCharge is a fully functional EV Charging Simulation Platform built with:

```bash
Next.js
Zustand
LocalStorage
Leaflet Maps
Tailwind CSS
```

It supports both users and station hosts, providing all common functionality found in modern EV charging apps

---
