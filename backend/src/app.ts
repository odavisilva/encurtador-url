import express from 'express';
import cors from 'cors';
import { createShortUrl, redirect, getStats } from './controllers/urlController.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/shorten', createShortUrl);
app.get('/api/stats/:slug', getStats);
app.get('/:slug', redirect);
app.use(errorHandler);

export default app;
