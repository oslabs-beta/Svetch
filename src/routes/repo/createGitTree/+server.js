import { Octokit } from 'octokit';
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods';

// eslint-disable-next-line import/prefer-default-export
export async function POST({ request }) {

  // Parse body of incoming request object
  const { commitSha, owner, repo, token, tree } = await request.json();

  // Store a custom Octokit object with rest API plugin
  const CustomOctokit = Octokit.plugin(restEndpointMethods);

  // Store an initialized Octokit (pseudoclassical) object
  const octokit = new CustomOctokit({ auth: token });

  // Store the API reponse containing the new git tree
  const { data } = await octokit.rest.git.createTree({
    owner,
    repo,
    base_tree: commitSha,
    tree
  });
  
  // Return the sha for the created git tree
  return new Response(data.sha)
}