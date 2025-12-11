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

