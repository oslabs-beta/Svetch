import fs from 'fs';
export async function post({ request }) {
    
    const data = await request.json();
    const {name, text, folder} = data
    
    fs.writeFileSync(`${folder}/${name}.svelte`, `${text}`);
    
    console.log(`done with ${name}`)
    return {
        status: 200
    }
}
// if (name === 'index' && !fs.existsSync('Export/Src')){
//     fs.mkdirSync('Export/Src');
// }


// else if (name !== 'index' && !fs.existsSync('Export/Src/lib')){
//     fs.mkdirSync('Export/Src/lib');
//       }