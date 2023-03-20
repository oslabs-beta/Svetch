import * as cookie from 'cookie';
import { v4 as uuidv4 } from 'uuid';

export async function handle({ event, resolve }) {
  // Before each request, get the cookies
  const cookies = cookie.parse(event.request.headers.get('cookie') || '');

  // Store reference to the locals object
  const { locals } = event;

  // Update the stored user to be value of the associated cookie
  locals.user = cookies.user;

  // Update the stored session id to be value of associated cookie
  locals.sessionId = cookies.session_id;

  // Update the stored state to be value of associated cookie
  locals.state = cookies.state;

  // Process the HTTP request
  const response = await resolve(event);

  // Add the user cookie to the response
  response.headers.append('set-cookie', `user=${locals.user || ''};path=/; HttpOnly`);

  // Add the session cookie to the response
  response.headers.append('set-cookie', `session_id=${locals.sessionId || uuidv4()};path=/; HttpOnly; sameSite=lax`);

  // Return the response object
  return response;
}

/**
 * Expose session pieces of state to the client:
 * @note Exposed on client-side (DO NOT store secure info in function body)
 * @param {string} locals destructured from event object
 * @returns {object} contains user and state data from event object
 */

export async function getSession({ locals }) {
  // Return user and state values from request event object
  return {
    user: locals.user,
    state: locals.state,
  };
}
