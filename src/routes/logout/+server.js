import { redirect } from '@sveltejs/kit';

// eslint-disable-next-line import/prefer-default-export
export async function GET({ url, cookies }) {
  const state = url.searchParams.get('state')

  cookies.set('state', state, {path: '/', HttpOnly: true})

  const expiry = new Date(Date.now() - 3600)

  cookies.set('user', null, { path: '/', HttpOnly: true, expires: expiry })

  throw redirect(302, '/')
}