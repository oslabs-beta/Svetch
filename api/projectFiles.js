import path from 'path';
import { promises as fs } from 'fs';

export default async function get({ response }) {
    //Find the absolute path of the json file
    const jsonPath = path.join(process.cwd(), 'json', 'data.json');
  
    //Read content of the data.json file
    const fileContent = await fs.readFile(jsonPath, { encoding: 'utf8' });
  
    //Return the content of the data in json format
    return response.status(200).json(fileContent);
  }
