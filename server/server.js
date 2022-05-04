import http from 'http';
import fs from 'fs';
import path from'path';
import express from 'express';
//import bodyParser from 'body-parser'
const PORT = 3001;

const app = express();

//var jsonParser = bodyParser.json()

app.use(express.json());

app.post('/file', (req, res) =>
  { 
    let {fileName, text, folder} = req.body;
    fs.writeFileSync(`${folder}/${fileName}.svelte`, `${text}`);
    res.write('File made');
    res.end();

  })
  app.post('/folder', (req, res) =>
  { 
    let {folder} = req.body;
    if (!fs.existsSync(folder)){
        fs.mkdirSync(folder);
         }
        res.write('Folder made');
        res.end();

  })


app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}...`);
  });
// const server = http.createServer((request, response) => {
 
//    if (request.method === 'POST' && request.url === '/file') {
//     console.log(request.body)
//     //let {fileName, text, folder} = request.body
//     // code here...
//     //fs.appendFileSync('hi_log.txt', 'Somebody said hi.\n');

//     //fs.writeFileSync(`${folder}/${fileName}.svelte`, `${text}`)
//     // if (!fs.existsSync('Export/lib')){
//     //     fs.mkdirSync('Export/lib');
//     // }
//     //fs.writeFileSync('Export/lib/testNestedFile.svelte', '<script>/n</script>')
//     response.write('File made');
//     response.end();
//   }
//   else if (request.method === 'POST' && request.url === '/folder') {
//     if (!fs.existsSync('Export/lib')){
//         fs.mkdirSync('Export/lib');
//     }
//     response.write('Folder made');
//     response.end();
//   }
//   else {
//     // Handle 404 error: page not found
//     // code here...
//     response.writeHead(404,
//       'Error: Not Found',
//       {'Content-Type': 'application/json'});
//     response.end('<h1>Error: Not Found</h1>');
    
//   }
// }).listen(8080);

//module.exports = server;