const target = 'https://github.com/login/oauth/authorize';
const clientID = import.meta.env.VITE_CLIENT_ID;

export async function get(request) {
  //sessionID is a piece of state
  const sessionID = '1234';

  // const searchParams = request.url.searchParams.get('exportProject')
  // const redirectURL = `${target}?client_id=${clientID}
  //   &redirect_uri=http://localhost:3000/callback/${searchParams ? '?exportProject=true' : ''}
  //   &scope=repo&state=${sessionID}`
  
  return {
    status: 302,
    headers: {
      location: `${target}?client_id=${clientID}&redirect_uri=http://localhost:3000/callback/?exportProject=true&scope=repo&state=${sessionID}`
    }
  }
}