import { Octokit } from 'octokit';
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods';

// eslint-disable-next-line import/prefer-default-export
export async function POST({ request }) {
  // Parse body of incoming request object
  const { file, owner, repo, token } = await request.json();

  // Store a custom Octokit object with rest API plugin
  const CustomOctokit = Octokit.plugin(restEndpointMethods);

  // Store an initialized Octokit (pseudoclassical) object
  const octokit = new CustomOctokit({ auth: token });

  // Store the API response containing git blob data
  const { data } = await octokit.rest.git.createBlob({
    owner,
    repo,
    content: file.content,
    encoding: file.encoding || 'utf-8'
  });

  // Return a new object containing the git blob and relative file path
  return new Response(JSON.stringify({ ...data, path: file.path }));
}
