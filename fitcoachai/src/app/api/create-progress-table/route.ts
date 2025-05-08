import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function GET() {
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    await pool.query(`
      CREATE TABLE IF NOT EXISTS progress (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        exercise_minutes INT,
        nutrition_score INT,
        mental_wellness_score INT
      )
    `);

    return NextResponse.json({ message: 'Progress table created successfully' });
  } catch (error) {
    console.error('CREATE PROGRESS TABLE ERROR', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
