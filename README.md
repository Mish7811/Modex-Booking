# Modex Booking System

A full-stack **concurrency-safe booking platform** built with PostgreSQL, Express.js and React.  
The system prevents **double booking** using database-level row locking and ACID-compliant transactions.

This project demonstrates:
- Strong backend architecture
- Original reasoning about concurrency and correctness
- Clean, scalable code structure
- Real-world deployment (Vercel + Railway)

---

## 🚀 Live Demo

**Frontend:** https://modex-booking-kr3cvzrcl-mishals-projects-e285a552.vercel.app/  
**Backend:** https://modex-booking-production.up.railway.app/

---

## 🎯 Problem Statement

Design a booking system that allows **multiple users to book limited slots** (e.g., appointments).  
The key challenge:  
> Prevent **race conditions** and **double booking** when two users try to book the same slot at the same time.

Many naive implementations fail because they:
- Only check `isBooked` and update afterward
- Do not use transactions
- Do not handle concurrent requests safely

This system solves the problem using **PostgreSQL row locking** with:
SELECT ... FOR UPDATE

---

## 🧠 Key Features

### **User Features**
- View all available and booked slots
- Book a slot safely
- Get immediate feedback if the slot is already taken

### **Admin Features**
- Create doctors
- Create appointment slots
- Manage slot inventory

### **Backend Engineering Features**
- ACID transactions
- Row locking for concurrency control
- Prevents race conditions
- Clean modular Express code
- PostgreSQL schema + migrations

### **Frontend Features**
- Responsive UI
- Modern React + Vite + TypeScript
- Admin panel
- Slot cards, booking confirmation flow

---

## 🏗️ System Architecture Overview
┌──────────────┐ HTTP ┌────────────────┐
│ Frontend ├────────────────▶│ Backend API │
│ React + Vite │ │ Express + PG │
└──────────────┘ └────────┬───────┘
│
SQL / Transactions
│
┌─────────▼─────────┐
│ PostgreSQL DB │
│ (Row-Level Locks) │
└────────────────────┘

---

## 💾 Database Schema

### `doctors`
| Field | Type |
|-------|--------|
| id | SERIAL PK |
| name | TEXT |

### `slots`
| Field | Type |
|-------|--------|
| id | SERIAL PK |
| doctor_id | INT FK |
| start_time | TIMESTAMP |
| is_booked | BOOLEAN |
| expires_at | TIMESTAMP (optional enhancement) |

### `bookings`
| Field | Type |
|-------|--------|
| id | SERIAL PK |
| slot_id | INT FK |
| user_id | INT |
| status | CONFIRMED / FAILED |
| created_at | TIMESTAMP |

---

## 🔒 Concurrency Handling Explained

Slot booking uses the following SQL inside a transaction:

```sql
BEGIN;
SELECT id, is_booked FROM slots WHERE id = $1 FOR UPDATE;
-- This locks the row so no other transaction can modify it

IF is_booked = FALSE:
    UPDATE slots SET is_booked = TRUE WHERE id = $1;
    INSERT INTO bookings ... status='CONFIRMED';
ELSE:
    INSERT INTO bookings ... status='FAILED';
COMMIT;
```

Why this is correct?
- Only one transaction can hold the lock at a time
- Prevents double booking
- Ensures consistency under load
- Works even if multiple servers hit the DB concurrently

## 📡 API Endpoints
```GET /slots```
Returns all appointment slots.

```POST /book/:slotId```
Request:
{
  "user_id": 101
}

Responses:
- 200 CONFIRMED
- 409 FAILED - already booked
- 404 slot not found

```POST /admin/doctor```
Request:
{ "name": "Dr. Mike" }

```POST /admin/slot```
Request:
{
  "doctor_id": 1,
  "start_time": "2025-12-12T10:00:00Z"
}

## 🖥️ Running Locally
#### Backend
```cd backend
npm install
npm run dev
```
##### Environment:
`DATABASE_URL=postgres://...`

#### Frontend
```cd frontend
npm install
npm run dev
```
##### Environment:
`VITE_API_BASE_URL=http://localhost:4000`

## 📘 Booking Expiry (Design Enhancement)

Real booking systems require temporary holds.
This design supports adding:
- expires_at TIMESTAMP on slots
- A cleaner to release expired reservations
- Expiry checks inside the booking transaction
- This ensures abandoned bookings dont block availability.

## 📈 Scalability Considerations

- Horizontal API scaling is safe (locking is DB-level)
- Partitioning slots per doctor for performance
- Caching non-booked slots via Redis
- Queue-based async job processing for confirmations

## ✨ Conclusion

This project demonstrates:
- Individual architectural reasoning
- Correct handling of concurrency using DB transactions
- Clean backend and frontend design
- Real deployment readiness

The central innovation is guaranteeing correctness under concurrent traffic.
