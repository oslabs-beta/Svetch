// eslint-disable-next-line import/no-unresolved
import { redirect } from '@sveltejs/kit';
import axios from 'axios';

const tokenURL = 'https://github.com/login/oauth/access_token';
const userURL = 'https://api.github.com/user';

const clientId = import.meta.env.VITE_VERCEL_ENV_CLIENT_ID || import.meta.env.VITE_CLIENT_ID;
const clientSecret =
  import.meta.env.VITE_VERCEL_ENV_CLIENT_SECRET || import.meta.env.VITE_CLIENT_SECRET;

const getToken = async (code) => {
  const requestData = JSON.stringify({
    client_id: clientId,
    client_secret: clientSecret,
    code
  });

  const response = await axios.post(tokenURL, requestData, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  });
  const { data } = response;
  return data.access_token;
};

const getUser = async (token) => {
  const response = await axios.get(userURL, {
    headers: {
      Accept: 'application/json',
      Authorization: `bearer ${token}`
    }
  });

  return response.data;
};

// eslint-disable-next-line import/prefer-default-export
export async function GET({ url, cookies }) {
  // get code from Github
  const code = url.searchParams.get('code');
  // get the repo name from request search paramaters
  const repoName = url.searchParams.get('repoName');

  // get accessToken from Github
  const token = await getToken(code);

  // get user info from Github
  const user = await getUser(token);

  cookies.set('user', user.login, { path: '/', HttpOnly: true });

  // get canvas state from cookie
  const state = cookies.get('state');

  if (repoName) {
    axios({
      method: 'post',
      url: 'https://app.svetch.io/edge/exportProject',
      data: {
        token,
        user,
        repoName,
        state
      }
    });
  }

  throw redirect(302, '/');
}
