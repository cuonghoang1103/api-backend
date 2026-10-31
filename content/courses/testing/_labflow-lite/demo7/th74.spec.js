import { test, expect } from '@playwright/test';

// The header title shrinks on small screens (style.css: @media (max-width: 600px)).
test('the header title size follows the screen width', async ({ page }, testInfo) => {
  await page.goto('/');
  const mobile = testInfo.project.name.startsWith('mobile');
  await expect(page.getByRole('heading', { name: 'LabFlow Lite' })).toHaveCSS('font-size', mobile ? '17px' : '20px');
});
