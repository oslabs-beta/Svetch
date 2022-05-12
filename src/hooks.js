import cookie from 'cookie';

export async function handle({ event, resolve }) {
  // before each request, get the cookies
  const cookies = cookie.parse(event.request.headers.get('cookie') || '');
  // update the stored user to be the value of the user cookie
  event.locals.user = cookies.user;
  //event.locals.sessionId = cookies.sessionId

  const response = await resolve(event);
  // add the cookie to the response
  response.headers.append('set-cookie', `user=${event.locals.user || ''}; path=/; HttpOnly`)
  
  return response;
}

export async function getSession(event) {
  
  return {
    user: event.locals.user,
    userToken: event.locals.userToken
  }
}