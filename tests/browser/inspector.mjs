import { expect } from '@playwright/test';

export async function inspectorTab(page, name) {
  const tab = page.getByRole('tab', { name, exact: true });
  if (await tab.getAttribute('aria-selected') !== 'true') await tab.click();
  await expect(tab).toHaveAttribute('aria-selected', 'true');
}
