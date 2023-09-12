export const config = {
  runtime: 'edge'
};

// eslint-disable-next-line import/prefer-default-export
export async function POST({ request }) {
  
  // Parse body of incoming request object
  const { repoName, state, token, user } = await request.json();

  // Store the repo owner information
  const owner = user.login;

  // Store the repo name
  const repo = repoName.replace(/\s+/g, '-');

  try {
    const appURL = 'https://svetch.vercel.app'

    // Create new GitHub repo named the value of repo
    await fetch(`${appURL}/repo/createForAuthenticatedUser`,{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        repo,
        token
      })
    })

    // Get git blobs from the project and component files for the commit
    const { blobs } = await fetch(`${appURL}/repo/getBlobs`,{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        owner,
        repo,
        state,
        token
      })
    }).then(response => response.json())

    // Create the tree structure for the blobs
    const { tree } = await fetch(`${appURL}/repo/createTreeStructure`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        blobs
      })
    }).then(response => response.json())

    // Get the sha from the last commit (the inital commit when the repo was created)
    const commitSha = await fetch(`${appURL}/repo/getLastCommitSha`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        owner,
        repo,
        token
      })
    }).then(response => response.text())

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
    }).then(response => response.text())

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
    }).then(response => response.text())
    
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
    })

  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('ERROR:', err);
  }

  return new Response(200)
}