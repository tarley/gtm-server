const mongoose = require('mongoose');
const { validationResult } = require('express-validator/check');
const Instituicao = require('../models/Instituicao');
const perfilUsuario = require('../utils/PerfilUsuario');
const mensagens = require('../utils/Mensagens');

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
                ...req.body,
                criadoPor: req.idUsuario,
                criadoEm: new Date(),
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

            if(req.perfilUsuario !== perfilUsuario.ADMINISTRADOR) {
                query.where('_id', req.idInstituicao);
            }

            const instituicao = await query.exec();
            res.json(instituicao);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async consultarPorId(req, res) {
        try {
            mongoose.connect(process.env.DB_URL, {
                useNewUrlParser: true
            });

            const query = Instituicao.findById(req.params.id);

            if(req.perfilUsuario !== perfilUsuario.ADMINISTRADOR && req.idInstituicao !== req.params.id) {
                res.status(401).json({message: mensagens.ERRO_CONSULTAR_OUTRA_INSTITUICAO})
            }

            const instituicao = await query.exec();

            if (instituicao)
                res.json(instituicao);
            else
                res.status(404).json({
                    errors: [{
                        msg: mensagens.INSTITUICAO_NAO_ENCONTRADA
                    }]
                });
        } catch (err) {
            res.status(500).json(err);
        }
    }

    excluir(req, res) {
        try {
            mongoose.connect(process.env.DB_URL, {useNewUrlParser: true});
            
            if(req.perfilUsuario !== perfilUsuario.ADMINISTRADOR && req.idInstituicao !== req.params.id) {
                res.status(401).json({message: mensagens.ERRO_EXCLUIR_INSTITUICAO_DIFERENTE_REGISTRO});
            }

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