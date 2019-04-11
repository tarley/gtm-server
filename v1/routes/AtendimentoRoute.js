const controller = require('../controllers/AtendimentoController.js');
const express = require('express');
const router = express.Router();
const mensagens = require('../utils/Mensagens');

const {check} = require('express-validator/check');

router.route('/')
    .get(controller.consultar)
    .post(controller.inserir);

router.route('/:id')
    .get(controller.consultarPorId)
    .delete(controller.excluir)
    .put(controller.alterar);

exports.default = router;