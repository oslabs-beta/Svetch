// eslint-disable-next-line import/prefer-default-export
export async function POST({ cookies }) {
  const expiry = new Date(Date.now() - 3600);
  cookies.set('state', '', { path: '/', HttpOnly: true, expires: expiry });
  return new Response(200);
}
