import { Octokit } from 'octokit';
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods';

// eslint-disable-next-line import/prefer-default-export
export async function POST({ request }) {
  // Parse body of incoming request object
  const { owner, repo, token } = await request.json();

  // Store a custom Octokit object with rest API plugin
  const CustomOctokit = Octokit.plugin(restEndpointMethods);

  // Store an initialized Octokit (pseudoclassical) object
  const octokit = new CustomOctokit({ auth: token });

  const { data } = await octokit.rest.repos.getBranch({
    owner,
    repo,
    branch: 'main'
  });

  // Return the sha of previous commit (initial commit from repository creation)
  return new Response(data.commit.sha);
}
