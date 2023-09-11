import axios from 'axios';
import { Octokit } from 'octokit';
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods';
import fileUtility from '../../../lib/utils/fileUtility';

// eslint-disable-next-line import/prefer-default-export
export async function POST({ request }) {
  
  // Parse body of incoming request object
  const { owner, repo, state, token } = await request.json();

  // Store a custom Octokit object with rest API plugin
  const CustomOctokit = Octokit.plugin(restEndpointMethods);

  // Store an initialized Octokit (pseudoclassical) object
  const octokit = new CustomOctokit({ auth: token });

  const createBlob = async ({ path, content }, encoding) => {
    // Store the API response containing git blob data
    const { data } = await octokit.rest.git.createBlob({
      owner,
      repo,
      content,
      encoding
    });

    // Return a new object containing the git blob and relative file path
    return { ...data, path };
  };

  const getBlobs = async (files) => {
    // Store array of blob promises created from passing files to blob helper fn
    const promises = files.map((file) => createBlob(file, file.encoding || 'utf-8'));

    // Await all blob promises to resolve to blob objects
    const blobs = await Promise.all(promises);

    // Return the git blob objects
    return blobs;
  };

  // Create component files from user prototype, passing state from cookies
  const componentFiles = fileUtility.createFiles(state);

  // Get the static project files
  const projectFiles = await axios
    .get('https://svetch.vercel.app/api/projectFiles')
    .then(({ data }) => data)
    .then(({ files }) => files)

  // Get git blobs from the project and component files for the commit
  const blobs = await getBlobs([...projectFiles, ...componentFiles]);

  return new Response(JSON.stringify({blobs}))
}