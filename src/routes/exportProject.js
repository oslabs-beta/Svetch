import { Octokit } from 'octokit';
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods';
import fs from 'fs';
import axios from 'axios';
import fileUtility from '../utils/fileUtility';
import { repoName } from '../store.js';

export let myFakeUser = 'fake';
export async function post({ request }) {
  const body = await request.json();
  const token = body.token;
  const owner = body.user.login;
  const sessionId = body.sessionId;
  
  let repo;
  const unsubscribe = repoName.subscribe((val) => repo = val);
	unsubscribe();
  repo = repo.split(' ').join('-');
  
  const CustomOctokit = Octokit.plugin(restEndpointMethods);
  const octokit = new CustomOctokit({ auth: token });
  
  // GitHub API helper functions
  const createBlob = async (absolutePath, path) => {
    const content = fs.readFileSync(absolutePath, { encoding: 'utf8' });
    const response = await octokit.rest.git.createBlob({
      owner,
      repo,
      content,
    });
    return {...response.data, path};
  }
  
  const createCommit = async (commitSha, treeSha) => {
    const response = await octokit.rest.git.createCommit({
      owner,
      repo,
      message: 'Svetch Initial Commit',
      parents: [],
      tree: treeSha,
    });
    return response.data.sha;
  }
  
  const createGitTree = async (tree, commitSha) => {
    const response = await octokit.rest.git.createTree({
      owner,
      repo,
      base_tree: commitSha,
      tree
    });
    return response.data.sha;
  }

  const createTreeStructure = async (blobs) => {
    const tree = [];
    blobs.forEach(({ path, sha }) => tree.push({ 
      path, 
      mode: '100644',
      type: 'blob',
      sha }));
    return tree;
  }

  const getBlobs = async (directory) => {
    let blobs = [];
    const dirEntries = fs.readdirSync(directory, {
      withFileTypes: true,
    });
    
    for (let dirEntry of dirEntries) {
      const { name } = dirEntry;
      const absolutePath = `${directory}/${name}`;
      const relativePath = absolutePath.slice(sessionId.length + 1);

      // If the dirEntry at the absolutePath contains file content, then add it to the repo at its relativePath
      if (fs.statSync(absolutePath).isFile()) {
        const newBlob = await createBlob(absolutePath, relativePath);
        blobs.push(newBlob);
      }

      // Otherwise get the contents of the dirEntry at the absolutePath
      else {
        const newBlobs = await getBlobs(absolutePath);
        blobs.push(...newBlobs)}
    }
    return blobs;
  };

  const getLastCommitSha = async () => {
    const branch = await octokit.rest.repos.getBranch({
      owner,
      repo,
      branch: 'main',
    });
    return branch.data.commit.sha;
  }
  
  const updateReference = async (commitSha) => {
    await octokit.rest.git.updateRef({
      owner,
      repo,
      ref: 'heads/main',
      sha: commitSha,
      force: true
    });
    return;
  }

  try {
    // Create new GitHub repo named the value of repo 
    await octokit.rest.repos.createForAuthenticatedUser({ name: repo, auto_init: true });
    // Create project files in folder unique to user, copy files from template
    await fileUtility.createFile(sessionId);
    // Get git blobs for the commit
    const blobs = await getBlobs(sessionId);
    // Create the tree structure for the blobs
    const tree = await createTreeStructure(blobs);
    // Get the sha from the last commit (the inital commit when the repo was created)
    const commitSha = await getLastCommitSha();
    // Create a git tree and get the corresponding sha
    const treeSha = await createGitTree(tree, commitSha);
    // Create a new commit and get the corresponding sha
    const newCommitSha = await createCommit(commitSha, treeSha);
    // Update the reference for the git branch
    await updateReference(newCommitSha);
    // Delete the user folder
    await axios.post('/fileDelete', {sessionId});

  } catch (err) {
    console.log('ERROR:', err)
  }

  return {
    status: 200
  }
}