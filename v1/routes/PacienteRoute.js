const express = require('express');
const router = express.Router();
const controller = require('../controllers/PacienteController');
const mensagens = require('../utils/Mensagens')

const {check} = require('express-validator/check');

router.route('/')
    .get(controller.consultar)
    .post(
        [
            check('nome', mensagens.CAMPO_NOME_VAZIO).not().isEmpty(),
            check('cpf', mensagens.CAMPO_CPF_VAZIO).not().isEmpty(),
            check('cpf', mensagens.CAMPO_CPF_MIN).isLength({min: 14, max: 14}),
            check('telefone', mensagens.CAMPO_TELEFONE_VAZIO).not().isEmpty(),
            check('telefone', mensagens.CAMPO_TELEFONE_MIN).isLength({min: 10, max: 11}),
            check('dataNascimento', mensagens.CAMPO_DTANASC_VAZIO).not().isEmpty(),
            check('anosEstudo', mensagens.CAMPO_ANOSESTUDO_VAZIO).not().isEmpty(),
            check('estadoCivil', mensagens.CAMPO_ESTADOCIVIL_VAZIO).not().isEmpty(),
            check('motivoConsulta', mensagens.CAMPO_MOTIVOCONSULTA_VAZIO).not().isEmpty(),
        ], 
        controller.inserir);

router.route('/:id')
    .get(controller.consultarPorId)
    .delete(controller.exluir)
    .put(
        [
            check('nome', mensagens.CAMPO_NOME_VAZIO).not().isEmpty(),
            check('cpf', mensagens.CAMPO_CPF_VAZIO).not().isEmpty(),
            check('cpf', mensagens.CAMPO_CPF_MIN).isLength({min: 14, max: 14}),
            check('telefone', mensagens.CAMPO_TELEFONE_VAZIO).not().isEmpty(),
            check('telefone', mensagens.CAMPO_TELEFONE_MIN).isLength({min: 10, max: 11}),
            check('dataNascimento', mensagens.CAMPO_DTANASC_VAZIO).not().isEmpty(),
            check('anosEstudo', mensagens.CAMPO_ANOSESTUDO_VAZIO).not().isEmpty(),
            check('estadoCivil', mensagens.CAMPO_ESTADOCIVIL_VAZIO).not().isEmpty(),
            check('motivoConsulta', mensagens.CAMPO_MOTIVOCONSULTA_VAZIO).not().isEmpty(),
        ],
        controller.alterar)

exports.default = router;