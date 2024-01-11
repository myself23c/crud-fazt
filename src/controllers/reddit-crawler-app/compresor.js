
/*
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';







const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export async function compresor (archiveName = "archivoreciencreado"){


    console.log(">>>>>>> Estoy comprimiendo esperate")
    const downloadFolder = path.join(__dirname, 'imagenes_descargadas');
    await fs.ensureDir(downloadFolder);



//const output = fs.createWriteStream(`${__dirname}, ../zip_archivadas/imagenesTwitter.zip`);

const outputPath = path.join((__dirname, `../zip_archivadas/${archiveName}`))
const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', {
  zlib: { level: 9 },
});

archive.pipe(output);
archive.directory(downloadFolder, false);
await archive.finalize();

console.log('Archivo ZIP creado con éxito');


}

compresor()
*/

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function compresor (archiveName) {
    try {
        if (!archiveName) {
            console.error("el nombre del archivo ZIP es obligatorio prro");
            return;
        }
        
        console.log(`>>>>>>> Estoy comprimiendo, esperate.>>comprimiendo en zip la carpeta -> ${archiveName}`);
        const downloadFolder = path.join(__dirname, archiveName);
        await fs.ensureDir(downloadFolder);
        
        const outputFilePath = path.join(__dirname, `../../files/uploads/${archiveName}.zip`);
        const output = fs.createWriteStream(outputFilePath);
        
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });
        
        archive.pipe(output);
        archive.directory(downloadFolder, false);
        await archive.finalize();
        
        console.log(`>>>archivo ZIP creado con éxito con nombre -> ${archiveName}. Se eliminaran proximamente las imagenes y carpeta de las imagenes`);
    } catch (error) {
        console.error('Ha ocurrido un error:', error);
    }
}



