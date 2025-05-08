export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')

  console.log('query', query)

  let intent = 'default';

  if (query?.includes('exercise')) {
    intent = 'exercise';
  } else if (query?.includes('nutrition')) {
    intent = 'nutrition';
  }

  let responseText = `Hello from AI Agent! query: ${query}, intent: ${intent}`;
  let apiUrl = '';

  if (intent === 'exercise') {
    apiUrl = '/api/exercise';
    responseText = 'Routing to exercise microservice...';
  } else if (intent === 'nutrition') {
    apiUrl = '/api/nutrition';
    responseText = 'Routing to nutrition microservice...';
  }

  if (apiUrl) {
    try {
      const response = await fetch(apiUrl);
      const data = await response.text();
      responseText = data;
    } catch (error) {
      console.error(error);
      responseText = 'Error routing to microservice.';
    }
  }

  return new Response(responseText)
}
