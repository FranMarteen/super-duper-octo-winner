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
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        hashed_password VARCHAR(255) NOT NULL
      )
    `);

    return NextResponse.json({ message: 'Table created successfully' });
  } catch (error: unknown) {
    console.error('CREATE TABLE ERROR', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
