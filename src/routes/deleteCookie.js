export async function post({ request }) {
    
  return {
    status: 200,
    headers: {
      'set-cookie': `state='';path=/; HttpOnly; Max-Age=0`
    } 
  }
}