import { Router } from 'express';
import { appReddit} from '../controllers/reddit-crawler-app/appReddit.js';

import createQueueMiddleware from '../middlewares/queueMiddlewere.js';

const router = Router();
// crear instnacia de queue de la middleware para hacer queus unicas
const { queueMiddleware: redditQueueMiddleware } = createQueueMiddleware();


router.post('/reddit-crawler', redditQueueMiddleware, async (req, res) => {
    const { url, nombre, numero } = req.body;
    await appReddit(url, nombre, numero);
    res.status(200).send('Datos recibidos y procesados con éxito');
    //processNext(); // Procesar la siguiente solicitud en la cola
});

export default router;