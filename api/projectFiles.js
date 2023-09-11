import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  // Find the absolute path of the json file
  const jsonPath = path.join(process.cwd(), 'json', 'data.json');

  // Read content of the data.json file
  const fileContent = await fs.readFile(jsonPath, { encoding: 'utf8' });

  // Return the content of the data
  return res.status(200).send(fileContent);
}