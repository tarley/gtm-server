const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/UsuarioController.js');
const controller = require('../controllers/InstituicaoController');
const mensagens = require('../utils/Mensagens')

const {check} = require('express-validator/check');

router.route('/')
    .get(usuarioController.verificarToken, usuarioController.validarPerfilAdministrador, controller.consultar)
    .post([
        check('descricao', mensagens.CAMPO_DESCRICAO_VAZIO).not().isEmpty()
    ], usuarioController.verificarToken, usuarioController.validarPerfilAdministrador, controller.inserir);

router.route('/:id')
    .get(usuarioController.verificarToken, usuarioController.validarPerfilAdministrador, controller.consultarPorId)
    .delete(usuarioController.verificarToken, usuarioController.validarPerfilAdministrador, controller.excluir)
    
exports.default = router;