import { v4 as uuidv4 } from "uuid";


const target = 'https://github.com/login/oauth/authorize';
const clientID = import.meta.env.VITE_CLIENT_ID;


export async function get(request) {
  //sessionID is a piece of state
  const sessionID = uuidv4();
 
  const searchParams = request.url.searchParams.get('exportProject')
  const redirectURL = `${target}?client_id=${clientID}&redirect_uri=http://localhost:3000/callback/${searchParams ? '?exportProject=true' : ''}&scope=repo%20read:user%20user:email&state=${sessionID}`
  
  
  return {
    status: 302,
    headers: {
      location: redirectURL
    }
  }
}