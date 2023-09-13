import express from 'express';
import { config } from 'dotenv';
import urlRouter from './router';
import bodyParser from 'body-parser';

config();

const app = express();

const port = process.env.PORT || 8000;

app.use(
    bodyParser.json(),
    urlRouter,
);


app.listen(port, () => {
    console.log(`Listening on ${port}`);
});