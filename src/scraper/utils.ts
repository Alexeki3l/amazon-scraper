import { Locator, Page } from 'playwright';
import { CreateProductOmitIdDto } from 'src/product/dto/create-product.dto';

/**
 * Suma dos números y retorna el resultado.
 *
 * @param {Page} page - El objeto que contiene la pagina.
 * @param {Array<string>} arrayURLs - El Array de URLs.
 * @param {Array<string>} arrayURLsVisited - El Array de URLs visitadas.
 * @returns {Array<CreateProductOmitIdDto>} Retorna un array de objetos de tipo CreateProductOmitIdDto.
 * @example
 * // Ejemplo de uso.
 * // Los Arrays se pasan por parametros vacios y se llenan en la recursion.
 * const resultado = await recursivaAux(page, arrayURLs, arrayURLsVisited);
 * //console.log(resultado); // Imprime el array de objetos
 */
export async function recursivaAux(
  page: Page,
  arrayURLs: Array<string>,
  arrayURLsVisited: Array<string>,
  arrayProducts: Array<CreateProductOmitIdDto>,
) {
  const cssSelector = "[role='treeitem']";
  const urlBase = 'https://www.amazon.com';
  // Buscar todos los elementos del árbol en la estructura actual
  const allElements = page.locator(`${cssSelector}`);

  // Identificar elementos hijos
  const sonElementsUrl = page.locator(`[role='group'] > ${cssSelector} > a`);
  const sonElementsUrlList = await sonElementsUrl.all();

  const urlFinded = await waitAllAsyncHref(sonElementsUrlList); // Filtra los objetos que tienen 'href'

  // Recargar la página si no se pueden ver los elementos
  if (!(await allElements.first().isVisible())) {
    await page.reload();
    return await recursivaAux(page, arrayURLs, arrayURLsVisited, arrayProducts);
  }

  arrayURLs.push(...urlFinded);
  console.log(arrayURLs);

  for (let index = 0; index < arrayURLs.length; index++) {
    const url = arrayURLs[index];

    if (!arrayURLsVisited.includes(url)) {
      arrayURLsVisited.push(url);
      await page.goto(`${urlBase}${url}`);
      await page.waitForLoadState(); // Esperar a que la página cargue

      const isSon = (
        await waitAllAsyncHref(await sonElementsUrl.all())
      ).includes(url);

      if (isSon) {
        arrayProducts.push(
          ...(await takeProductDataAndAddToArray(page, arrayProducts)),
        );
        console.log('Add Productos a ArrayProducts');
      } else {
        console.log("Entro a 'recursivaAux'");
        await screenshot(page);
        await recursivaAux(page, arrayURLs, arrayURLsVisited, arrayProducts);
      }
    }
  }

  return arrayProducts;
}

async function waitAllAsyncHref(arrayLocator: Array<Locator>) {
  return (
    await Promise.all(
      arrayLocator.map(async (element) => {
        const href = await element.getAttribute('href');
        return href; // Retorna un objeto con el elemento y el atributo 'href'
      }),
    )
  ).filter((href) => href !== null);
}

async function waitAllAsyncText(
  arrayLocator: Array<Locator>,
  arrayLocatorSon: Array<string>,
): Promise<Locator[]> {
  return (
    await Promise.all(
      arrayLocator.map(async (element) => ({
        element, // Guardar el elemento original
        matches: arrayLocatorSon.includes(await element.textContent()), // Comparar con texto asíncrono
      })),
    )
  )
    .filter(({ matches }) => matches) // Filtrar solo los que coinciden
    .map(({ element }) => element); // Devolver solo los elementos originales
}

export async function screenshot(page: Page) {
  await page.screenshot({
    path: `./screenshot/captura-completa-${Date.now()}.png`,
    fullPage: true,
  });
  console.log('save screenshot');
}

async function takeProductDataAndAddToArray(
  page: Page,
  arrayProducts: Array<CreateProductOmitIdDto>,
) {
  const productsAll = await page.locator('#gridItemRoot').all();
  const allElements = await page.locator("[role='treeitem']").all();
  const allElementsSon = await page
    .locator("[role='group'] > [role='treeitem']")
    .allTextContents();
  const categoryName = (
    await waitAllAsyncText(allElements, allElementsSon)
  ).join(' => ');

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
    console.log({ name, price, img, rating, url });
    const context: CreateProductOmitIdDto = {
      name,
      price,
      img,
      rating,
      url,
      best_selling: true,
      category: categoryName,
    };
    arrayProducts.push(context);
  }
  return arrayProducts;
}
