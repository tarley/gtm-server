const controller = require('../controllers/UsuarioController.js');
const express = require('express');
const router = express.Router();
const mensagens = require('../utils/Mensagens');

const {check} = require('express-validator/check');

router.route('/')
    .get(controller.consultar)
    .post(
        [
            check('nome', mensagens.TAM_MIN_NOME_USUARIO).isLength({ min: 5 }),
            check('email', mensagens.EMAIL_INVALIDO).isEmail(),
            check('senha', mensagens.TAM_MIN_SENHA_USUARIO).isLength({ min: 5 }),
            check('perfil', mensagens.PERFIL_INVALIDO_USUARIO).custom((value) => controller.validarPerfil(value))
        ], 
        controller.inserir);

router.route('/:id')
    .get(controller.consultarPorId)
    .delete(controller.excluir)
    .put(
        [
            check('nome', mensagens.TAM_MIN_NOME_USUARIO).isLength({ min: 5 }),
            check('email', mensagens.EMAIL_INVALIDO).isEmail(),
            check('senha', mensagens.TAM_MIN_SENHA_USUARIO).isLength({ min: 5 }),
            check('perfil', mensagens.PERFIL_INVALIDO_USUARIO).custom((value) => controller.validarPerfil(value))
        ],
        controller.alterar);

exports.default = router;