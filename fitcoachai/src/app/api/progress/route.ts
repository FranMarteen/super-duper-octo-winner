import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// GET: Fetch user progress
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const result = await pool.query(
      'SELECT * FROM progress WHERE user_id = $1 ORDER BY date DESC',
      [userId]
    );

    return NextResponse.json({ progress: result.rows });
  } catch (error) {
    console.error('FETCH PROGRESS ERROR', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Create new progress entry
export async function POST(request: Request) {
  try {
    const { userId, date, exerciseMinutes, nutritionScore, mentalWellnessScore } = await request.json();

    if (!userId || !date) {
      return NextResponse.json({ error: 'User ID and date are required' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO progress (user_id, date, exercise_minutes, nutrition_score, mental_wellness_score)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, date, exerciseMinutes || 0, nutritionScore || 0, mentalWellnessScore || 0]
    );

    return NextResponse.json({ progress: result.rows[0] });
  } catch (error) {
    console.error('CREATE PROGRESS ERROR', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update progress entry
export async function PUT(request: Request) {
  try {
    const { id, exerciseMinutes, nutritionScore, mentalWellnessScore } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Progress ID is required' }, { status: 400 });
    }

    // Build the update query dynamically based on provided fields
    let updateQuery = 'UPDATE progress SET ';
    const updateValues = [];
    const queryParams = [];
    
    if (exerciseMinutes !== undefined) {
      updateValues.push(`exercise_minutes = $${updateValues.length + 2}`);
      queryParams.push(exerciseMinutes);
    }
    
    if (nutritionScore !== undefined) {
      updateValues.push(`nutrition_score = $${updateValues.length + 2}`);
      queryParams.push(nutritionScore);
    }
    
    if (mentalWellnessScore !== undefined) {
      updateValues.push(`mental_wellness_score = $${updateValues.length + 2}`);
      queryParams.push(mentalWellnessScore);
    }
    
    // If no fields to update, return error
    if (updateValues.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }
    
    updateQuery += updateValues.join(', ');
    updateQuery += ` WHERE id = $1 RETURNING *`;
    
    const result = await pool.query(updateQuery, [id, ...queryParams]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Progress entry not found' }, { status: 404 });
    }

    return NextResponse.json({ progress: result.rows[0] });
  } catch (error) {
    console.error('UPDATE PROGRESS ERROR', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Remove progress entry
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Progress ID is required' }, { status: 400 });
    }

    const result = await pool.query('DELETE FROM progress WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Progress entry not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Progress entry deleted successfully' });
  } catch (error) {
    console.error('DELETE PROGRESS ERROR', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
