import { Router } from 'express';
import { Request, Response } from 'express';
import { UrlController } from './controllers/UrlController';


const router = Router();

router
.post('/newShortner', UrlController.newShortner)
.post('*', (req: Request, res: Response) => { res.status(404).send('ERRO 404. Página não encontrada.') })
.get('/:title', UrlController.getShortner)
.get('/:title/:id', UrlController.getInfo)
.get('*', (req: Request, res: Response) => { res.status(404).send('ERRO 404. Página não encontrada.')});

export default router;