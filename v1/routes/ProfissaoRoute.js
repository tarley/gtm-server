const express = require('express');
const router = express.Router();
const controller = require('../controllers/ProfissaoController');
const mensagens = require('../utils/Mensagens')

const {check} = require('express-validator/check');

router.route('/')
    .get(controller.consultar)
    .post([
        check('descricao', mensagens.CAMPO_DESCRICAO_VAZIO).not().isEmpty()
    ], controller.inserir);

router.route('/:id')
    .delete(controller.excluir)
    
exports.default = router;