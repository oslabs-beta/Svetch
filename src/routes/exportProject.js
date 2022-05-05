import axios from 'axios';
import { Octokit } from 'octokit';

const getPrimamryEmail = (emails) => {
  let primaryEmail;
  emails.forEach((email) => {
    if (email.primary === true) primaryEmail = email.email;
  })
  return primaryEmail;
}


export async function post({ request }) {
  const body = await request.json();
  const token = body.token;
  const user = body.user;
  const octokit = new Octokit({
    auth: token
  })
  
  const response = await axios.get('http://localhost:3000/zip');
  const base64Data = await response.data;
  const repoName = 'New-Repo'
  const path = 'test.zip';
  
  try {
    await octokit.request('POST /user/repos', {name: repoName})
    const emails = await octokit.request('GET /user/emails', {});
    const email = getPrimamryEmail(emails.data);
    
    await octokit.request(`PUT /repos/${user.login}/${repoName}/contents/${path}`, {
        owner: user.login,
        repo: repoName,
        path: path,
        message: 'my commit message',
        committer: {
          name: user.login,
          email: email
        },
        content: base64Data
      })
  } catch (err) {
    console.log('ERROR:', err)
  }

  return {
    status: 200
  }
}