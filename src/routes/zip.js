import JSZip from "jszip";
import fs from "fs";
import cookie from 'cookie';

let sessionId;

const addFilesFromDirectoryToZip = (directoryPath = "", zip) => {
    const directoryContents = fs.readdirSync(directoryPath, {
      withFileTypes: true,
    });
  
    directoryContents.forEach(({ name }) => {
      
      const absolutePath = `${directoryPath}/${name}`;
      const relativePath = absolutePath.slice(sessionId.length + 1);
  
      if (fs.statSync(absolutePath).isFile()) {
        zip.file(relativePath, fs.readFileSync(absolutePath, "utf-8"));
      }
  
      if (fs.statSync(absolutePath).isDirectory()) {
        addFilesFromDirectoryToZip(absolutePath, zip);
      }
    });
  };


export async function get({request}) {
  const cookies = cookie.parse(request.headers.get('cookie') || ''); 
    sessionId = cookies.session_id;
    const zip = new JSZip();
    addFilesFromDirectoryToZip(sessionId, zip);
    const zipAsBase64 = await zip.generateAsync({ type: "base64" });
  return {
    body: zipAsBase64
  };
}