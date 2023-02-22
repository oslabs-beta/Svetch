import { v4 as uuidv4 } from "uuid";
import { canvas } from '../store.js';


const target = 'https://github.com/login/oauth/authorize';
const clientID = import.meta.env.VITE_VERCEL_ENV_CLIENT_ID;


export async function get(request) {
  const sessionID = uuidv4();
  const state = request.url.searchParams.get('state');
  const repoName = request.url.searchParams.get('repoName');
  const parsedState = JSON.parse(state);
  canvas.set(parsedState.canvas);

  const redirectURL = `${target}?client_id=${clientID}&redirect_uri=https://app.svetch.io/callback/${repoName ? `?repoName=${repoName}` : ''}&scope=repo%20read:user%20user:email&state=${sessionID}`
  
  
  return {
    status: 302,
    headers: {
      location: redirectURL,
      'set-cookie': `state=${state};path=/; HttpOnly`
    }
  }
}