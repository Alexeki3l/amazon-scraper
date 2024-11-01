import { chromium } from 'playwright';
import { recursivaAux, screenshot, scrollBeginToEnd } from './utils';
import { ProductShein } from 'src/product/entities/product-shein.entity';
import {
  CategoryDataDto,
  ResultsDto,
  SubCategoryDataDto,
} from './dto/category-data.dto';
import { CreateProductSheinDto } from 'src/product/dto/shein/create-shein-product.dto';

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
          best_selling: false,
          category: '',
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

export async function searchProductsAmazonByUrl(url: string) {
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

export async function searchProductsByBestSelling() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  page.setDefaultTimeout(5 * 60 * 1000);
  const url = `${process.env.URL_BEST_SELLING}&language=es_US`;
  await page.goto(`${url}`);
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
    return error;
  }
}

export async function superOfferShein() {
  const browser = await chromium.launch();

  const context = await browser.newContext();

  const page = await context.newPage();

  await page.goto(
    'https://es.shein.com/super-deals?src_module=All&src_identifier=on%3DSUPER_DEALS_COMPONENT%60cn%3Dsuperdeals%60hz%3D0%60ps%3D6_1%60jc%3DthriftyFind_0&src_tab_page_id=page_home1729863230299&ici=CCCSN%3DAll_ON%3DSUPER_DEALS_COMPONENT_OI%3D43843797_CN%3DSUPER_DEALS_TI%3D50000_aod%3D0_PS%3D6-1_ABT%3D0&adp=44634093%2C40972662%2C28160976%2C40121051%2C41433568&flash_adp=25681679&pagefrom=page_home&eventTimestamp=1729863317285&isEarlyRequest0924=1&node_id=110000033',
  );

  const selectorCategories = "section[role='treeitem']";

  const selectorPages = '.sui-pagination__inner .sui-pagination__hover';

  const selectorSubCategories = `${selectorCategories} section[role='option']`;

  const categories = await page.locator(selectorCategories).all();

  const subCategories = await page.locator(selectorSubCategories).all();

  const results: ResultsDto[] = [];

  const allProducts: CreateProductSheinDto[] = [];

  const categoryDataList: CategoryDataDto[] = [];

  for (let index = 0; index < categories.length; index++) {
    const category = categories[index];

    await category.click();

    await page.waitForTimeout(2 * 1000);

    // let categoryDataDto: CategoryDataDto;

    const subCategoryDataList: SubCategoryDataDto[] = [];

    for (let i = 0; i < subCategories.length; i++) {
      let subCategory;
      try {
        subCategory = subCategories[i];

        await page.waitForTimeout(2 * 1000);

        await subCategory.click();

        await page.waitForLoadState();

        await scrollBeginToEnd(page);

        await page.waitForTimeout(2 * 1000);

        await page.waitForSelector("section[role='listitem']");
      } catch (error) {
        continue;
      }

      const productsCard = page.locator("section[role='listitem'] a");

      /** Obtener los productos */
      const products: CreateProductSheinDto[] = [];

      for (let idx = 0; idx < (await productsCard.count()); idx += 2) {
        const tag_a = productsCard.nth(idx);

        const data_img: string[] = [];

        const imgs = await tag_a.locator('img').all();

        for (let i = 0; i < imgs.length; i++) {
          const element = imgs[i];

          const src = await element.getAttribute('src');

          if (src) data_img.push(src);
        }

        const new_product_data: CreateProductSheinDto = {
          url: String(await tag_a.getAttribute('href')),
          name: String(await tag_a.getAttribute('data-title')),
          price: String(await tag_a.getAttribute('data-price')),
          us_price: String(await tag_a.getAttribute('data-us-price')),
          us_origin_price: String(
            (await tag_a.getAttribute('data-us-origin-price')) || '',
          ),
          category: `${await category.textContent()} => ${(await subCategory.textContent()) || ''}`,
          imgs: data_img,
          discount: String(await tag_a.getAttribute('data-discount')),
        };
        console.log(new_product_data);

        products.push(new_product_data);
      }
      /** Fin Obtener los productos */
      const subCategoryData: SubCategoryDataDto = {
        name: String(await subCategory.textContent()),
        products,
      };

      allProducts.push(...products);
      subCategoryDataList.push(subCategoryData);
    }

    const categoryDataDto: CategoryDataDto = {
      name: String(await category.textContent()),
      subCategories: subCategoryDataList,
    };

    categoryDataList.push(categoryDataDto);
  }

  results.push({ categories: categoryDataList });

  const resulysData = {
    data: JSON.stringify(results, null, 2),
    prodycts: allProducts,
  };

  return resulysData;
}
