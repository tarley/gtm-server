const mongoose = require('mongoose');
const mensagens = require('../utils/Mensagens');
const {
    validationResult
} = require('express-validator/check');

const Paciente = require('../models/Paciente');

class PacienteController {

    async consultar(req, res) {
        try {
            mongoose.connect(process.env.DB_URL, {
                useNewUrlParser: true
            });

            const query = Paciente.find({}, {
                'nome': 1,
                'sexo': 1,
                'cpf': 1,
                'ativo': 1
            }, {
                    limit: 50,
                    sort: { _id: -1 }
                });
            const pacientes = await query.exec();
            res.json(pacientes);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async consultarPorId(req, res) {
        try {
            mongoose.connect(process.env.DB_URL, {
                useNewUrlParser: true
            });

            const query = Paciente.findById(req.params.id);
            const paciente = await query.exec();

            if (paciente)
                res.json(paciente);
            else
                res.status(404).json({
                    errors: [{
                        msg: mensagens.PACIENTE_NAO_ENCONTRADO
                    }]
                });
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

            mongoose.connect(process.env.DB_URL, {
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

    alterar(req, res) {
        try {
            mongoose.connect(process.env.DB_URL, {
                useNewUrlParser: true
            });

            Paciente.updateOne({
                _id: mongoose.Types.ObjectId(req.params.id)
            }, req.body, (err, result) => {
                if (err)
                    return res.status(500).json({
                        errors: [{
                            ...err
                        }]
                    });

                if (result.nModified == 0)
                    return res.status(404).json(result);

                return res.json(result);
            })
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async consultarPorCpf(req, res) {
        try {
            mongoose.connect(process.env.DB_URL, {
                useNewUrlParser: true
            });

            const cpf = req.params.cpf;

            const query = Paciente.find({
                'cpf': {
                    $regex: cpf + '.*'
                }
            });
            const pacientes = await query.exec();

            if (pacientes)
                res.json(pacientes);
            else
                res.status(404).json({
                    errors: [{
                        msg: mensagens.PACIENTE_NAO_ENCONTRADO
                    }]
                });

        } catch (err) {
            res.status(500).json(err)
        }
    }

    async consultarPorNome(req, res) {
        try {
            mongoose.connect(process.env.DB_URL, {
                useNewUrlParser: true
            });

            const nome = req.params.nome;

            const query = Paciente.find({
                'nome': {
                    $regex: nome + '.*',
                    $options: 'i'
                }
            });
            const pacientes = await query.exec();

            if (pacientes)
                res.json(pacientes);
            else
                res.status(404).json({
                    errors: [{
                        msg: mensagens.PACIENTE_NAO_ENCONTRADO
                    }]
                });

        } catch (err) {
            res.status(500).json(err)
        }
    }


}

module.exports = new PacienteController();