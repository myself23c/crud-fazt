// fileRoutes.js
// fileRoutes.js
import { Router } from 'express';
import { upload, getFiles, getFile, deleteFile } from '../controllers/upload.controllers.js';

const router = Router();

// Usa 'upload.single' para manejar la subida de un solo archivo
router.post('/upload', upload.single('file'), (req, res) => {
    // Aquí puedes añadir tu lógica después de que se haya subido el archivo
    res.send('Archivo subido con éxito');
});

router.get('/files', getFiles);
router.get('/files/:name', getFile);
router.delete('/files/:name', deleteFile);

export default router;

