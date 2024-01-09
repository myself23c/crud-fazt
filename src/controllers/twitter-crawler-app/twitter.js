import playwright from 'playwright';
import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storageStatePath = path.join(__dirname, 'storageState.json')

export async function saveUrlsToFile(URL_PAGE = "https://twitter.com/elonmusk", NUMBER_SCROLLS = 3, TIME_BETWEEN_SCROLL = 5000) {
    const browser = await playwright.chromium.launch({
        logger: {
            isEnabled: (name, severity) => name === 'browser',
            log: (name, severity, message, args) => console.log(`${name} ${message}`)
        }
    });

    const storageState = JSON.parse(fs.readFileSync(storageStatePath).toString());
    const context = await browser.newContext({ storageState: storageState });
    const page = await context.newPage();

    let capturedImageUrls = [];

    await page.route('**/*', async (route) => {
        const resourceType = route.request().resourceType();
        const url = route.request().url();

        if (resourceType === 'image' || resourceType === 'stylesheet' || resourceType === 'font') {
            capturedImageUrls.push(url);
            await route.abort();
        } else {
            await route.continue();
        }
    });

    await page.goto(URL_PAGE);

    let imageUrls = [];

    try {
        for (let i = 0; i < NUMBER_SCROLLS; i++) {
            const newImageUrls = await page.$$eval('img', (images) => images.map((image) => image.src));
            imageUrls = [...new Set([...imageUrls, ...newImageUrls])];

            await page.evaluate(() => {
                window.scrollBy(0, 8000);
            });

            console.log(`>>> esta es la scrolleada numero ${i}`);
            await new Promise((resolve) => setTimeout(resolve, TIME_BETWEEN_SCROLL));
        }

        await browser.close();
        console.log(">>>>>>Test terminado<<<<<<");
    } catch (error) {
        console.log(error, "!>>>hubo un error en capturado");
    }

    const urls = [...new Set([...imageUrls, ...capturedImageUrls])];
    console.log(">>>>>>>>>>>>terminando de capturar imagenes<<<<<<<<<<<");
    console.log(urls);
    return urls;
}

export async function nuevosCapturados(urlsRaw) {
    let capturados2 = [];

    urlsRaw.forEach(u => {
        if (!u.includes('.jpg') && !u.includes('/card_img/')) {
            let arreglado = u.split("format=").shift() + "format=jpg&name=large"
            capturados2.push(arreglado);
        }
    });
    const capturadosFinal = await capturados2;
    console.log("se estan parseando las urls");
    return capturadosFinal;
}

export async function descargador(urlsYaParseadas, archiveName) {
    const downloadFolder = path.join(__dirname, archiveName);
    await fse.ensureDir(downloadFolder);

    const browser = await playwright.chromium.launch();

    const storageState = JSON.parse(fs.readFileSync(storageStatePath).toString());
    const context = await browser.newContext({
        storageState: storageState,
        acceptDownloads: true,
        route: [
            {
                url: '**/*',
                handler: async (route, request) => {
                    if (request.resourceType() === 'image')
                        route.abort();
                    else
                        route.continue();
                }
            },
        ]
    });

    const page = await context.newPage();
    let imageIndex = 0;

    page.on('download', async (download) => {
        const downloadPath = path.join(downloadFolder, `image-${imageIndex}.jpg`);
        await download.saveAs(downloadPath);
        imageIndex++;
    });

    let urlIndex = 0;
    for (let url of urlsYaParseadas) {
        try {
            await page.goto(url);

            await page.evaluate(() => {
                document.querySelectorAll('img').forEach((img, index) => {
                    const anchor = document.createElement('a');
                    anchor.href = img.src;
                    anchor.download = `image-${index}.jpg`;
                    img.parentElement.replaceChild(anchor, img);
                    anchor.appendChild(img);
                    anchor.click();
                });
            });

            await page.waitForTimeout(1200);
            console.log(`>>> Se está descargando la imagen número ${urlIndex}  del archivo ${archiveName}`);
            urlIndex++;
        } catch (e) {
            console.log(`Hubo un error al intentar descargar la imagen número ${urlIndex} del archivo ${archiveName}`);
            console.log(e);
        }
    }

    await browser.close();
}
