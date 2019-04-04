const mongoose = require('mongoose');
const {
    validationResult
} = require('express-validator/check');

const {
    URL_MONGO_DB
} = require('../utils/Constantes');
const Paciente = require('../models/Paciente');

class PacienteController {

    async consultar(req, res) {
        try {
            mongoose.connect(URL_MONGO_DB, {
                useNewUrlParser: true
            });

            const query = Paciente.find();
            const pacientes = await query.exec();
            res.json(pacientes);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async inserir(req, res) {
        try {
            const erros = validationResult(req);

            if (!erros.isEmpty())
                return res.status(422).json({
                    errors: erros.array()
                });

            mongoose.connect(URL_MONGO_DB, {
                useNewUrlParser: true
            });

            let newPaciente = new Paciente({
                ...req.body
            })

            newPaciente = await newPaciente.save();
            res.json(newPaciente);
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = new PacienteController();