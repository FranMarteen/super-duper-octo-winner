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

function generatePersonalizedNutritionPlan(userData: Record<string, unknown>) {
  // Implement logic to generate personalized nutrition plan based on user data
  // This is a placeholder implementation
  const nutritionPlan = {
    name: 'Personalized Nutrition Plan',
    description: `This is a personalized nutrition plan for user with ID: ${userData.id || 'unknown'}`,
    meals: [
      {
        name: 'Breakfast',
        food: 'Oatmeal with fruit',
      },
      {
        name: 'Lunch',
        food: 'Salad with chicken',
      },
      {
        name: 'Dinner',
        food: 'Salmon with vegetables',
      },
    ],
  };
  return nutritionPlan;
}

export async function GET() {
  const userId = '1'; // Replace with actual user ID from request
  const userData = await getUserData(userId);

  if (!userData) {
    return new Response('User not found', { status: 404 });
  }

  const nutritionPlan = generatePersonalizedNutritionPlan(userData);

  return new Response(JSON.stringify(nutritionPlan), {
    headers: { 'Content-Type': 'application/json' },
  });
}
