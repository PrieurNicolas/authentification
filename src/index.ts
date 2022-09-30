import cors from 'cors';
import express, {json} from 'express';
import { config } from '~/config';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import {dirname,join} from 'path';
import { fileURLToPath } from 'url';


dotenv.config();

//const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const logRoutes = require('../src/routes.ts');
const corsOptions = {credentials:true, origin: process.env.URL }

app.use(express.json());

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => { res.send("Hello World !") });
app.use('/api/utilisateur', logRoutes);
app.use('/api/auth', logRoutes);
app.listen(config.API_PORT, () => console.log('Clap-Trap : OMG LE SERVEUR EST EN FONCTIONNEMENT !! Calcul en cours....'));