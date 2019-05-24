const controller = require('../controllers/AtendimentoController.js');
const express = require('express');
const router = express.Router();
const mensagens = require('../utils/Mensagens');

const {check} = require('express-validator/check');

router.route('/')
    .get(controller.consultar)
    .post([
        check('quadroGeral', mensagens.QUADRO_GERAL_VAZIO).not().isEmpty(),
        check('doencas').custom((value) => controller.validaAtributoDoenca(value, 'medicamento')),
        check('doencas').custom((value) => controller.validaAtributoDoenca(value, 'posologiaRelatada')),
        check('doencas').custom((value) => controller.validaAtributoDoenca(value, 'efetividade')),
        check('doencas').custom((value) => controller.validaAtributoDoenca(value, 'seguranca')),
        check('doencas').custom((value) => controller.validaAtributoDoenca(value, 'dificuldadeUso')),
        check('doencas').custom((value) => controller.validaAtributoDoenca(value, 'prm')),
    ], controller.inserir);

router.route('/:id')
    .get(controller.consultarPorId)
    .delete(controller.excluir)
    .put([
        check('quadroGeral', mensagens.QUADRO_GERAL_VAZIO).not().isEmpty(),
        check('doencas').custom((value) => controller.validaAtributoDoenca(value, 'medicamento')),
        check('doencas').custom((value) => controller.validaAtributoDoenca(value, 'posologiaRelatada')),
        check('doencas').custom((value) => controller.validaAtributoDoenca(value, 'efetividade')),
        check('doencas').custom((value) => controller.validaAtributoDoenca(value, 'seguranca')),
        check('doencas').custom((value) => controller.validaAtributoDoenca(value, 'dificuldadeUso')),
        check('doencas').custom((value) => controller.validaAtributoDoenca(value, 'prm')),
    ],controller.alterar);

router.route('/paciente/:id')
    .get(controller.buscaUltimoAtendimentoPorIdPaciente);

router.route('/atendimento/:id')
    .get(controller.contaAtendimentosPaciente);    

router.route('/finaliza/:id')
    .put(controller.finalizaAtendimento);

router.route('/filtro')
    .post(controller.filtraAtendimentos);

exports.default = router;