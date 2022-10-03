import { authenticateToken } from "./controller";
const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.get('/refresh_token', controller.refreshToken);
<<<<<<< HEAD
=======
router.delete('/refresh_token', controller.deleteToken);
>>>>>>> 532d0db04f8f6d74cfe607865ace400cd965d4cd
router.get('/', authenticateToken, controller.getUtilisateurs);
router.post('/', controller.addUtilisateurs);
router.get('/:id', controller.getUtilisateursById);
router.put('/:id', controller.updateUtilisateurs);
router.delete('/refresh_token', controller.deleteToken);
router.delete('/:id', controller.removeUtilisateurs);
router.post('/login', controller.loginUtilisateur);
// router.put(':/id', controller.updateEmailUtilisateurs);
// router.post('/', controller.loginUtilisateur);
// router.post('/', controller.registerUtilisateur);

module.exports = router;
