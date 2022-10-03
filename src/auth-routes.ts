import { authenticateToken } from "./controller";
const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.get('/refresh_token', controller.refreshToken);
router.delete('/refresh_token', controller.deleteToken);
router.post('/login', controller.loginUtilisateur);

module.exports = router;