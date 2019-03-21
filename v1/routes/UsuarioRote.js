const controller = require('../controllers/UsuarioController.js');
const express = require('express');
const router = express.Router();

router.get('/', controller.inserir);

exports.default = router;