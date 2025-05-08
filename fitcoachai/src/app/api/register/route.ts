import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new NextResponse('Missing email or password', { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await sql`
      INSERT INTO users (email, hashed_password)
      VALUES (${email}, ${hashedPassword})
      RETURNING *
    `;

    return NextResponse.json(result.rows[0]);
  } catch (error: unknown) {
    console.error('REGISTRATION ERROR', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
