// fileRoutes.js
// fileRoutes.js
import { Router } from 'express';
import { getFiles, getFile, deleteFile } from '../controllers/crawlerDB.controllers.js';

const router = Router();
/*
// Usa 'upload.single' para manejar la subida de un solo archivo
router.post('/', upload.single('file'), (req, res) => {
    // Aquí puedes añadir tu lógica después de que se haya subido el archivo
    res.send('Archivo subido con éxito');
});
*/

router.get('/crawlerDB', getFiles);
router.get('/crawlerDB/:name', getFile);
router.delete('/crawlerDB/:name', deleteFile);

export default router;

