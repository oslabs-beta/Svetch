// eslint-disable-next-line import/prefer-default-export
export async function get({ locals, url }) {
  locals.user = null; // eslint-disable-line no-param-reassign
  const state = url.searchParams.get('state');

  return {
    status: 302,
    headers: {
      location: '/',
      'set-cookie': `state=${state};path=/; HttpOnly`
    }
  };
}
