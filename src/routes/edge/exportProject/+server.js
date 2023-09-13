import fileUtility from '../../../lib/utils/fileUtility';

export const config = {
  runtime: 'edge'
};

// eslint-disable-next-line import/prefer-default-export
export async function POST({ request }) {
  // Define URL of the application
  const appURL = 'https://app.svetch.io';

  // Parse body of incoming request object
  const { repoName, state, token, user } = await request.json();

  // Store the repo owner information
  const owner = user.login;

  // Store the repo name
  const repo = repoName.replace(/\s+/g, '-');

  const getBlobs = async (files) => {
    // Store array of blob promises created from passing files to blob helper fn
    const promises = files.map((file) =>
      fetch(`${appURL}/repo/createBlob`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file,
          owner,
          repo,
          token
        })
      }).then((response) => response.json())
    );

    // Await all blob promises to resolve to blob objects
    const blobs = await Promise.all(promises);

    // Return the git blob objects
    return blobs;
  };

  try {
    // Create new GitHub repo named the value of repo
    await fetch(`${appURL}/repo/createForAuthenticatedUser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        repo,
        token
      })
    });

    // Create component files from user prototype, passing state from cookies
    const componentFiles = fileUtility.createFiles(state);

    // Get the static project files
    const projectFiles = await fetch('https://app.svetch.io/api/projectFiles', {
      method: 'GET'
    })
      .then((response) => response.json())
      .then(({ files }) => files);

    // Get git blobs from the project and component files for the commit
    const blobs = await getBlobs([...projectFiles, ...componentFiles]);

    // Create the tree structure for the blobs
    const { tree } = await fetch(`${appURL}/repo/createTreeStructure`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        blobs
      })
    }).then((response) => response.json());

    // Get the sha from the last commit (the inital commit when the repo was created)
    const commitSha = await fetch(`${appURL}/repo/getLastCommitSha`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        owner,
        repo,
        token
      })
    }).then((response) => response.text());

    // Create a git tree and get the corresponding sha
    const treeSha = await fetch(`${appURL}/repo/createGitTree`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        commitSha,
        owner,
        repo,
        token,
        tree
      })
    }).then((response) => response.text());

    // Create a new commit and get the corresponding sha
    const newCommitSha = await fetch(`${appURL}/repo/createCommit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        commitSha,
        owner,
        repo,
        token,
        treeSha
      })
    }).then((response) => response.text());

    // Update the reference for the git branch
    await fetch(`${appURL}/repo/updateReference`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        commitSha: newCommitSha,
        owner,
        repo,
        token
      })
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('ERROR:', err);
  }

  return new Response(200);
}
