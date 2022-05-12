import cookie from 'cookie';
import fs from 'fs';


export async function post({ request }) {
    const cookies = cookie.parse(request.headers.get('cookie') || ''); 
    let id = cookies.session_id
    console.log("begin deletion")
    if (fs.existsSync(`${id}`)) 
    {  
        fs.rmSync(`${id}`, { recursive: true, force: true });
    }
    console.log('done deleting')
   
    return {
        status: 200
    }
}
