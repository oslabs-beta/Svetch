export async function get(request) {
  request.locals.user = null;
  return {
    status: 302,
    headers: {
      location: '/'
    }
  }
}