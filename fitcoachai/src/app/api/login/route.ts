import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new NextResponse('Missing email or password', { status: 400 });
    }

    const users = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (users.rows.length === 0) {
      return new NextResponse('Invalid credentials', { status: 401 });
    }

    const user = users.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.hashed_password);

    if (!passwordMatch) {
      return new NextResponse('Invalid credentials', { status: 401 });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    return NextResponse.json({ token });
  } catch (error: unknown) {
    console.error('LOGIN ERROR', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
