import { authenticateToken } from "./controller";
const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.post('/refresh_token', controller.refreshToken);
router.post('/login', controller.loginUtilisateur);

module.exports = router;