import express from 'express';
import { registerRoutes } from '../server/routes';

const app = express();

app.use(express.json({ limit: '32kb' }));
app.use(express.urlencoded({ extended: false, limit: '32kb' }));

const routesReady = registerRoutes(app);

export default async function handler(req: any, res: any) {
  await routesReady;
  return app(req, res);
}