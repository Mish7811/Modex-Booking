CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    name  TEXT NOT NULL
);

CREATE TABLE slots (
    id SERIAL PRIMARY KEY,
    doctor_id INT REFERENCES doctors(id),
    start_time TIMESTAMP NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    slot_id INT REFERENCES slots(id),
    user_id INT,
    status TEXT, -- PENDING, CONFIRMED, FAILED,
    created_at TIMESTAMP DEFAULT NOW()
);