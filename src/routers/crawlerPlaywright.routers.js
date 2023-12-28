import { Router } from 'express';
import { webCrawling } from '../controllers/crawlerPlayright.controllers.js';

// En tu archivo de controladores
const router = Router();
// Controlador para la ruta Express
/*
export const startWebCrawling = async (req, res) => {
    const url = req.body.url;
    if (!url) {
        return res.status(400).send('URL no proporcionada');
    }

    try {
        await webCrawling(url);
        res.send('Proceso de crawling iniciado con éxito');
    } catch (error) {
        res.status(500).send('Error durante el crawling: ' + error.message);
    }
};
*/

router.post('/crawler-playwright', async (req, res) => {
    const {name,url} = req.body;
    console.log(name);
    if (!url) {
        return res.status(400).send('URL no proporcionada');
    }

    try {
        await webCrawling(url,name);
        res.send('Proceso de crawling iniciado con éxito');
    } catch (error) {
        res.status(500).send('Error durante el crawling: ' + error.message);
    }
} )

export default router