const mongoose = require('mongoose');
const { validationResult } = require('express-validator/check');

const { URL_MONGO_DB } = require('../utils/Constantes');
const Atendimento = require('../models/Atendimento');
const Paciente = require('../models/Paciente');
const mensagens = require('../utils/Mensagens');

class AtendimentoController {

    async buscaUltimoAtendimentoPorIdPaciente(req, res) {
        try {
            mongoose.connect(URL_MONGO_DB, { useNewUrlParser: true });

            const query = Atendimento.findOne({ idPaciente: req.params.id }).sort({ dataAtendimento: -1 });
            const atendimento = await query.exec();
            res.json(atendimento);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async buscaPorCpfPaciente(req, res) {
        try {
            mongoose.connect(URL_MONGO_DB, { useNewUrlParser: true });

            const queryPaciente = Paciente.findOne({ cpf: req.params.cpf });
            const paciente = await queryPaciente.exec();

            let atendimentos;
            if (paciente) {
                const query = Atendimento.find({ nomePaciente: paciente.nome });
                atendimentos = await query.exec();
            } else {
                atendimentos = [];
            }

            res.json(atendimentos);

        } catch (err) {
            res.status(500).json(err);
        }
    }

    async consultar(req, res) {
        try {
            mongoose.connect(URL_MONGO_DB, { useNewUrlParser: true });

            const query = Atendimento.find().sort({ dataAtendimento: -1 });
            const atendimentos = await query.exec();
            res.json(atendimentos);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async consultarPorId(req, res) {
        try {
            mongoose.connect(URL_MONGO_DB, { useNewUrlParser: true });

            const query = Atendimento.findById(req.params.id);
            const atendimentos = await query.exec();

            if (atendimentos)
                res.json(atendimentos);
            else
                res.status(404).json({ errors: [{ msg: mensagens.ATENDIMENTO_NAO_ENCONTRADO }] });
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async inserir(req, res) {
        try {
            const erros = validationResult(req);

            if (!erros.isEmpty())
                return res.status(422).json({ errors: erros.array() });

            mongoose.connect(URL_MONGO_DB, { useNewUrlParser: true });

            let newAtendimento = new Atendimento({
                ...req.body
            })
            newAtendimento = await newAtendimento.save();
            res.json(newAtendimento);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    excluir(req, res) {
        try {
            mongoose.connect(URL_MONGO_DB, { useNewUrlParser: true });

            Atendimento.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }, (err, result) => {
                if (err)
                    return res.status(500).json({ errors: [{ ...err }] });

                if (result.deletedCount == 0)
                    return res.status(404).json(result);

                return res.json(result);
            });
        } catch (err) {
            res.status(500).json(err);
        }
    }

    validaAtributoDoenca(doencas, atributo) {
        doencas.forEach(doenca => 
            doenca.farmacoterapias.forEach(farmacoterapia => {
                if (!farmacoterapia[atributo]) {
                    throw new Error(this.formataNomeAtributo(atributo) + ' deve ser informado');
                }
            })
        )
        return true;
    }

    formataNomeAtributo(titulo) {
        const primeiroCaractere = titulo.substring(0, 1);
        return titulo.replace(primeiroCaractere, primeiroCaractere.toUpperCase());
    }

    async alterar(req, res) {
        try {
            const erros = validationResult(req);

            if(!erros.isEmpty())
                return res.status(422).json({errors: erros.array()});

            mongoose.connect(URL_MONGO_DB, {useNewUrlParser: true});

            const atendimento = {
                ...req.body
            }

            const id = mongoose.Types.ObjectId(req.params.id);
            const result = await Atendimento.updateOne({_id: id}, atendimento);

            if(result.n == 0)
                return res.status(404).json(result); 

            res.json(result);
        } catch (err) {
            res.status(500).json(err);
        }
    }

}

module.exports = new AtendimentoController();