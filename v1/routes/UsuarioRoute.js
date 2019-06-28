const controller = require('../controllers/UsuarioController.js');
const express = require('express');
const router = express.Router();
const mensagens = require('../utils/Mensagens');

const {check} = require('express-validator/check');

router.route('/')
    .get(controller.verificarToken, controller.validarPerfilProfissionalSaude, controller.consultar)
    .post(
        [
            check('nome', mensagens.TAM_MIN_NOME_USUARIO).isLength({ min: 5 }),
            check('email', mensagens.EMAIL_INVALIDO).isEmail(),
            check('senha', mensagens.TAM_MIN_SENHA_USUARIO).isLength({ min: 5 }),
            check('perfil', mensagens.PERFIL_INVALIDO_USUARIO).custom((value) => controller.validarPerfil(value)),
            check('idInstituicao', mensagens.USUARIO_INSTITUICAO_OBRIGATORIO).not().isEmpty(),
        ], 
        controller.verificarToken, controller.validarPerfilProfissionalSaude, controller.inserir);

router.route('/token')
        .get(controller.verificarToken)

router.route('/perfis')
        .get(controller.verificarToken, controller.validarPerfilProfissionalSaude, controller.consultarPerfis)

router.route('/:id')
    .get(controller.verificarToken,  controller.consultarPorId)
    .delete(controller.verificarToken, controller.validarPerfilProfissionalSaude, controller.excluir)
    .put(
        [
            check('nome', mensagens.TAM_MIN_NOME_USUARIO).isLength({ min: 5 }),
            check('email', mensagens.EMAIL_INVALIDO).isEmail(),
            check('senha', mensagens.TAM_MIN_SENHA_USUARIO).isLength({ min: 5 }),
            check('perfil', mensagens.PERFIL_INVALIDO_USUARIO).custom((value) => controller.validarPerfil(value)),
            check('idInstituicao', mensagens.USUARIO_INSTITUICAO_OBRIGATORIO).not().isEmpty(),
        ],
        controller.verificarToken, controller.validarPerfilProfissionalSaude, controller.alterar);

router.route('/login')
        .post(
            [
                check('email', mensagens.EMAIL_INVALIDO).isEmail(),
                check('senha', mensagens.TAM_MIN_SENHA_USUARIO).isLength({ min: 5 })
            ],
            controller.login
        );

router.route('/:id/redefinirSenha')
        .put(
            [
                check('senhaAntiga', mensagens.TAM_MIN_SENHA_USUARIO).isLength({ min: 5 }),
                check('novaSenha', mensagens.TAM_MIN_SENHA_USUARIO).isLength({ min: 5 }),
                check('confNovaSenha', mensagens.TAM_MIN_SENHA_USUARIO).isLength({ min: 5 })
            ],
            controller.verificarToken, controller.redefinirSenha
        )

exports.default = router;