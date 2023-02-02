import { Octokit } from 'octokit';
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods';
import axios from 'axios';
import fileUtility from '../utils/fileUtility';

export async function post({ request }) {
  // Parse body of incoming request object
  const body = await request.json();

  // Store the oauth token
  const token = body.token;

  // Store the repo owner information
  const owner = body.user.login;

  // Store the repo name
  const repo = body.repoName.replace(/\s+/g,'-');
  
    // Store a custom Octokit object with rest API plugin
    const CustomOctokit = Octokit.plugin(restEndpointMethods);

    // Store an initialized Octokit (pseudoclassical) object
    const octokit = new CustomOctokit({ auth: token });
    
    // GitHub API helper functions
    const createBlob = async ({ relativePath, fileContent }, encoding) => {
      // Store the API response containing git blob data
      const response = await octokit.rest.git.createBlob({
        owner,
        repo,
        content: fileContent,
        encoding
      });
  
      // Return a new object containing the git blob and relative file path
      return { ...response.data, path: relativePath };
    }
    
    const createCommit = async (treeSha) => {
      // Store the API response containing the new commit sha
      const response = await octokit.rest.git.createCommit({
        owner,
        repo,
        message: 'Svetch Initial Commit',
        parents: [],
        tree: treeSha,
      });
  
      // Return the commit sha
      return response.data.sha;
    }
    
    const createGitTree = async (tree, commitSha) => {
      // Store the API reponse containing the new git tree
      const response = await octokit.rest.git.createTree({
        owner,
        repo,
        base_tree: commitSha,
        tree
      });
  
      // Return the sha for the created git tree
      return response.data.sha;
    }
  
    const createTreeStructure = async (blobs) => {
      // Declare an array to store the objects specifying hierarchy between files
      const tree = [];
  
      // Iterate over the blobs and push a hierarchy object into the tree array for each
      for (const { path, sha } of blobs) { 
        tree.push({ 
          path, 
          mode: '100644',
          type: 'blob',
          sha });
      }
  
      // Return the array defining the tree structure
      return tree;
    }

  const getBlobs = async (files) => {
    // Store the promises as they are created
    const promises = [];

    for (const file of files) {
      // Store a new blob from the helper function
      const newBlob = createBlob(file, (file.encoding || 'utf-8'));

      // Add the new blob promise to the array
      promises.push(newBlob);
    }

    // Await all blob promises to resolve to blob objects
    const blobs = await Promise.all(promises);

    // Return the git blob objects
    return blobs;
  };

  const getLastCommitSha = async () => {
    // Get the repository 'main' branch metadata
    const branch = await octokit.rest.repos.getBranch({
      owner,
      repo,
      branch: 'main',
    });

    // Return the sha of previous commit (initial commit from repository creation)
    return branch.data.commit.sha;
  }
  
  const updateReference = async (commitSha) => {
    // return promise for API request to update git branch reference
    return octokit.rest.git.updateRef({
      owner,
      repo,
      ref: 'heads/main',
      sha: commitSha,
      force: true
    });
  }

  try {
    // Create new GitHub repo named the value of repo 
    await octokit.rest.repos.createForAuthenticatedUser({ name: repo, auto_init: true });
   
    // Create component files from user prototype
    const componentFiles = fileUtility.createFile();

    // Get the static project files
    const projectFiles = await axios.get('https://app.svetch.io/api/projectSkeleton')
      .then(({ data }) => JSON.parse(data))
      .then(({ files }) => files);

    // Get git blobs from the project and component files for the commit
    const blobs = await getBlobs([ ...projectFiles, ... componentFiles ]);

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
    console.log('ERROR:', err)
  }

  return {
    status: 200
  }
}