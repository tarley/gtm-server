const usuarioController = require('../controllers/UsuarioController.js');
const controller = require('../controllers/AtendimentoController.js');
const express = require('express');
const router = express.Router();
const mensagens = require('../utils/Mensagens');

const {check} = require('express-validator/check');

router.route('/')
    .get(usuarioController.verificarToken, controller.consultar)
    .post([
        check('quadroGeral', mensagens.QUADRO_GERAL_VAZIO).not().isEmpty(),
        check('doencas').custom((value) => controller.validaAtributoDoenca(value, 'medicamento')),
        check('doencas').custom((value) => controller.validaAtributoDoenca(value, 'posologiaRelatada')),
        check('doencas').custom((value) => controller.validaAtributoDoenca(value, 'efetividade')),
        check('doencas').custom((value) => controller.validaAtributoDoenca(value, 'seguranca')),
        check('doencas').custom((value) => controller.validaAtributoDoenca(value, 'dificuldadeUso')),
        check('doencas').custom((value) => controller.validaAtributoDoenca(value, 'prm')),
    ], 
    usuarioController.verificarToken, controller.inserir);

router.route('/:id')
    .get(usuarioController.verificarToken, controller.consultarPorId)
    .delete(usuarioController.verificarToken, controller.excluir)
    .put([
        check('quadroGeral', mensagens.QUADRO_GERAL_VAZIO).not().isEmpty(),
        check('doencas').custom((value) => controller.validaAtributoDoenca(value, 'medicamento')),
        check('doencas').custom((value) => controller.validaAtributoDoenca(value, 'posologiaRelatada')),
        check('doencas').custom((value) => controller.validaAtributoDoenca(value, 'efetividade')),
        check('doencas').custom((value) => controller.validaAtributoDoenca(value, 'seguranca')),
        check('doencas').custom((value) => controller.validaAtributoDoenca(value, 'dificuldadeUso')),
        check('doencas').custom((value) => controller.validaAtributoDoenca(value, 'prm')),
    ], usuarioController.verificarToken, controller.alterar);

router.route('/paciente/:id')
    .get(usuarioController.verificarToken, controller.buscaUltimoAtendimentoPorIdPaciente);

router.route('/atendimento/:id')
    .get(usuarioController.verificarToken, controller.contaAtendimentosPaciente);    

router.route('/finaliza/:id')
    .put(usuarioController.verificarToken, usuarioController.validarPerfilProfissionalSaude, controller.finalizaAtendimento);

router.route('/filtro')
    .post(usuarioController.verificarToken, controller.filtraAtendimentos);

exports.default = router;