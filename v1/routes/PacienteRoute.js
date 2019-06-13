const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/UsuarioController.js');
const controller = require('../controllers/PacienteController');
const mensagens = require('../utils/Mensagens')

const { check } = require('express-validator/check');

router.route('/')
    .get(usuarioController.verificarToken, controller.consultar)
    .post(
        [
            check('nome', mensagens.CAMPO_NOME_VAZIO).isLength({ min: 1 }),
            check('cpf', mensagens.CAMPO_CPF_MIN).isLength({ min: 14, max: 14 }),
            check('telefone', mensagens.CAMPO_TELEFONE_VAZIO).not().isEmpty(),
            check('telefone', mensagens.CAMPO_TELEFONE_MIN).isLength({ min: 10, max: 11 }),
            check('dataNascimento', mensagens.CAMPO_DTANASC_VAZIO).not().isEmpty(),
            check('anosEstudo', mensagens.CAMPO_ANOSESTUDO_VAZIO).not().isEmpty(),
            check('estadoCivil', mensagens.CAMPO_ESTADOCIVIL_VAZIO).not().isEmpty(),
            check('dadosComplementares.motivoConsulta', mensagens.CAMPO_MOTIVOCONSULTA_VAZIO).isLength({ min: 1 }),
        ],
        usuarioController.verificarToken,
        controller.inserir);

router.route('/:id')
    .get(usuarioController.verificarToken, controller.consultarPorId)
    .put(
        [
            check('nome', mensagens.CAMPO_NOME_VAZIO).isLength({ min: 1 }),
            check('cpf', mensagens.CAMPO_CPF_MIN).isLength({ min: 14, max: 14 }),
            check('telefone', mensagens.CAMPO_TELEFONE_VAZIO).not().isEmpty(),
            check('telefone', mensagens.CAMPO_TELEFONE_MIN).isLength({ min: 10, max: 11 }),
            check('dataNascimento', mensagens.CAMPO_DTANASC_VAZIO).not().isEmpty(),
            check('anosEstudo', mensagens.CAMPO_ANOSESTUDO_VAZIO).not().isEmpty(),
            check('estadoCivil', mensagens.CAMPO_ESTADOCIVIL_VAZIO).not().isEmpty(),
            check('dadosComplementares.motivoConsulta', mensagens.CAMPO_MOTIVOCONSULTA_VAZIO).isLength({ min: 1 }),
        ],
        usuarioController.verificarToken,
        controller.alterar);

router.route('/cpf/:cpf')
    .get(usuarioController.verificarToken, controller.consultarPorCpf);

router.route('/nome/:nome')
    .get(usuarioController.verificarToken, controller.consultarPorNome)

exports.default = router;