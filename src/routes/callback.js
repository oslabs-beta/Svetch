import axios from 'axios';
const tokenURL = 'https://github.com/login/oauth/access_token';

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

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

export async function get (request) {

  // get code from Github
  const code = request.url.searchParams.get('code');
  //get accessToken from Github
  const token = await getToken(code);
 
  return {
    body: token
  }
}