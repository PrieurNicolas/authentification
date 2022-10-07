import cors from 'cors';
import express, {json} from 'express';
import { config } from '~/config';
import dotenv from 'dotenv';

dotenv.config();


const app = express();
const logRoutes = require('../src/routes.ts');
const authRoutes = require('../src/auth-routes.ts');

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => { res.send("Hello World !") });
app.use('/api/utilisateur', logRoutes);
app.use('/api/auth', authRoutes);
app.listen(config.API_PORT, () => console.log('Clap-Trap : OMG LE SERVEUR EST EN FONCTIONNEMENT !! Calcul en cours....'));