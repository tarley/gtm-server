const mongoose = require('mongoose');
const {
    validationResult
} = require('express-validator/check');

const {
    URL_MONGO_DB
} = require('../utils/Constantes');

const Medicamento = require('../models/Medicamento');

class MedicamentoController {
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

            let newMedicamento = new Medicamento({
                ...req.body
            })

            newMedicamento = await newMedicamento.save();
            res.json(newMedicamento);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async consultar(req, res) {
        try {
            mongoose.connect(URL_MONGO_DB, {
                useNewUrlParser: true
            });

            const query = Medicamento.find({}, {'descricao':1});
            const medicamento = await query.exec();
            res.json(medicamento);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    excluir(req, res) {
        try {
            mongoose.connect(URL_MONGO_DB, {useNewUrlParser: true});
            
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
}

module.exports = new MedicamentoController();