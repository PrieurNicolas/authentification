import cors from 'cors'
import express from 'express'
import { config } from '~/config'


const app = express();
const logRoutes = require('../src/routes.ts');

app.use(express.json());

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => { res.send("Hello World !") });
app.use('/api/v1/utilisateur', logRoutes);
app.listen(config.API_PORT, () => console.log('Clap-Trap : OMG LE SERVEUR EST EN FONCTIONNEMENT !! Calcul en cours....'));