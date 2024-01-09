import { Router } from 'express';
import { twitter as twitterCrawler} from '../controllers/twitter-crawler-app/twitterCrawlerApp.js';


const router = Router();



router.post('/twitter-crawler', (req, res) => {
    const { url, nombre, numero } = req.body;
    twitterCrawler(url, nombre, numero);
    
    res.status(200).send('Datos recibidos y procesados con éxito');
});


export default router;