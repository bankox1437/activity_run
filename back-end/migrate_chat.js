const pool = require('./db');

const up = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tb_activity_chat (
        id SERIAL PRIMARY KEY,
        activity_id INT REFERENCES tb_activity(id) ON DELETE CASCADE,
        sender_id INT REFERENCES tb_users(user_id),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table tb_activity_chat created successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error creating table:', err);
    process.exit(1);
  }
};

up();
