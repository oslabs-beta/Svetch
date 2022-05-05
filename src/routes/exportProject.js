import axios from 'axios';
import { Octokit } from 'octokit';

export async function post({ request }) {
  const body = await request.json();
  const token = body.token;
  const octokit = new Octokit({
    auth: token
  })
  console.log('got this far')
  //create repo
  //await octokit.request('POST /user/repos', {name: 'New Repo'})
  
  //add files to repo

  return {
    status: 200
  }
}