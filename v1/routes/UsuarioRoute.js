const controller = require('../controllers/UsuarioController.js');
const express = require('express');
const router = express.Router();
const mensagens = require('../utils/Mensagens');

const {check} = require('express-validator/check');

router.route('/')
    .get(controller.verificarToken, controller.consultar)
    .post(
        [
            check('nome', mensagens.TAM_MIN_NOME_USUARIO).isLength({ min: 5 }),
            check('email', mensagens.EMAIL_INVALIDO).isEmail(),
            check('senha', mensagens.TAM_MIN_SENHA_USUARIO).isLength({ min: 5 }),
            check('perfil', mensagens.PERFIL_INVALIDO_USUARIO).custom((value) => controller.validarPerfil(value))
        ], 
        controller.verificarToken, controller.inserir);

router.route('/:id')
    .get(controller.verificarToken, controller.consultarPorId)
    .delete(controller.verificarToken, controller.excluir)
    .put(
        [
            check('nome', mensagens.TAM_MIN_NOME_USUARIO).isLength({ min: 5 }),
            check('email', mensagens.EMAIL_INVALIDO).isEmail(),
            check('senha', mensagens.TAM_MIN_SENHA_USUARIO).isLength({ min: 5 }),
            check('perfil', mensagens.PERFIL_INVALIDO_USUARIO).custom((value) => controller.validarPerfil(value))
        ],
        controller.verificarToken, controller.alterar);

router.route('/login')
        .post(
            [
                check('email', mensagens.EMAIL_INVALIDO).isEmail(),
                check('senha', mensagens.TAM_MIN_SENHA_USUARIO).isString()
            ],
            controller.login
        );

exports.default = router;