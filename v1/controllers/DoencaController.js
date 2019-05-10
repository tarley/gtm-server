const mongoose = require('mongoose');
const {
    validationResult
} = require('express-validator/check');

const {
    URL_MONGO_DB
} = require('../utils/Constantes');

const Doenca = require('../models/Doenca');

class DoencaController {
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

            let newDoenca = new Doenca({
                ...req.body
            })

            newDoenca = await newDoenca.save();
            res.json(newDoenca);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async consultar(req, res) {
        try {
            mongoose.connect(URL_MONGO_DB, {
                useNewUrlParser: true
            });

            const query = Doenca.find({}, {'descricao':1});
            const doenca = await query.exec();
            res.json(doenca);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    excluir(req, res) {
        try {
            mongoose.connect(URL_MONGO_DB, {useNewUrlParser: true});
            
            Doenca.deleteOne({_id: mongoose.Types.ObjectId(req.params.id)}, (err, result) => {
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

module.exports = new DoencaController();