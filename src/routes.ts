import { authenticateToken } from "./controller";
const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.get('/', authenticateToken, controller.getUtilisateurs);
router.post('/', controller.addUtilisateurs);
router.get('/:id', controller.getUtilisateursById);
router.put('/:id', controller.updateUtilisateurs);
router.delete('/:id', controller.removeUtilisateurs);

module.exports = router;
