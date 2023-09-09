import path from 'path';
import { promises as fs } from 'fs';

// eslint-disable-next-line import/prefer-default-export
export async function GET() {
  // Find the absolute path of the json file
  const jsonPath = path.join(process.cwd(), 'json', 'data.json');

  // Read content of the data.json file
  const fileContent = await fs.readFile(jsonPath, { encoding: 'utf8' });
  // Return the content of the data in json format
  return new Response(fileContent)
}
