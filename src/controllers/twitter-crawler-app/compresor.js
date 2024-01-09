import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function compresor (archiveName) {
    try {
        if (!archiveName) {
            console.error("El nombre del archivo ZIP es necesario");
            return;
        }
        
        console.log(`>>>>>>> Estoy comprimiendo, esperate ${archiveName}`);
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
        
        console.log(`Archivo ZIP creado con éxito con nombre ${archiveName}`);
    } catch (error) {
        console.error('Ha ocurrido un error:', error);
    }
}





export async function deleteFiles(archiveName) {

    
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
  
  
  
    
    const dirPath = path.join(__dirname, archiveName);
    
    fs.remove(dirPath, err => {
      if (err) return console.error(err);
      console.log('>>>!Carpeta eliminada!<<<');
    });
}