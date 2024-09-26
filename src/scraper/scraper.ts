import { chromium } from 'playwright';
// import { CreateProductDto } from 'src/product/dto/create-product.dto';

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

    page.setDefaultTimeout(60 * 1000); // Tiempo de espera predeterminado de 60 segundos para operaciones.

    await page.goto(`https://www.amazon.com/s?k=${name}`);

    await page.waitForTimeout(5000);

    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    const products = await page.locator('.s-card-container > .a-section').all();
    await page.screenshot({
      path: `captura-completa-${Date.now()}.png`,
      fullPage: true,
    });

    console.log(products);
    const allProducts: any[] = [];

    for (let index = 0; index < products.length; index++) {
      const element = products[index];
      try {
        const context = {
          name: (
            await element.locator('span.a-text-normal').first().textContent()
          ).trim(),
          price: await element.locator('span.a-offscreen').nth(1).textContent(),
          img: await element.locator('.s-image').getAttribute('src'),
          rating: await element.locator('span.a-icon-alt').textContent(),
          url: await element
            .locator('a.a-link-normal')
            .first()
            .getAttribute('href'),
        };
        allProducts.push(context);
      } catch (error) {
        continue;
      }
    }
    await browser.close();
    return allProducts;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function searchProductsByUrl(url: string) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  if (!url.includes('www.amazon')) {
    url = `www.amazon.com/${url}`;
  }
  await page.goto(`${url}`);

  await page.waitForTimeout(5000);

  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  try {
    const context = {
      name: await page.locator('#title').first().textContent(),
      price: await page.locator('span.a-offscreen').nth(1).textContent(),
      img: await page
        .locator('.a-section.a-spacing-mini img')
        .nth(1)
        .getAttribute('src'),
      rating: await page.locator('#acrPopover').first().getAttribute('title'),
      url,
    };
    await browser.close();
    return context;
  } catch (error) {
    // console.log(error);
    return null;
  }
}
