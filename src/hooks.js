import * as cookie from 'cookie';
import { v4 as uuidv4 } from "uuid";

export async function handle({ event, resolve }) {
  // before each request, get the cookies
  const cookies = cookie.parse(event.request.headers.get('cookie') || '');

  // update the stored user to be the value of the user cookie
  event.locals.user = cookies.user;
  event.locals.sessionId = cookies.session_id;
  event.locals.state = cookies.state;
  // console.log('cookie stored in cookies: ', cookie.state);
  
  // process the HTTP request
  const response = await resolve(event);
  
  // add the cookie to the response
  response.headers.append('set-cookie', `user=${event.locals.user || ''};path=/; HttpOnly`)
  response.headers.append('set-cookie', `session_id=${event.locals.sessionId || uuidv4()};path=/; HttpOnly; sameSite=lax`)
  
  return response;
}

export async function getSession(event) {
  // client-side exposed information (do not store secure info here)
  const cookies = cookie.parse(event.request.headers.get('cookie') || '');
  return {
    user: event.locals.user,
    state: event.locals.state
  }
}