import prismaClient from "../database/prismaClient";
import { Request, Response } from "express";
import { config } from 'dotenv';
import Joi from 'joi';

config()

const domain = process.env.DOMAIN || "localhost:3000/";

const schema = Joi.object({
    url: Joi.string().min(6).max(120).trim().required(),
    title: Joi.string().min(3).max(10).trim().required()
})

export class UrlController {
    static async newShortner(req: Request, res: Response) {
        const { url, title } = req.body;

        if(!url || !title) {
            return res.status(400).send('ERRO 400. Certifique-se de que você enviou um título e uma url.');
        }

        const { error } = schema.validate(req.body);
        if(error?.message.includes('url')) {
            return res.status(400).send('ERRO 400. A URL deve ter entre 6 e 120 caracteres e não deve ter espaços.');
        } else if(error?.message.includes('title')) {
            return res.status(400).send('ERRO 400. O título deve ter entre 3 e 10 caracteres e não deve ter espaços.');
        };

        try{
            const existentShortner = await prismaClient.url.findUnique({ where: { title } });

            if(!existentShortner) {
                const newShortner = await prismaClient.url.create({ data: { url, title } });
                const newUrl = domain+String(newShortner.title)

                return res.status(200).send(`Encurtador criado com sucesso! Acesse-o em: ${newUrl}. Veja informações do seu encurtador em: ${newUrl+'/'+newShortner.id}.`);
            };

                return res.status(400).send('ERRO 400. Já existe um encurtador com o título que você escolheu.');
            
        } catch(err) {
            return res.status(500).send(`ERRO 500. O servidor não conseguiu responder: ${err}`);
        };
    }

    static async getShortner(req: Request, res: Response) {
        const { title } = req.params;

        try {
          const findShortner = await prismaClient.url.findUnique({ where: { title } });

          if(findShortner) {
            const hits = findShortner.hits + 1;

            const addHit = await prismaClient.url.update({
                where: { title },
                data: { hits }
            });

            return res.status(200).redirect(findShortner.url);
          } else if(!findShortner) {
            return res.status(404).send(`ERRO 404. Não foi encontrado encurtador com o título ${title}.`);
          };
        } catch(err) {
            return res.status(500).send(`ERRO 500. O servidor não conseguiu responder: ${err}`);
        };   
    }

    static async getInfo(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const requester = await prismaClient.url.findFirst({ where: {id} });

            if(!requester) {
                return res.status(404).send(`ERRO 404. Encurtador não encontrado.`);
            } else if(requester) {
                return res.status(200).json(requester);
            }
        } catch(err) {
            return res.status(500).send(`ERRO 500. O servidor não conseguiu responder: ${err}`);
        };
    }
};