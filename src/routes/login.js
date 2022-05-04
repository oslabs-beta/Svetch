const target = 'https://github.com/login/oauth/authorize';
const clientID = import.meta.env.VITE_CLIENT_ID;

export async function get(request) {
  //sessionID is a piece of state
  const sessionID = '1234';
  console.log(clientID);
  
  return {
    status: 302,
    headers: {
      location: `${target}?client_id=${clientID}&state=${sessionID}`
    }
  }
}