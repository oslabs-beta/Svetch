import cookie from 'cookie';
import fs from 'fs';
import fse from 'fs-extra'

export async function post({ request }) {
    
    const cookies = cookie.parse(request.headers.get('cookie') || '');
    const requestData = await request.json();
    const {name, data, folder, sessionId} = requestData;
    const id = sessionId || cookies.session_id;
   
    // if (!fs.existsSync(`${id}`)) {   
    //     fs.mkdirSync(`${id}`);
    //     fse.copySync('Export',`${id}`);
    // }
    
    // fs.writeFileSync(`${id}/${folder}/${name}.svelte`, `${data}`);

    return {
        status: 201
    }
}
