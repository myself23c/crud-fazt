import ytdl from 'ytdl-core';
import ffmpeg from 'ffmpeg-static';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { connectMongo, getBuckets } from '../db-local.js'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cp from 'child_process';
/*

const mongoURI = 'mongodb://127.0.0.1:27017/database';
//const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

let musicBucket;



async function connectMongo() {
    try {
        await client.connect();
        const db = client.db('database');
        videoBucket = new GridFSBucket(db, { bucketName: 'videos' });
        musicBucket = new GridFSBucket(db, { bucketName: 'music' });
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error);
        throw error;
    }
}
*/

let musicBucket,videoBucket;


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



// Conectar a MongoDB y luego reasigna los bucketcks a las nuevas variables luego de haberse conectado
connectMongo().then(() => {
    const { videoBucketNew, musicBucketNew } = getBuckets();
    videoBucket = videoBucketNew;
   musicBucket = musicBucketNew;
    console.log("acceso a la base de datos desde descargador de musica y videos de ytb")
    
}).catch(err => {
    console.error('Error al iniciar MongoDB:', err);
});


const getCleanTitle = async (url) => {
    try {
        const videoInfo = await ytdl.getInfo(url);
        let title = videoInfo.videoDetails.title;

        // Limpiamos el título para que sea un nombre de archivo válido
        title = title.replace(/\s+/g, '-').replace(/\./g, '');
        title = title.replace(/[^a-zA-Z0-9-]/g, '');

        return title;
    } catch (error) {
        console.error('Error al obtener información del video:', error);
        return null;
    }
};



/**
 * Sube un archivo local a MusicBucket en MongoDB.
 * @param {string} filePath - Ruta del archivo a subir.
 */
async function uploadFileToMusicBucket(filePath) {
    try {
        const filename = path.basename(filePath);
        const uploadStream = musicBucket.openUploadStream(filename);

        fs.createReadStream(filePath).pipe(uploadStream)
            .on('error', (error) => {
                throw error;
            })
            .on('finish', () => {
                console.log(`Archivo ${filename} subido a MusicBucket.`);
                // Opcional: Eliminar el archivo local después de subirlo
                fs.unlink(filePath, (err) => {
                    if (err) console.error('Error al eliminar el archivo local:', err);
                    else console.log(`Archivo local ${filename} eliminado.`);
                });
            });
    } catch (error) {
        console.error('Error al subir archivo a MusicBucket:', error);
    }
}



const downloadAndConvert = async (url) => {
    try {
        // [Código existente para descargar y convertir]
        // ...
        const title = await getCleanTitle(url);
        if (!title) {
            throw new Error('No se pudo obtener el título del video');
        }
        const outputPath = `${title}.mp3`;

        const stream = ytdl(url, { quality: 'highestaudio' });
        const ffmpegProcess = cp.spawn(ffmpeg, [
            '-loglevel', '8', '-hide_banner',
            '-i', 'pipe:3', '-vn',
            '-b:a', '320k', // Calidad de audio ajustada a 320k
            '-f', 'mp3',
            outputPath // Usamos el título como nombre de archivo
        ], {
            windowsHide: true,
            stdio: ['inherit', 'inherit', 'inherit', 'pipe']
        });

        stream.pipe(ffmpegProcess.stdio[3]);



        // Cuando la conversión termina
        return new Promise((resolve, reject) => {
            ffmpegProcess.on('close', async () => {
                // Subimos el archivo a MusicBucket y luego lo eliminamos
                await uploadFileToMusicBucket(outputPath);
                resolve(outputPath);
            });

            ffmpegProcess.on('error', (error) => {
                reject(error);
            });
        });
    } catch (error) {
        console.error('Error:', error);
    }
};



const downloadSongOnly = async (url, closeMongoConnection = false) => {
    try {
        const title = await getCleanTitle(url);
        if (!title) {
            throw new Error('No se pudo obtener el título del video');
        }
        const outputPath = path.join(__dirname, `${title}.mp3`);

        console.log('Iniciando la descarga y conversión del video...');

        const stream = ytdl(url, { quality: 'highestaudio' });
        const ffmpegProcess = cp.spawn(ffmpeg, [
            '-loglevel', '8', '-hide_banner',
            '-i', 'pipe:3', '-vn',
            '-b:a', '320k', // Calidad de audio ajustada a 320k
            '-f', 'mp3',
            outputPath // Usamos el título como nombre de archivo
        ], {
            windowsHide: true,
            stdio: ['inherit', 'inherit', 'inherit', 'pipe']
        });

        stream.pipe(ffmpegProcess.stdio[3]);

        return new Promise((resolve, reject) => {
            ffmpegProcess.on('close', () => {
                console.log('Proceso FFMPEG cerrado.');
                if (closeMongoConnection) {
                    client.close(); // Cerrar la conexión a MongoDB
                    console.log('Conexión a MongoDB cerrada.');
                }
                resolve(outputPath);
            });

            ffmpegProcess.on('error', (error) => {
                console.error('Error en el proceso FFMPEG:', error);
                reject(error);
            });

            // Manejar el cierre del stream de ytdl
            stream.on('finish', () => {
                console.log('Stream ytdl finalizado.');
            });

            stream.on('error', (error) => {
                console.error('Error en el stream ytdl:', error);
                reject(error);
            });
        });
    } catch (error) {
        console.error('Error en downloadSongOnly:', error);
        if (closeMongoConnection) {
            client.close(); // Asegurarse de cerrar la conexión incluso si hay un error
        }
    }
};

// Esta función descarga, sube a MongoDB y elimina el archivo local
const downloadAndUploadSong = async (url) => {
    try {
        // Llamamos a downloadSongOnly y esperamos a que finalice
        const outputPath = await downloadSongOnly(url);

        // Ahora subimos el archivo a MusicBucket y lo eliminamos
        await uploadFileToMusicBucket(outputPath);
    } catch (error) {
        console.error('Error:', error);
    }
};

connectMongo().catch(err => console.error('Error al iniciar MongoDB:', err));



//downloadSongOnly('https://youtu.be/xFrGuyw1V8s?si=8KJ6LqPeo0FhG3NH').then(() => console.log('Descarga completada!')).catch(err => console.error(err))
//downloadAndUploadSong('https://youtu.be/EPOIS5taqA8?si=qODfs5kfYpTc7SoH').then(() => console.log('Proceso completo!')).catch(err => console.error(err))
//.finally(() => {client.close(); console.log('Conexión a MongoDB cerrada.');})


export {
    downloadSongOnly,
    downloadAndUploadSong
};