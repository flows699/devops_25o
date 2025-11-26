import { test, expect } from '@playwright/test';

test.describe('Valutaváltó App E2E', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/'); 
  });

  test('Loading and default values check', async ({ page }) => {
    await expect(page).toHaveTitle(/Valutaváltó/i);
    await expect(page.getByText('Valutaváltó')).toBeVisible();

    const amountInput = page.getByTestId('amount-input');
    await expect(amountInput).toHaveValue('100');
  });

  test('Currency conversion test', async ({ page }) => {
    const amountInput = page.getByTestId('amount-input');
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/api/convert')
    );

    await amountInput.clear();
    await amountInput.pressSequentially('50', { delay: 100 });
    await amountInput.blur();
    await responsePromise;
    const resultValue = page.getByTestId('result-value');    
    await expect(resultValue).not.toBeEmpty();
    
    const text = await resultValue.textContent();
    const numberValue = parseFloat(text || '0');
    expect(numberValue).toBeGreaterThan(0);
  });

  test('Swap button functionality', async ({ page }) => {
    const fromSelect = page.getByTestId('from-select');
    const toSelect = page.getByTestId('to-select');
    
    const swapBtn = page.getByTestId('swap-button');

    await expect(fromSelect).toHaveValue('EUR');
    await expect(toSelect).toHaveValue('HUF');

    await swapBtn.click();

    await expect(fromSelect).toHaveValue('HUF');
    await expect(toSelect).toHaveValue('EUR');
  });

});