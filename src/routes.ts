const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.get('/', controller.getUtilisateurs);
router.post('/', controller.addUtilisateurs);
router.get('/:id', controller.getUtilisateursById);
router.put('/:id', controller.updateUtilisateurs);
router.delete('/:id', controller.removeUtilisateurs);
// router.put(':/id', controller.updateEmailUtilisateurs)
// router.post('/', controller.loginUtilisateur);
// router.post('/', controller.registerUtilisateur);

module.exports = router;
