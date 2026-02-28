const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

require('dotenv').config();

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, unique + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext && mime) return cb(null, true);
        cb(new Error('Only images are allowed'));
    },
});

router.post('/create', auth, upload.single('image'), async (req, res) => {
    const { title, location, datetime, raceType, description } = req.body;
    const user_id = req.user.id;
    const image = req.file ? req.file.filename : null;

    try {
        const result = await pool.query(
            `INSERT INTO tb_activity (title, location, datetime, type_race, description, image, user_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [title, location, datetime, raceType, description, image, user_id]
        );
        res.status(201).json({ activity: result.rows[0] });
    } catch (err) {
        console.error('Create error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/join/:activity_id', auth, async (req, res) => {
    const { activity_id } = req.params; 
    const { comment } = req.body;
    const user_id = req.user.id;

    try {
        const existing = await pool.query(
            'SELECT id FROM tb_activity_join WHERE activity_id = $1 AND user_id = $2',
            [activity_id, user_id]
        );
        if (existing.rows.length > 0) {
            return res.status(409).json({ message: 'You have already joined this activity' });
        }

        const result = await pool.query(
            `INSERT INTO tb_activity_join (activity_id, user_id, comment, status)
             VALUES ($1, $2, $3, 0) RETURNING *`,
            [activity_id, user_id, comment || '']
        );
        res.status(201).json({ join: result.rows[0] });
    } catch (err) {
        console.error('Join error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/all', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT a.*, rt.race_type_name AS type_race_name
             FROM tb_activity a
             LEFT JOIN tb_race_type rt ON rt.race_type_id = a.type_race
             ORDER BY a.datetime DESC`
        );
        res.status(200).json({ data: result.rows });
    } catch (err) {
        console.error('all error:', err.message);
        res.status(500).json({ message: 'Failed to fetch activities' });
    }
});

router.get('/my-created', auth, async (req, res) => {
    const user_id = req.user.id;
    try {
        const result = await pool.query(
            `SELECT a.*,
            rt.race_type_name AS type_race_name,
            (SELECT COUNT(*) FROM tb_activity_join j WHERE j.activity_id = a.id) AS participant_count
             FROM tb_activity a
             LEFT JOIN tb_race_type rt ON rt.race_type_id = a.type_race
             WHERE a.user_id = $1
             ORDER BY a.datetime DESC`,
            [user_id]
        );
        res.status(200).json({ data: result.rows });
    } catch (err) {
        console.error('my-created error:', err.message);
        res.status(500).json({ message: 'Failed to fetch created activities' });
    }
});

router.get('/my-joined', auth, async (req, res) => {
    const user_id = req.user.id;
    try {
        const result = await pool.query(
            `SELECT j.id AS join_id, j.comment, j.status,
            a.id AS activity_id, a.title, a.location, a.datetime, a.image,
                rt.race_type_name AS type_race_name,
                    u.first_name AS organizer_first, u.last_name AS organizer_last
             FROM tb_activity_join j
             JOIN tb_activity a ON a.id = j.activity_id
             LEFT JOIN tb_race_type rt ON rt.race_type_id = a.type_race
             JOIN tb_users u ON u.user_id = a.user_id
             WHERE j.user_id = $1
             ORDER BY a.datetime DESC`,
            [user_id]
        );
        res.status(200).json({ data: result.rows });
    } catch (err) {
        console.error('my-joined error:', err.message);
        res.status(500).json({ message: 'Failed to fetch joined activities' });
    }
});

router.get('/getRaceType', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tb_race_type');
        res.status(200).json({ data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch race types' });
    }
});

router.get('/:activity_id/requests', auth, async (req, res) => {
    const { activity_id } = req.params;
    const user_id = req.user.id;

    try {
       
        const owner = await pool.query(
            'SELECT id FROM tb_activity WHERE id = $1 AND user_id = $2',
            [activity_id, user_id]
        );
        if (owner.rows.length === 0) {
            return res.status(403).json({ message: 'You are not the owner of this activity' });
        }

        const result = await pool.query(
            `SELECT j.id AS join_id, j.comment, j.status, j.user_id,
            u.first_name, u.last_name
             FROM tb_activity_join j
             JOIN tb_users u ON u.user_id = j.user_id
             WHERE j.activity_id = $1
             ORDER BY j.id ASC`,
            [activity_id]
        );
        res.status(200).json({ data: result.rows });
    } catch (err) {
        console.error('requests error:', err.message);
        res.status(500).json({ message: 'Failed to fetch requests' });
    }
});

router.patch('/request/:join_id', auth, async (req, res) => {
    const { join_id } = req.params;
    const { status } = req.body; // 'accepted' | 'rejected' | 'pending'
    const user_id = req.user.id;

    // 0=pending, 1=accepted, 2=rejected
    const statusMap = { pending: 0, accepted: 1, rejected: 2 };

    if (!(status in statusMap)) {
        return res.status(400).json({ message: 'Invalid status. Use pending, accepted or rejected.' });
    }

    try {
        // ยืนยันว่า join request นี้เป็นของ activity ที่ user เป็นเจ้าของ
        const check = await pool.query(
            `SELECT j.id FROM tb_activity_join j
             JOIN tb_activity a ON a.id = j.activity_id
             WHERE j.id = $1 AND a.user_id = $2`,
            [join_id, user_id]
        );
        if (check.rows.length === 0) {
            return res.status(403).json({ message: 'Not authorized to update this request' });
        }

        const result = await pool.query(
            'UPDATE tb_activity_join SET status = $1 WHERE id = $2 RETURNING *',
            [statusMap[status], join_id]
        );
        res.status(200).json({ join: result.rows[0] });
    } catch (err) {
        console.error('patch request error:', err.message);
        res.status(500).json({ message: 'Failed to update request' });
    }
});

module.exports = router;
