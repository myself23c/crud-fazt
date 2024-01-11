
/*
const { chromium } = require('playwright');

(async () => {
  // Iniciar el navegador y abrir una nueva página
  const browser = await chromium.launch({
    headless: false
  });
  const page = await browser.newPage();

  // Ir a la página web
  await page.goto('https://waifubitches.com/'); // Reemplaza 'https://example.com' con la URL de la página web que quieres escanear

  let imageUrls = [];

  // Realizar scroll 5 veces y capturar URLs de imágenes
  for (let i = 0; i < 5; i++) {
    // Capturar las URLs de imágenes y almacenarlas en imageUrls
    const newImageUrls = await page.$$eval('img', (images) =>
      images.map((image) => image.src)
    );
    imageUrls = [...new Set([...imageUrls, ...newImageUrls])];

    // Hacer scroll hacia abajo
    await page.evaluate(() => {
      window.scrollBy(0, 3000);
    });

    // Esperar un poco antes del próximo scroll
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  // Cerrar el navegador
  await browser.close();

  // Mostrar las URLs de las imágenes en la consola
  console.log('Image URLs:', imageUrls);
})();

*/





/*


const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs-extra');

async function descargador(urlsYaParseadas) {
  const downloadFolder = path.join(__dirname, 'imagenes_descargadas');
  await fs.ensureDir(downloadFolder);

  const browser = await chromium.launch({
    headless: false
  });

  const storageState = JSON.parse(fs.readFileSync('storageState.json').toString());
  const context = await browser.newContext({
    storageState: storageState,
    acceptDownloads: true
  });

  const page = await context.newPage();
  let imageIndex = 0; // Índice para cada imagen en una URL

  // Escuchar el evento de descarga y asignar un nombre único a cada archivo descargado
  page.on('download', async (download) => {
    const downloadPath = path.join(downloadFolder, `image-${imageIndex}.jpg`);
    await download.saveAs(downloadPath);
    imageIndex++;
  });

  let urlIndex = 0; // Índice para cada URL
  for (let url of urlsYaParseadas) {
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

    await page.waitForTimeout(3000);
    console.log(`>>> Se está descargando la imagen número ${urlIndex}`);
    urlIndex++;
  }

  await browser.close();
}


*/


/*

descargador([ 'https://pbs.twimg.com/media/F8Ps2ZebsAA2qQJ?format=jpg&name=large',
'https://pbs.twimg.com/media/F69rAcxXQAAVIAG?format=jpg&name=large',
'https://pbs.twimg.com/media/F6VgYB6WMAA8887?format=jpg&name=large',
'https://pbs.twimg.com/media/F6UlcBzXcAA1dx-?format=jpg&name=large',
'https://pbs.twimg.com/media/F5xn7-QXkAA7ne8?format=jpg&name=large',
'https://pbs.twimg.com/media/F5IHvY2WYAAWLj3?format=jpg&name=large',]);
*/
import fsExtra from 'fs-extra';


//import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function deleteFiles(archiveName) {

  /*
  // Eliminar todo lo que se encuentre en la carpeta ./downloaded_images
  const directory = path.join(__dirname, archiveName);
  
  fs.readdir(directory, (err, files) => {
    if (err) throw err;
  
    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });

*/

  
  const dirPath = path.join(__dirname, archiveName);
  
  fsExtra.remove(dirPath, err => {
    if (err) return console.error(err);
    console.log('>>>!Carpeta eliminada!<<<');
  });

  
  console.log(`se han eliminado todas las imagenes y la carpeta ${archiveName}`)
  /*
  // Eliminar el archivo ./imagenes.zip
  const zipFile = path.join(__dirname, 'imagenesTwitter.zip');
  
  fs.unlink(zipFile, (err) => {
    if (err) throw err;
    console.log(`Deleted ${zipFile}`);
  });

  */
}




// Ejecuta la función





