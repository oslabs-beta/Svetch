import { Octokit } from 'octokit';
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods';
import axios from 'axios';
import fileUtility from '../utils/fileUtility';

// eslint-disable-next-line import/prefer-default-export
export async function post({ request }) {
  // Parse body of incoming request object
  const {
    repoName,
    state,
    token,
    user,
  } = await request.json();

  // Store the repo owner information
  const owner = user.login;

  // Store the repo name
  const repo = repoName.replace(/\s+/g, '-');

  // Store a custom Octokit object with rest API plugin
  const CustomOctokit = Octokit.plugin(restEndpointMethods);

  // Store an initialized Octokit (pseudoclassical) object
  const octokit = new CustomOctokit({ auth: token });

  // GitHub API helper functions
  const createBlob = async ({ path, content }, encoding) => {
    // Store the API response containing git blob data
    const { data } = await octokit.rest.git.createBlob({
      owner,
      repo,
      content,
      encoding,
    });

    // Return a new object containing the git blob and relative file path
    return { ...data, path };
  };

  const createCommit = async (treeSha) => {
    // Store the API response containing the new commit sha
    const { data } = await octokit.rest.git.createCommit({
      owner,
      repo,
      message: 'Svetch Initial Commit',
      parents: [],
      tree: treeSha,
    });

    // Return the commit sha
    return data.sha;
  };

  const createGitTree = async (tree, commitSha) => {
    // Store the API reponse containing the new git tree
    const { data } = await octokit.rest.git.createTree({
      owner,
      repo,
      base_tree: commitSha,
      tree,
    });

    // Return the sha for the created git tree
    return data.sha;
  };

  // Return an array of objects specifying hierarchy between files
  const createTreeStructure = async (blobs) => blobs
    .map(({ path, sha }) => ({
      path,
      mode: '100644',
      type: 'blob',
      sha,
    }));

  const getBlobs = async (files) => {
    // Store array of blob promises created from passing files to blob helper fn
    const promises = files
      .map((file) => createBlob(file, (file.encoding || 'utf-8')));

    // Await all blob promises to resolve to blob objects
    const blobs = await Promise.all(promises);

    // Return the git blob objects
    return blobs;
  };

  const getLastCommitSha = async () => {
    // Get the repository 'main' branch metadata
    const { data } = await octokit.rest.repos.getBranch({
      owner,
      repo,
      branch: 'main',
    });

    // Return the sha of previous commit (initial commit from repository creation)
    return data.commit.sha;
  };

  // return promise for API request to update git branch reference
  const updateReference = async (commitSha) => octokit.rest.git.updateRef({
    owner,
    repo,
    ref: 'heads/main',
    sha: commitSha,
    force: true,
  });

  try {
    // Create new GitHub repo named the value of repo
    await octokit.rest.repos.createForAuthenticatedUser({ name: repo, auto_init: true });

    // Create component files from user prototype, passing state from cookies
    const componentFiles = fileUtility.createFiles(state);

    // Get the static project files
    const projectFiles = await axios.get('https://app.svetch.io/data.json')
      .then(({ data }) => JSON.parse(data))
      .then(({ files }) => files);

    // Get git blobs from the project and component files for the commit
    const blobs = await getBlobs([...projectFiles, ...componentFiles]);

    // Create the tree structure for the blobs
    const tree = await createTreeStructure(blobs);

    // Get the sha from the last commit (the inital commit when the repo was created)
    const commitSha = await getLastCommitSha();

    // Create a git tree and get the corresponding sha
    const treeSha = await createGitTree(tree, commitSha);

    // Create a new commit and get the corresponding sha
    const newCommitSha = await createCommit(treeSha);

    // Update the reference for the git branch
    await updateReference(newCommitSha);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('ERROR:', err);
  }

  return {
    status: 200,
  };
}
