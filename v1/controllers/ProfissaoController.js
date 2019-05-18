const mongoose = require('mongoose');
const {
    validationResult
} = require('express-validator/check');

const Profissao = require('../models/Profissao');

class ProfissaoController {
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

            let newProfissao = new Profissao({
                ...req.body
            })

            newProfissao = await newProfissao.save();
            res.json(newProfissao);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async consultar(req, res) {
        try {
            mongoose.connect(process.env.DB_URL, {
                useNewUrlParser: true
            });

            const query = Profissao.find({}, {'descricao':1});
            const profissao = await query.exec();
            res.json(profissao);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    excluir(req, res) {
        try {
            mongoose.connect(process.env.DB_URL, {useNewUrlParser: true});
            
            Profissao.deleteOne({_id: mongoose.Types.ObjectId(req.params.id)}, (err, result) => {
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

module.exports = new ProfissaoController();