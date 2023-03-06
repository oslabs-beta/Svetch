// eslint-disable-next-line import/prefer-default-export
export async function post() {
  const expiry = new Date(Date.now() - 3600).toUTCString();
  return {
    status: 200,
    headers: {
      location: '/',
      'set-cookie': `state='';path=/; HttpOnly; expires=${expiry}`,
    },
  };
}
