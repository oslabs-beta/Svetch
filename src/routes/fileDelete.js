import cookie from 'cookie';
import fs from 'fs';


export async function post({ request }) {
    const cookies = cookie.parse(request.headers.get('cookie') || '');
    const body = await request.json();
    const id = body.sessionId || cookies.session_id;

    
    if (fs.existsSync(`${id}`)) {  
        fs.rmSync(`${id}`, { recursive: true, force: true });
    }
   
    return {
        status: 200
    }
}
