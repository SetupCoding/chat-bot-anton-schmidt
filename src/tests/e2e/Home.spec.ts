import { expect, Page, test } from '@playwright/test';
import { PUT_API_URL } from '../../services';

const addLatency = async (ms: number): Promise<void> => {
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve('');
    }, ms);
  });
  await promise;
};

const interceptPUTRequestAndServeMockResponse = (
  page: Page,
  hasLatency?: boolean,
  isError?: boolean
) =>
  page.route(PUT_API_URL, async (route) => {
    if (hasLatency) {
      await addLatency(1000);
    }
    if (isError) {
      await route.abort();
    } else {
      await route.fulfill({
        status: 200,
      });
    }
  });

const routeToHomePage = async (page: Page): Promise<any> => {
  const [response] = await Promise.all([
    interceptPUTRequestAndServeMockResponse(page, true),
    page.goto('/', { waitUntil: 'networkidle' }),
  ]);
  return response;
};

test('should navigate to the Home page', async ({ page }) => {
  await routeToHomePage(page);
  await expect(page.locator('h1')).toContainText('Versicherungs-Helfer');
});

test('should display next step when button is clicked', async ({ page }) => {
  const getSecondHeading = () => page.locator('text=Benötigen Sie eine Kasko?');
  const getSecondButtonOne = () =>
    page.locator('[aria-label="Benötigen Sie eine Kasko\\?"] >> text=Ja');
  const getSecondButtonTwo = () =>
    page.locator('[aria-label="Benötigen Sie eine Kasko\\?"] >> text=Nein');

  await routeToHomePage(page);

  await expect(
    page.locator('text=Benötigen Sie eine Haftplichtversicherung?')
  ).toHaveCount(1);

  await expect(getSecondHeading()).toHaveCount(0);
  await expect(getSecondButtonOne()).toHaveCount(0);
  await expect(getSecondButtonTwo()).toHaveCount(0);

  await page.locator('text=Ja').click();

  await expect(getSecondHeading()).toHaveCount(1);
  await expect(getSecondButtonOne()).toHaveCount(1);
  await expect(getSecondButtonTwo()).toHaveCount(1);
});

test('should disable all buttons and display loading indicator and success message on submit', async ({
  page,
}) => {
  await routeToHomePage(page);

  await page.locator('text=Nein').click();
  await expect(page.locator('text=Benötigen Sie eine Kasko?')).toHaveCount(1);

  await page
    .locator('[aria-label="Benötigen Sie eine Kasko\\?"] >> text=Nein')
    .click();

  await expect(
    page.locator('text=Welche Kennzeichenart benötigen Sie?')
  ).toHaveCount(1);

  await page.locator('text=Einzelkennzeichen').click();

  await expect(page.locator('text=Sende Daten...')).toHaveCount(1);
  await expect(
    page.locator('text=Herzlichen Dank für Ihre Angaben!')
  ).toHaveCount(1);

  const allButtons = await page.locator('button');
  const count = await allButtons.count();
  for (let i = 0; i < count; i++) {
    await expect(allButtons.nth(i)).toHaveAttribute('disabled', '');
  }
});

test('should display error message if PUT request was unsuccessful and retry successfully with button click', async ({
  page,
}) => {
  await Promise.all([
    // will result in an error upon PUT
    interceptPUTRequestAndServeMockResponse(page, true, true),
    page.goto('/', { waitUntil: 'networkidle' }),
  ]);

  await page.locator('text=Nein').click();
  await expect(page.locator('text=Benötigen Sie eine Kasko?')).toHaveCount(1);

  await page
    .locator('[aria-label="Benötigen Sie eine Kasko\\?"] >> text=Nein')
    .click();

  await expect(
    page.locator('text=Welche Kennzeichenart benötigen Sie?')
  ).toHaveCount(1);

  await page.locator('text=Einzelkennzeichen').click();

  await expect(page.locator('text=Sende Daten...')).toHaveCount(1);

  await expect(page.locator('text=Ein Fehler ist aufgetreten.')).toHaveCount(1);

  const retryButton = page.locator('text=Erneut absenden');
  await expect(retryButton).toHaveCount(1);

  await Promise.all([
    // will result in a success upon PUT
    interceptPUTRequestAndServeMockResponse(page, true),
    retryButton.click(),
  ]);

  await expect(page.locator('text=Sende Daten...')).toHaveCount(1);

  await expect(
    page.locator('text=Herzlichen Dank für Ihre Angaben!')
  ).toHaveCount(1);
});

test('should remove visible steps when changing a previous value', async ({
  page,
}) => {
  const getButtonOneQuestionTwo = () =>
    page.locator('[aria-label="Benötigen Sie eine Kasko\\?"] >> text=Ja');
  const getButtonTwoQuestionTwo = () =>
    page.locator('[aria-label="Benötigen Sie eine Kasko\\?"] >> text=Nein');

  const getQuestionThree = () =>
    page.locator('text=Welche Art von Kasko benötigen Sie?');

  await routeToHomePage(page);

  await page
    .locator(
      '[aria-label="Benötigen Sie eine Haftplichtversicherung\\?"] >> text=Ja'
    )
    .click();
  await getButtonOneQuestionTwo().click();

  await expect(getButtonOneQuestionTwo()).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  await expect(getButtonTwoQuestionTwo()).toHaveAttribute(
    'aria-pressed',
    'false'
  );

  await expect(getQuestionThree()).toHaveCount(1);
  await expect(page.locator('text=Vollkasko')).toHaveCount(1);
  await expect(page.locator('text=Teilkasko')).toHaveCount(1);

  // change selected option on first question
  await page
    .locator(
      '[aria-label="Benötigen Sie eine Haftplichtversicherung\\?"] >> text=Nein'
    )
    .click();

  await expect(getQuestionThree()).toHaveCount(0);
  await expect(page.locator('text=Vollkasko')).toHaveCount(0);
  await expect(page.locator('text=Teilkasko')).toHaveCount(0);

  await expect(getButtonOneQuestionTwo()).toHaveAttribute(
    'aria-pressed',
    'false'
  );
  await expect(getButtonTwoQuestionTwo()).toHaveAttribute(
    'aria-pressed',
    'false'
  );

  await expect(
    page.locator('text=Welche Kennzeichenart benötigen Sie?')
  ).toHaveCount(0);

  // change selected option on second question
  await getButtonTwoQuestionTwo().click();

  await expect(
    page.locator('text=Welche Kennzeichenart benötigen Sie?')
  ).toHaveCount(1);
});
