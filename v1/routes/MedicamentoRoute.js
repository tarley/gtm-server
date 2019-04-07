const express = require('express');
const router = express.Router();
const controller = require('../controllers/MedicamentoController');

const {check} = require('express-validator/check');

router.route('/')
    .get(controller.consultar)
    .post(controller.inserir);

exports.default = router;