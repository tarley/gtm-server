const mongoose = require('mongoose');
const {
    validationResult
} = require('express-validator/check');

const {
    URL_MONGO_DB
} = require('../utils/Constantes');

const Instituicao = require('../models/Instituicao');

class InstituicaoController {
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

            let newInstituicao = new Instituicao({
                ...req.body
            })

            newInstituicao = await newInstituicao.save();
            res.json(newInstituicao);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async consultar(req, res) {
        try {
            mongoose.connect(process.env.DB_URL, {
                useNewUrlParser: true
            });

            const query = Instituicao.find({}, {'descricao':1});
            const instituicao = await query.exec();
            res.json(instituicao);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    excluir(req, res) {
        try {
            mongoose.connect(process.env.DB_URL, {useNewUrlParser: true});
            
            Instituicao.deleteOne({_id: mongoose.Types.ObjectId(req.params.id)}, (err, result) => {
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

module.exports = new InstituicaoController();