import JSZip from "jszip";
import fs from "fs";

const addFilesFromDirectoryToZip = (directoryPath = "", zip) => {
    const directoryContents = fs.readdirSync(directoryPath, {
      withFileTypes: true,
    });
   
    directoryContents.forEach(({ name }) => {
      const path = `${directoryPath}/${name}`;
  
      if (fs.statSync(path).isFile()) {
        zip.file(path, fs.readFileSync(path, "utf-8"));
      }
  
      if (fs.statSync(path).isDirectory()) {
        addFilesFromDirectoryToZip(path, zip);
      }
    });
  };


export async function get() {
  // for future feature, pass directory path(s) as a paramater on the request
  // if one path is passed in, use existing logic
  // if multiple paths are passed in, create a forEach loop using existing logic
  directoryPath = 'Export'
    const zip = new JSZip();
    zip.file();

      addFilesFromDirectoryToZip(directoryPath, zip);
//console.log(zip)
      const zipAsBase64 = await zip.generateAsync({ type: "base64" });
//console.log(zipAsBase64)
//response.locals.data = zipAsBase64
  return {
    body: zipAsBase64
  };
}