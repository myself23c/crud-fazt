// twitterCrawler.routers.js
/*
import { Router } from 'express';
import { twitter as twitterCrawler } from '../controllers/twitter-crawler-app/twitterCrawlerApp.js';
import createQueueMiddleware from '../middlewares/queueTwitterCrawler.js'; 

const router = Router();
// crear instnacia de queue de la middleware para hacer queus unicas
const { queueMiddleware: twitterQueueMiddleware } = createQueueMiddleware();

router.post('/twitter-crawler', twitterQueueMiddleware, async (req, res) => {
    const { url, nombre, numero } = req.body;
    await twitterCrawler(url, nombre, numero);
    res.status(200).send('Datos recibidos y procesados con éxito');
    //processNext(); // Procesar la siguiente solicitud en la cola
});

export default router;



archivo ejemplo ruta twiter // twitterCrawler.routers.js

*/
/*
import { Router } from 'express';
import { twitter as twitterCrawler } from '../controllers/twitter-crawler-app/twitterCrawlerApp.js';
import createQueueMiddleware from '../middlewares/queueTwitterCrawler.js'; 

const router = Router();
// crear instnacia de queue de la middleware para hacer queus unicas
const { queueMiddleware: twitterQueueMiddleware } = createQueueMiddleware();

router.post('/twitter-crawler', twitterQueueMiddleware, async (req, res) => {
    const { url, nombre, numero } = req.body;
    await twitterCrawler(url, nombre, numero);
    res.status(200).send('Datos recibidos y procesados con éxito');
    //processNext(); // Procesar la siguiente solicitud en la cola
});

export default router;
*/

import { Router } from 'express';
import { twitter as twitterCrawler } from '../controllers/twitter-crawler-app/twitterCrawlerApp.js';
import createQueueMiddleware from '../middlewares/queueMiddlewere.js';

const router = Router();

// Crear la instancia del middleware y extraer queueMiddleware
const { queueMiddleware: twitterQueueMiddleware } = createQueueMiddleware();

router.post('/twitter-crawler', twitterQueueMiddleware, async (req, res) => {
    try {
        const { url, nombre, numero } = req.body;
        await twitterCrawler(url, nombre, numero);
        res.status(200).send('Datos recibidos y procesados con éxito');
    } catch (error) {
        console.error('Error en twitterCrawler:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
});

export default router;