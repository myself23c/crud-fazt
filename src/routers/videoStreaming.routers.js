import { Router } from 'express';
import multer from 'multer';
import handleRange from '../middlewares/handleRange.js';
import { connectMongo, getBuckets } from '../db-local.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = Router();

let videoBucket;




// Conectar a MongoDB y luego reasigna los bucketcks a las nuevas variables luego de haberse conectado
connectMongo().then(() => {
    const { videoBucketNew, musicBucketNew } = getBuckets();
    videoBucket = videoBucketNew;
   // musicBucket = musicBucketNew;
    console.log("se esta accediendo correctamente a los buckets de music desde la ruta de video")
    
}).catch(err => {
    console.error('Error al iniciar MongoDB:', err);
});




router.post('/reproductor-db-videos/upload/video', upload.single('video'), async (req, res) => {
    try {
        await connectMongo();

        // Parsear el nombre del archivo
        let filename = req.file.originalname;
        filename = filename.replace(/[^a-zA-Z0-9 ]/g, '-');

        const uploadStream = videoBucket.openUploadStream(filename);
        uploadStream.end(req.file.buffer);
        res.status(200).send('Video guardado con éxito');
    } catch (error) {
        console.error('Error al subir video:', error);
        res.status(500).send('Error al subir video');
    }
});






router.get('/reproductor-db-videos/files/videos', async (req, res) => {
    
    try {
        if (!videoBucket) {
            throw new Error('Bucket de videos no está disponible');
        }
        
        const files = [];
        await videoBucket.find().forEach(file => files.push({ filename: file.filename, id: file._id }));

        res.json(files);
    } catch (err) {
        console.error('Error al obtener los videos:', err);
        res.status(500).send('Error al obtener la lista de videos');
    }
});



// Ruta modificada para descargar videos
router.get('/reproductor-db-videos/download/video/:filename', async (req, res) => {
    try {
        if (!videoBucket) {
            throw new Error('Bucket de videos no está disponible');
        }
        const filename = req.params.filename;
        
        // Encontrar información del archivo
        const file = await videoBucket.find({ filename }).next();
        if (!file) {
            return res.status(404).send('Archivo no encontrado');
        }

        // Manejar solicitud de rango de bytes
        const { start, end } = handleRange(req, file, res);

        const downloadStream = videoBucket.openDownloadStreamByName(filename, { start, end });
        downloadStream.pipe(res);
    } catch (err) {
        console.error('Error al descargar el video:', err);
        res.status(500).send('Error al descargar el video');
    }
});









router.get('/reproductor-db-videos/download-direct/video/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const file = await videoBucket.find({ filename: filename }).next();
        if (!file) {
            return res.status(404).send('Archivo no encontrado');
        }

        res.header('Content-Disposition', 'attachment; filename="' + filename + '"');
        const downloadStream = videoBucket.openDownloadStreamByName(filename);
        downloadStream.pipe(res);
    } catch (err) {
        console.error('Error al descargar el video:', err);
        res.status(500).send('Error interno del servidor');
    }
});




router.delete('/reproductor-db-videos/delete/video/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const file = await videoBucket.find({ filename: filename }).next();
        if (!file) {
            return res.status(404).send('Archivo no encontrado');
        }

        await videoBucket.delete(file._id);
        res.status(200).send('Archivo eliminado con éxito');
    } catch (err) {
        console.error('Error al eliminar el archivo:', err);
        res.status(500).send('Error interno del servidor');
    }
});

export default router;