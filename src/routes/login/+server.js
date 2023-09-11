// eslint-disable-next-line import/no-unresolved
import { redirect } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';

// Store the target of OAuth request
const target = 'https://github.com/login/oauth/authorize';

// Obtain clientID from env variables
const clientID = import.meta.env.VITE_VERCEL_ENV_CLIENT_ID || import.meta.env.VITE_CLIENT_ID;

// eslint-disable-next-line import/prefer-default-export
export async function GET({ url, cookies }) {
  // Store search params from incoming url object
  const { searchParams } = url;

  // Store state string from search params
  const state = searchParams.get('state');

  // Store repoName string if it exists as a serach param
  const repoName = searchParams.get('repoName');

  // Store the application URI for redirect URL
  const redirectURI = 'https://svetch.vercel.app/callback';

  // Define the OAuth scope to be requested
  const OAuthScope = 'scope=repo%20read:user%20user:email';

  // Define the OAuth state string
  const OAuthState = `state=${uuidv4()}`;

  // Construct search params string from repoName, OAuthScope and OAuthState
  const redirectParams = `${repoName ? `?repoName=${repoName}` : ''}&${OAuthScope}&${OAuthState}`;

  // Construct complete redirectURL
  const redirectURL = `${target}?client_id=${clientID}&redirect_uri=${redirectURI}/${redirectParams}`;

  cookies.set('state', state, {path: '/', HttpOnly: true})

  throw redirect(302, redirectURL)

}
