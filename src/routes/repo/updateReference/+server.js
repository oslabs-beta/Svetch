import { Octokit } from 'octokit';
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods';

// eslint-disable-next-line import/prefer-default-export
export async function POST({ request }) {
  // Parse body of incoming request object
  const { commitSha, owner, repo, token } = await request.json();

  // Store a custom Octokit object with rest API plugin
  const CustomOctokit = Octokit.plugin(restEndpointMethods);

  // Store an initialized Octokit (pseudoclassical) object
  const octokit = new CustomOctokit({ auth: token });

  // Store the API response containing the new commit sha
  await octokit.rest.git.updateRef({
    owner,
    repo,
    ref: 'heads/main',
    sha: commitSha,
    force: true
  });

  // Return the commit sha
  return new Response(200);
}
