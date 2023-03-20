export async function get(request) {
  request.locals.user = null;
  const state = request.url.searchParams.get('state');
  
  return {
    status: 302,
    headers: {
      location: '/',
      'set-cookie': `state=${state};path=/; HttpOnly`
    }
  }
}