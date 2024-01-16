import {Router} from 'express';
import multer from 'multer';
import handleRange from '../middlewares/handleRange.js';
import { downloadAndUploadSong } from "../controllers/youtubeDownloader.controllers.js";
import { connectMongo, getBuckets } from '../db-local.js';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
let musicBucket;



// Conectar a MongoDB y luego reasigna los buckets a las nuevas variables luego de haberse conectado
connectMongo().then(() => {
    const { musicBucketNew } = getBuckets();
    musicBucket = musicBucketNew;
    console.log("se esta accediendo correctamente a los buckets de música desde la ruta de música")
}).catch(err => {
    console.error('Error al iniciar MongoDB:', err);
});

router.post('/music-db-streaming/upload/music', upload.single('music'), async (req, res) => {
    try {
        await connectMongo();
        const uploadStream = musicBucket.openUploadStream(req.file.originalname);
        uploadStream.end(req.file.buffer);
        res.status(200).send('Música guardada con éxito');
    } catch (error) {
        console.error('Error al subir música:', error);
        res.status(500).send('Error al subir música');
    }
});

router.post('/music-db-streaming/upload-from-youtube/music', upload.none(), async (req, res) => {
    try {
        const { url, nombre } = req.body;
        console.log(url, nombre);
        downloadAndUploadSong(url);
        res.status(200).send('Música guardada con éxito desde youtube');
    } catch (e) {
        console.log("error al tratar de subir archivo desde youtube", e);
    }
});

router.get('/music-db-streaming/files/music', async (req, res) => {
    try {
        if (!musicBucket) {
            throw new Error('Bucket de música no está disponible');
        }
        
        const files = [];
        await musicBucket.find().forEach(file => files.push({ filename: file.filename, id: file._id }));

        res.json(files);
    } catch (err) {
        console.error('Error al obtener la música:', err);
        res.status(500).send('Error al obtener la lista de música');
    }
});

router.delete('/music-db-streaming/delete/music/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const file = await musicBucket.find({ filename: filename }).next();
        if (!file) {
            return res.status(404).send('Archivo no encontrado');
        }

        await musicBucket.delete(file._id);
        res.status(200).send('Archivo eliminado con éxito');
    } catch (err) {
        console.error('Error al eliminar el archivo:', err);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/music-db-streaming/download/music/:filename', async (req, res) => {
    try {
        if (!musicBucket) {
            throw new Error('Bucket de música no está disponible');
        }
        const filename = req.params.filename;

        const file = await musicBucket.find({ filename }).next();
        if (!file) {
            return res.status(404).send('Archivo no encontrado');
        }

        const { start, end } = handleRange(req, file, res);

        const downloadStream = musicBucket.openDownloadStreamByName(filename, { start, end });
        downloadStream.pipe(res);
    } catch (err) {
        console.error('Error al descargar la música:', err);
        res.status(500).send('Error al descargar la música');
    }
});

router.get('/music-db-streaming/download-direct/music/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const file = await musicBucket.find({ filename: filename }).next();
        if (!file) {
            return res.status(404).send('Archivo no encontrado');
        }

        res.header('Content-Disposition', 'attachment; filename="' + filename + '"');
        const downloadStream = musicBucket.openDownloadStreamByName(filename);
        downloadStream.pipe(res);
    } catch (err) {
        console.error('Error al descargar la música:', err);
        res.status(500).send('Error interno del servidor');
    }
});

export default router;
