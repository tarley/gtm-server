const mongoose = require('mongoose');
const mensagens = require('../utils/Mensagens');

const {
    validationResult
} = require('express-validator/check');

const Medicamento = require('../models/Medicamento');

class MedicamentoController {
    async inserir(req, res) {
        try {
            const erros = validationResult(req);

            if (!erros.isEmpty())
                return res.status(422).json({
                    errors: erros.array()
                });

            let newMedicamento = new Medicamento({
                ...req.body,
                criadoPor: req.idUsuario,
                criadoEm: new Date()
            })
            
            newMedicamento = await newMedicamento.save();
            res.json(newMedicamento);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async consultar(req, res) {
        try {
            const query = Medicamento.find();
            const medicamento = await query.exec();
            res.json(medicamento);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    excluir(req, res) {
        try {
            Medicamento.deleteOne({_id: mongoose.Types.ObjectId(req.params.id)}, (err, result) => {
                if(err)
                    return res.status(500).json({errors: [{...err}]});
                
                if(result.deletedCount == 0)
                   return res.status(404).json(result); 

                return res.json(result);
            });
        } catch(err) {
            res.status(500).json(err);
        }
    }

    async consultarPorNome(req, res) {
        try {
            const descricao = req.params.descricao;

            const query = Medicamento.find({
                'descricao': {
                    $regex: descricao + '.*',
                    $options: 'i'
                }
            },{},{limit: 50});
            const medicamentos = await query.exec();

            if (medicamentos)
                res.json(medicamentos);
            else
                res.status(404).json({
                    errors: [{
                        msg: mensagens.MEDICAMENTO_NAO_ENCONTRADO
                    }]
                });

        } catch (err) {
            res.status(500).json(err)
        }
    }
}

module.exports = new MedicamentoController();