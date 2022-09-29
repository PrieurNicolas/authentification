import { authenticateToken } from "./controller";
const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.get('/', authenticateToken, controller.getUtilisateurs);
router.post('/', controller.addUtilisateurs);
router.get('/:id', controller.getUtilisateursById);
router.get('/refresh_token', controller.refreshToken);
router.put('/:id', controller.updateUtilisateurs);
router.delete('/:id', controller.removeUtilisateurs);
router.post('/login', controller.loginUtilisateur);
// router.put(':/id', controller.updateEmailUtilisateurs);
// router.post('/', controller.loginUtilisateur);
// router.post('/', controller.registerUtilisateur);

module.exports = router;
