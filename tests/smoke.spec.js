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
  await page.goto('/');

  // Click the download button.
  await page.getByRole('button', { name: 'Download' }).click();

  // Expects page to have modal prompt from project name.
  await expect(page.getByText('Enter a name for your project')).toBeVisible();

  // Expects page to have modal displaying save button.
  await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
});
