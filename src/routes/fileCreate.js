import cookie from 'cookie';
import fs from 'fs';
import fse from 'fs-extra'

export async function post({ request }) {
    
    const cookies = cookie.parse(request.headers.get('cookie') || '');
    const data = await request.json();
    const {name, text, folder} = data
    let id = cookies.session_id
   
    if (!fs.existsSync(`${id}`)) 
    {   
        fs.mkdirSync(`${id}`);
        
        fse.copySync('Export',`${id}`)
    }
    
    fs.writeFileSync(`${id}/${folder}/${name}.svelte`, `${text}`);
    
    console.log(`done with ${name}`)
    return {
        status: 200
    }
}
