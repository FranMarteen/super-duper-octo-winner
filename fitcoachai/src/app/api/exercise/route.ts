import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function getUserData(userId: string) {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

function generatePersonalizedExercisePlan(userData: Record<string, unknown>) {
  // Implement logic to generate personalized exercise plan based on user data
  // This is a placeholder implementation
  const exercisePlan = {
    name: 'Personalized Exercise Plan',
    description: `This is a personalized exercise plan for user with ID: ${userData.id || 'unknown'}`,
    exercises: [
      {
        name: 'Pushups',
        sets: 3,
        reps: 10,
      },
      {
        name: 'Squats',
        sets: 3,
        reps: 15,
      },
      {
        name: 'Plank',
        sets: 3,
        duration: 30,
      },
    ],
  };
  return exercisePlan;
}

export async function GET() {
  const userId = '1'; // Replace with actual user ID from request
  const userData = await getUserData(userId);

  if (!userData) {
    return new Response('User not found', { status: 404 });
  }

  const exercisePlan = generatePersonalizedExercisePlan(userData);

  return new Response(JSON.stringify(exercisePlan), {
    headers: { 'Content-Type': 'application/json' },
  });
}
