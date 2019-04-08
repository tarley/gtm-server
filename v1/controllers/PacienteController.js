const mongoose = require('mongoose');
const mensagens = require('../utils/Mensagens');
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

            const query = Paciente.find({}, { 'nome': 1, 'sexo': 1, 'cpf': 1 });
            const pacientes = await query.exec();
            res.json(pacientes);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async consultarPorId(req, res) {
        try {
            mongoose.connect(URL_MONGO_DB, { useNewUrlParser: true });

            const query = Paciente.findById(req.params.id);
            const paciente = await query.exec();

            if (paciente)
                res.json(paciente);
            else
                res.status(404).json({ errors: [{ msg: mensagens.PACIENTE_NAO_ENCONTRADO }] });
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

    exluir(req, res) {
        try {
            mongoose.connect(URL_MONGO_DB, {
                useNewUrlParser: true
            });

            Paciente.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }, (err, result) => {
                if (err)
                    return res.status(500).json({ errors: [{ ...err }] });

                if (result.deletedCount == 0)
                    return res.json(result);
            });

        } catch (err) {
            res.status(500).json(err);
        }
    }

    alterar(req, res) {
        try {
            mongoose.connect(URL_MONGO_DB, {
                useNewUrlParser: true
            });

            Paciente.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, req.body, (err, result) => {
                if (err)
                    return res.status(500).json({ errors: [{ ...err }] });

                if (result.nModified == 0)
                    return res.status(404).json(result);

                return res.json(result);
            })
        } catch (err) {
            res.status(500).json(err);
        }
    }


}

module.exports = new PacienteController();