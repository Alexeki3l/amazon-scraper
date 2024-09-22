import { chromium } from 'playwright';

export async function scrapeProducts(url: string) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(url);

  const productTitles = await page.$$eval('.product-title', (titles) =>
    titles.map((title) => title.textContent),
  );

  await browser.close();
  return productTitles;
}

export async function searchProductsByName(name: string) {
  try {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`https://www.amazon.com/s?k=${name}`);

    await page.waitForTimeout(1000);

    const waitForElement = page.locator('.s-result-item').first();
    await waitForElement.waitFor();

    const products = await page.locator('.s-result-item').all();

    const allProducts: ResultGeneral[] = [];

    products.forEach(async (product) => {
      const context = {
        name: await product.locator('span.a-text-normal').textContent(),
        img: await product.locator('.s-image').getAttribute('src'),
        price: await product.locator('span.a-offscreen').textContent(),
      };
      allProducts.push(context);
    });

    await browser.close();
    return allProducts;
  } catch (error) {
    return error;
  }
}
