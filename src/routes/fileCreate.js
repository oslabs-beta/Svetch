import cookie from 'cookie';
import fs from 'fs';
import path from 'path';
import fse from 'fs-extra'

export async function post({ request }) {
    
    const cookies = cookie.parse(request.headers.get('cookie') || '');
    const requestData = await request.json();
    const {name, data, folder, sessionId} = requestData;
    const id = sessionId || cookies.session_id;
    
    // if (!fs.existsSync(`${process.execPath}/${id}`)) {   
    //     fs.mkdirSync(`${process.execPath}/${id}`);
    //     fse.copySync('Export',`${process.execPath}/${id}`);
    // }
    
    const ROUTE_CACHE_PATH = path.resolve(path.join(process.cwd(), 'routes'));

    fs.writeFileSync(`${ROUTE_CACHE_PATH}/${id}/${folder}/${name}.svelte`, `${data}`);

    // const testPath = `${process.execPath}/${id}`;

    return {
        status: 201
    }
}
