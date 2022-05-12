import fs from 'fs';
export async function get({request}) {
    let indexPath = 'Export/src/routes/index.svelte'
    let libPath = 'Export/src/lib'

    if (fs.existsSync(indexPath)){
       
     fs.unlinkSync(indexPath)
    }
     fs.rmSync(libPath, { recursive: true, force: true });
     fs.mkdirSync(libPath)

     console.log(request)
return ({status: 200})
}