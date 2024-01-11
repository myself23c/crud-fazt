import playwright from 'playwright';
import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storageStatePath = path.join(__dirname, 'storageStateReddit.json')

//////////////////// Función para capturar URLs /////////////////////
export async function saveUrlsToFile(URL_PAGE = "https://www.reddit.com/r/LegalTeens/", NUMBER_SCROLLS = 20, TIME_BETWEEN_SCROLL = 3000) {
    const isUser = URL_PAGE.includes("user");
    console.log(`Es un usuario de reddit?: ${isUser}`);

    const URL_TOP = URL_PAGE + "top/?t=all";
    const URL_TOP_YEAR = URL_PAGE + "top/?t=year";

    const browser = await playwright.chromium.launch({
        //headless: false,
        logger: {
            isEnabled: (name, severity) => name === 'browser',
            log: (name, severity, message, args) => console.log(`${name} ${message}`)
        }
    });

    const storageState = JSON.parse(fs.readFileSync(storageStatePath).toString());
    const context = await browser.newContext({ storageState: storageState });

    let capturedImageUrls = [];
    const page = await context.newPage();
    await page.route('**/*', async (route) => {
        const resourceType = route.request().resourceType();
        const url = route.request().url();

        if (resourceType === 'image' || resourceType === 'font') {
            capturedImageUrls.push(url);
            await route.abort();
        } else {
            await route.continue();
        }
    });

    await page.goto(URL_PAGE);
    await page.addStyleTag({ content: 'div, img, video { max-height: 15px !important; }' });

    let alreadyOnTopPage = false;
    let alreadyOnTopYearPage = false;
    let imageUrls = [];

    try {
        for (let i = 0; i < NUMBER_SCROLLS; i++) {
  /// si es usuario true se hara este bloque de usuario 

  if (i > NUMBER_SCROLLS * 0.4 && !alreadyOnTopYearPage && isUser) {
    console.log("Me estoy redirigiendo a la página ordenado por mas controversiales");
    await page.goto(URL_PAGE + "?sort=hot");
    await page.addStyleTag({ content: 'div, img, video { max-height: 15px !important; }' });
    alreadyOnTopYearPage = true; // marca que ya te has redirigido a la pagina top del año
  }

  if(i > NUMBER_SCROLLS * 0.8 && !alreadyOnTopPage && isUser){console.log("Usuario es igual a true me redirijo a top de todos los tiempos")
  await page.goto(URL_PAGE + "?sort=top");
  await page.addStyleTag({ content: 'div, img, video { max-height: 15px !important; }' });
  alreadyOnTopPage = true;
}

if (i > NUMBER_SCROLLS * 0.9 && !alreadyOnTopYearPage && isUser) {
  console.log("Me estoy redirigiendo a la página top del año");
  await page.goto(URL_PAGE + "?sort=top&t=year");
  await page.addStyleTag({ content: 'div, img, video { max-height: 15px !important; }' });
  alreadyOnTopYearPage = true; // marca que ya te has redirigido a la página Top del año
}

if (i > NUMBER_SCROLLS * 0.7 && !alreadyOnTopYearPage && isUser) {
  console.log("Me estoy redirigiendo a la página top del mes");
  await page.goto(URL_PAGE + "?sort=top&t=month");
  await page.addStyleTag({ content: 'div, img, video { max-height: 15px !important; }' });
  alreadyOnTopYearPage = true; // marca que que ta te has redirigido a  a top del mes
}



//termina bloque de usuario



  // bloque de subreddit
  if (i > NUMBER_SCROLLS * 0.8 && !alreadyOnTopPage && !isUser) {
    console.log("Me estoy redirigiendo a top de todos los tiempos");
    await page.goto(URL_TOP);
    await page.addStyleTag({ content: 'div, img, video { max-height: 15px !important; }' });
    alreadyOnTopPage = true; // marca que ya te has redirigido a la página de Top
  }

  if (i > NUMBER_SCROLLS * 0.9 && !alreadyOnTopYearPage && !isUser) {
    console.log("Me estoy redirigiendo a la página top del año");
    await page.goto(URL_TOP_YEAR);
    await page.addStyleTag({ content: 'div, img, video { max-height: 15px !important; }' });
    alreadyOnTopYearPage = true; // marcca que ya te has redirigido a la página Top del año
  }

  if (i > NUMBER_SCROLLS * 0.7 && !alreadyOnTopYearPage && !isUser) {
    console.log("Me estoy redirigiendo a la página top del mes");
    await page.goto(URL_PAGE + "top/?t=month");
    await page.addStyleTag({ content: 'div, img, video { max-height: 15px !important; }' });
    alreadyOnTopYearPage = true; // Marca que ya te has redirigido a la página Top del año
  }

  if (i > NUMBER_SCROLLS * 0.5 && !alreadyOnTopYearPage && !isUser) {
    console.log("Me estoy redirigiendo a la página ordenado por mas controversiales");
    await page.goto(URL_PAGE + "new/");
    await page.addStyleTag({ content: 'div, img, video { max-height: 15px !important; }' });
    alreadyOnTopYearPage = true; // arca que ya te has redirigido a la página Top del año
  }

  //termina bloque de subreddit

            const newImageUrls = await page.$$eval('img', (images) =>
                images.map((image) => image.src)
            );
            imageUrls = [...new Set([...imageUrls, ...newImageUrls])];

            await page.evaluate(() => {
                window.scrollBy(0, 500);
            });

            console.log(`>>> esta es la scrolleada numero ${i}`);
            await new Promise((resolve) => setTimeout(resolve, TIME_BETWEEN_SCROLL));
        }

        await browser.close();
        console.log("Test terminado");
    } catch (error) {
        console.log(error, "hubo un error en capturado");
    }

    const urls = [...new Set([...imageUrls, ...capturedImageUrls])];
    console.log(">>>terminando de capturar imagenes");
    console.log(urls);
    return urls;
}

//////////////////// Función para procesar nuevas URLs capturadas /////////////////////
export async function nuevosCapturados(arrUrls) {
    const urls = await arrUrls.map(u => u.split("?", 1)[0]);
    const urlsFinales = await urls.map(u => {
        if (!u.includes("image_widget")) {
            let ulfinal = u.split("/").reverse().shift();
            return `https://i.redd.it/${ulfinal}`;
        }
        return u; // Si no cumple la condición, retornar la URL original
    });
    console.log('¡URLs transformadas con éxito!');
    
    return urlsFinales;
}

//////////////////// Función para descargar imágenes /////////////////////
export async function descargador(urlsParseadas, archiveName) {
    const urls = urlsParseadas;
    const downloadFolder = path.join(__dirname, archiveName);
    await fse.ensureDir(downloadFolder);

    const browser = await playwright.chromium.launch({
        //headless: false,
        args: [
            '--window-size=1366,768',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
        ]
    });

    const context = await browser.newContext({
        acceptDownloads: true,
        downloadsPath: downloadFolder
    });

    const page = await context.newPage();
    let imageIndex = 0;

    page.on('download', async (download) => {
        console.log("Evento de descarga detectado.");
        
        // comprobar si la descarga ha fallado
        if (await download.failure()) {
            console.error(`descarga fallida con nombre: ${await download.failure()}`);
            return;
        }
        
        const downloadPath = path.join(downloadFolder, `image-${imageIndex}.jpg`);
        
        try {
            await download.saveAs(downloadPath);
            imageIndex++;
        } catch (error) {
            console.error(`Error al guardar la descarga: ${error.message}`);
        }
    });

    let contador = 0;
    for (let url of urls) {
        try {
            console.log(`Navegando a ${url}`);
            await page.goto(url, { waitUntil: 'load' });
            
            console.log('Ejecutando el script en la página.');
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

            await new Promise((resolve) => setTimeout(resolve, 3000));
            console.log(`>>> Se ha descargado la imagen número ${contador}`);
            contador++;

        } catch (e) {
            console.log(e);
        }
    }

    await browser.close();
}

//////////////////// Función principal /////////////////////

/*
async function app() {
    const urlsCapturadas = await saveUrlsToFile();
    const urlsParseadas = await nuevosCapturados(urlsCapturadas);
    await descargador(urlsParseadas, 'nombre_del_archivo');
}

app();
*/