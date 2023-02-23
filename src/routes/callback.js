import axios from 'axios';
const tokenURL = 'https://github.com/login/oauth/access_token';
const userURL = 'https://api.github.com/user';

const clientId = import.meta.env.VITE_VERCEL_ENV_CLIENT_ID;
const clientSecret = import.meta.env.VITE_VERCEL_ENV_CLIENT_SECRET;

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
  const data = response.data;
  return data.access_token;
}

const getUser = async (token) => {
  const response = await axios.get(userURL, {
    headers: { 
      Accept: 'application/json',
      Authorization: `bearer ${token}`
    }
  });

  return response.data;
}

export async function get (request) {
  // get code from Github
  const code = request.url.searchParams.get('code');
  // get the repo name from request search paramaters
  const repoName = request.url.searchParams.get('repoName');
  // get accessToken from Github
  const token = await getToken(code);
  // get user info from Github
  const user = await getUser(token);
  request.locals.user = user.login;
  // get canvas state from cookie
  const state = request.locals.state;
  
  if (repoName) {
    await axios({
      method: 'post',
      url: 'https://app.svetch.io/exportProject',
      data: {
        token: token,
        user: user,
        repoName,
        state 
      }
    });
  }
  
  return {
    status: 302,
    headers: {
      location: '/'
    }
  }
}
