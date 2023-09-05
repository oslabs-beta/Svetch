// @ts-check
import { test, expect } from '@playwright/test';
import { env } from 'process';

test('has title', async ({ page }) => {
  // Go to homepage
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page.getByRole('link')).toContainText('Svetch');
});

test('new project button', async ({ page }) => {
  await page.goto('/');

  // Click the new project button.
  await page.getByRole('button', { name: 'New Project' }).click();

  // Expects page to have modal text asking to confirm.
  await expect(page.getByText('Are you sure?')).toBeVisible();

  // Expects page to have confirm button.
  await expect(page.getByRole('button', { name: 'Confirm' })).toBeVisible();
});

test('download button', async ({ page }) => {
  // Go to homepage
  await page.goto('/');

  // Click the download button.
  await page.getByRole('button', { name: 'Download' }).click();

  // Expects page to have modal prompt from project name.
  await expect(page.getByText('Enter a name for your project')).toBeVisible();

  // Expects page to have modal displaying save button.
  await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
});

test('sign in button', async ({ page, baseURL }) => {
  test.setTimeout(3000)
  await page.goto('/');

  // Click the sign in button.
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Wait for the redirection to login route.
  await page.waitForURL('https://github.com/login**');

  // If prompted for GitHub credentials (use url to determine if being prompted)
  if (page.url().match(/return_to=/)) {
    // Fill the stored username from .env.
    await page.getByLabel('Username or email address').fill(env.USERNAME || '');

    // Fill the stored password from .env.
    await page.getByLabel('Password').fill(env.PASSWORD || '');

    // Click the sign in button (on GitHub).
    await page.click('input[type="submit"]');
  }
  // If prompted to authorize the application
  if (await page.getByRole('button', { name: 'Authorize matthewlapeer' }).count()) {
    // Click the authorize button.
    await page.getByRole('button', { name: 'Authorize matthewlapeer' }).click();
  }
  // Wait for the redirection back to home.
  await page.waitForURL(baseURL || '');

  // Expects page to have sign out button.
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();
});
