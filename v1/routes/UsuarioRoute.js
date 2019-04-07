const controller = require('../controllers/UsuarioController.js');
const express = require('express');
const router = express.Router();

const {check} = require('express-validator/check');

router.route('/')
    .get(controller.consultar)
    .post(
        [
            check('nome').isLength({ min: 5 }),
            check('email').isEmail().custom((value) => controller.emailJaExiste(value)),
            check('senha').isLength({ min: 5 }),
            check('perfil').custom((value) => controller.validarPerfil(value))
        ], 
        controller.inserir);

router.route('/:id')
    .get(controller.consultarPorId)
    .delete(controller.excluir)
    .put(
        [
            check('nome').isLength({ min: 5 }),
            check('email').isEmail().custom((value) => controller.emailJaExiste(value)),
            check('senha').isLength({ min: 5 }),
            check('perfil').custom((value) => controller.validarPerfil(value))
        ],
        controller.alterar);

exports.default = router;