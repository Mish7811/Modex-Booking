# Modex Doctor Booking Backend

- Node + Express + PostgreSQL (Railway)
- Endpoints:
  - POST /admin/doctor
  - POST /admin/slot
  - GET /slots
  - POST /book/:slotId (uses transaction + SELECT FOR UPDATE to prevent double booking)

Env:
- DATABASE_URL
- PORT
