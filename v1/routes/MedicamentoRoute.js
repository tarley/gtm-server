const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/UsuarioController.js');
const controller = require('../controllers/MedicamentoController');
const mensagens = require('../utils/Mensagens')

const {check} = require('express-validator/check');

router.route('/')
    .get(usuarioController.verificarToken, usuarioController.validarPerfilProfissionalSaude, controller.consultar)
    .post([
        check('descricao', mensagens.CAMPO_DESCRICAO_VAZIO).not().isEmpty()
    ], usuarioController.verificarToken, usuarioController.validarPerfilProfissionalSaude, controller.inserir);

router.route('/:id')
    .delete(usuarioController.verificarToken, usuarioController.validarPerfilProfissionalSaude, controller.excluir)

router.route('/descricao/:descricao')
    .get(usuarioController.verificarToken, controller.consultarPorNome)
    
exports.default = router;