# Modex Booking System

A full-stack appointment booking system with concurrency-safe booking using PostgreSQL transactions.

## Features
- Create doctors and appointment slots (Admin)
- View available and booked slots
- Book appointments safely under concurrent access
- Prevents double-booking using database-level locking

## Tech Stack
- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express
- Database: PostgreSQL
- Deployment: Vercel (Frontend), Railway (Backend & DB)

## Architecture
- Frontend communicates with backend via REST APIs
- Backend uses PostgreSQL transactions and `SELECT FOR UPDATE`
- Slot booking is atomic and concurrency-safe

## API Endpoints
- GET /slots
- POST /book/:slotId
- POST /admin/doctor
- POST /admin/slot

## Concurrency Handling
Slot booking is implemented inside a database transaction.
The slot row is locked using `SELECT FOR UPDATE` to ensure only one booking can succeed.

## Live Demo
- Frontend: <Vercel URL>
- Backend: <Railway URL>

## How to Run Locally

### Backend
```bash
cd backend
npm install
npm run start
