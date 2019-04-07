const express = require('express');
const router = express.Router();
const controller = require('../controllers/MedicamentoController');

const {check} = require('express-validator/check');

router.route('/')
    .get(controller.consultar)
    .post(controller.inserir);

router.route('/:id')
    .delete(controller.excluir)
    
exports.default = router;