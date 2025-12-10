const express = require('express');
const pool = require('./db');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'API is running' }));

/* app.post('/init-db', async (req, res) => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS doctors (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL
            );
            
            CREATE TABLE IF NOT EXISTS slots (
            id SERIAL PRIMARY KEY,
            doctor_id INT REFERENCES doctors(id),
            start_time TIMESTAMP NOT NULL,
            is_booked BOOLEAN DEFAULT FALSE
            );
            
            CREATE TABLE IF NOT EXISTS bookings (
            id SERIAL PRIMARY KEY,
            slot_id INT REFERENCES slots(id),
            user_id INT,
            status TEXT,
            created_at TIMESTAMP DEFAULT NOW()
            );
        `);
        res.json({ message: 'DB initialized' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'DB init failed' });
    }    
}); */

app.post('/admin/doctor', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'name is required' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO doctors (name) VALUES ($1) RETURNING *',
            [name]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'server error' });
    }
});

app.post('/admin/slot', async (req, res) => {
    const { doctor_id, start_time } = req.body;
    if (!doctor_id || !start_time) {
        return res.status(400).json({ error: 'doctor_id and start_time are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO slots (doctor_id, start_time) VALUES ($1, $2) RETURNING *',
            [doctor_id, start_time]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server error' });
    }    
});

// Lists slots for user n displaying
app.get('/slots', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT s.id, s.doctor_id, d.name as doctor_name, s.start_time, s.is_booked
            FROM slots s
            LEFT JOIN doctors d ON s.doctor_id = d.id
            ORDER BY s.start_time`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server error' });
    }
});

app.post('/book/:slotId', async (req, res) => {
    const slotId = parseInt(req.params.slotId, 10);
    if (Number.isNaN(slotId)) {
        return res.status(400).json({ status: 'FAILED', reason: 'invalid_slot_id'});
    }
    const { user_id } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const lockRes = await client.query(
            'SELECT id, is_booked FROM slots WHERE id = $1 FOR UPDATE',
            [slotId]
        );

        if (lockRes.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ status: 'FAILED' , reason: 'slot_not_found' });
        }

        const slot = lockRes.rows[0];
        if (slot.is_booked) {
            await client.query('ROLLBACK');
            //logging failed booking try
            await client.query(
                `INSERT INTO bookings (slot_id, user_id, status) VALUES ($1, $2, $3)`,
                [slotId, user_id || null, 'FAILED']
            );
            return res.status(409).json({ status: 'FAILED', reason: 'already_booked' });
        }

        //booked slots marking
        await client.query(
            'UPDATE slots SET is_booked = TRUE WHERE id = $1',
            [slotId]
        );

        //booking record log
        const bookingRes = await client.query(
            `INSERT INTO bookings (slot_id, user_id, status) VALUES ($1, $2, $3) RETURNING *`,
            [slotId, user_id || null, 'CONFIRMED']
        );

        await client.query('COMMIT');
        res.json({ status: 'CONFIRMED', booking: bookingRes.rows[0] });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('booking error', err);
        res.status(500).json({ status: 'FAILED', reason: 'server_error' });
    } finally{
        client.release();
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server running on', PORT));