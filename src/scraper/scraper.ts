import { chromium, Locator, Page } from 'playwright';
import { CreateProductOmitIdDto } from 'src/product/dto/create-product.dto';
import { recursivaAux, screenshot } from './utils';

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

export async function changeUbication(ubication: string) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    recordVideo: { dir: './screenshot' },
  });
  const page = await context.newPage();
  page.setDefaultTimeout(60 * 1000);
  console.log(`SCRAPER: ${ubication}`);

  let error;
  const url = `${process.env.URL_BEST_SELLING}&language=es_US`;

  await page.goto(`${url}`);

  await page.waitForTimeout(5000);
  await screenshot(page);

  await page.locator('#nav-global-location-popover-link').click();
  await screenshot(page);

  await page.waitForLoadState();

  const inputUbication = page.locator('#GLUXZipUpdateInput');
  await inputUbication.click();
  await inputUbication.fill(ubication);
  await screenshot(page);

  const errorElement = page.locator(
    "//div[contains(text(), 'Introduce un código postal válido')]",
  );

  await page.waitForSelector(
    "//input[contains(@class, 'a-button-input') and following-sibling::span[text() = 'Aplicar']]",
  );

  await page
    .locator(
      "//input[contains(@class, 'a-button-input') and following-sibling::span[text() = 'Aplicar']]",
    )
    .click();
  await page.waitForTimeout(1000);
  await screenshot(page);
  if (await errorElement.isVisible()) {
    console.log('codigo postal no existe');
    return { error: 'El codigo postal no existe' };
  }

  const buttonDone = page.locator("//button[text() = 'Continuar']").last();
  if (await buttonDone.isVisible()) {
    await buttonDone.click();
  } else {
    const buttonClose = page.locator("//button[@name='glowDoneButton']");
    if (!(await buttonClose.isVisible())) {
      await buttonClose.click();
    } else {
      await page.locator("//input[@id='GLUXConfirmClose']").click();
    }
  }

  await page.reload();
  await screenshot(page);
  if (error) {
    console.log('lanzar error');
    return error;
  }

  console.log('OK');
  await context.close();
  await browser.close();
}

/*export async function searchProductsByBestSelling() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // page.setDefaultTimeout(15 * 60 * 1000);
  const url = `${process.env.URL_BEST_SELLING}&language=es_US`;
  await page.goto(`${url}`);

  try {
    if (
      !(await page
        .locator("[role='treeitem'] > a")
        .first()
        .isVisible({ timeout: 2 * 1000 })) //esperar 2segundos para verificar si existe ese elemento
    ) {
      page.reload; //si no existe recargamos la pagina
      await page.waitForLoadState(); //esperamos que cargue la pagina
    }
    await page.waitForTimeout(3000);
    await screenshot(page);
    const categoryElementsList = await page
      .locator("[role='treeitem'] > a")
      .all();
    console.log(categoryElementsList);
    const allProductBestSellingList: Array<CreateProductOmitIdDto> = [];

    for (let index = 0; index < categoryElementsList.length; index++) {
      const categ = categoryElementsList[index];
      const categoryName = await categ.textContent();
      await categ.click();
      await page.waitForLoadState();
      await screenshot(page);
      const productsAll = await page.locator('#gridItemRoot').all();

      console.log(productsAll);
      for (let index = 0; index < productsAll.length; index++) {
        const element = productsAll[index];
        console.log(element);
        const name: string = `${await element.locator('a.a-link-normal').nth(1).textContent()}`;
        const price: string = `${await element
          .locator('a.a-link-normal.a-text-normal')
          .textContent()}`;
        const img: string = `${await element.locator('img').getAttribute('src')}`;
        const rating: string = `${await element.locator('a.a-link-normal').nth(2).textContent()}`;
        const url: string = `${await element
          .locator('a.a-link-normal')
          .nth(0)
          .getAttribute('href')}`;

        const context: CreateProductOmitIdDto = {
          name,
          price,
          img,
          rating,
          url,
          best_selling: true,
          category: categoryName,
        };
        allProductBestSellingList.push(context);
        console.log('Add in the list');
      }
      break;
    }
    await browser.close();
    return allProductBestSellingList;
  } catch (error) {
    console.log(error);
    await screenshot(page);
    return error;
  }
}
*/
export async function searchProductsByBestSelling() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  page.setDefaultTimeout(5 * 60 * 1000);
  const url = `${process.env.URL_BEST_SELLING}&language=es_US`;
  await page.goto(`${url}`);
  // await screenshot(page);
  try {
    if (
      !(await page.locator("[role='treeitem'] ").all()).length //esperar 2segundos para verificar si existe ese elemento
    ) {
      page.reload; //si no existe recargamos la pagina
      await page.waitForLoadState(); //esperamos que cargue la pagina
    }
    const arrayProducts = [];
    const arrayURLs = [];
    const arrayURLsVisited = [];

    arrayProducts.push(
      ...(await recursivaAux(page, arrayURLs, arrayURLsVisited, arrayProducts)),
    );

    await browser.close();
    return arrayProducts;
  } catch (error) {
    console.log(error);
    return error;
  }
}
