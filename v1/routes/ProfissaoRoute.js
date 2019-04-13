const express = require('express');
const router = express.Router();
const controller = require('../controllers/ProfissaoController');

const {check} = require('express-validator/check');

router.route('/')
    .get(controller.consultar)
    .post([
        check('descricao').isLength({ min: 3})
    ], controller.inserir);

router.route('/:id')
    .delete(controller.excluir)
    
exports.default = router;