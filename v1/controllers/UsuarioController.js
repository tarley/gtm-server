const mongoose = require('mongoose');
const {validationResult} = require('express-validator/check');

const {URL_MONGO_DB} = require('../utils/Constantes');
const Usuario = require('../models/Usuario');
const mensagens = require('../utils/Mensagens');

class UsuarioController {

    async consultar(req, res) {
        try {
            mongoose.connect(URL_MONGO_DB, { useNewUrlParser: true });

            const query = Usuario.find({inativo: false});
            const usuarios = await query.exec();
            res.json(usuarios);
        } catch(err) {
            res.status(500).json(err);
        }
    }

    async consultarPorId(req, res) {
        try {
            mongoose.connect(URL_MONGO_DB, {useNewUrlParser: true});
            
            const query = Usuario.findById(req.params.id);
            const usuario = await query.exec();

            if(usuario)
                res.json(usuario);
            else
                res.status(404).json({errors: [{msg: mensagens.USUARIO_NAO_ENCONTRADO}]});
        } catch(err) {
            res.status(500).json(err);
        }
    }

    async inserir(req, res) {
        try {
            const erros = validationResult(req);
            
            if(!erros.isEmpty())
                return res.status(422).json({errors: erros.array()});
            
            mongoose.connect(URL_MONGO_DB, {useNewUrlParser: true});

            let newUsuario = new Usuario({
                ...req.body
            })
            newUsuario = await newUsuario.save();
            res.json(newUsuario);
        } catch(err) {
            res.status(500).json(err);
        }
    }

    excluir(req, res) {
        try {
            mongoose.connect(URL_MONGO_DB, {
                useNewUrlParser: true
            });

            Usuario.updateOne({
                _id: mongoose.Types.ObjectId(req.params.id)
            }, {inativo: true}, (err, result) => {
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

    async alterar(req, res) {
        try {
            const erros = validationResult(req);

            if(!erros.isEmpty())
                return res.status(422).json({errors: erros.array()});

            mongoose.connect(URL_MONGO_DB, {useNewUrlParser: true});

            const usuario = {
                ...req.body
            }

            const id = mongoose.Types.ObjectId(req.params.id);
            const result = await Usuario.updateOne({_id: id}, usuario);

            if(result.n == 0)
                return res.status(404).json(result); 

            res.json(result);
        } catch(err) {
            res.status(500).json(err);
        }
    }

    validarPerfil(value) {
        if (value !== "Administrador" && value !== "Normal")
            throw new Error(mensagens.PERFIL_INVALIDO_USUARIO);   

        return true;
    }

}

module.exports = new UsuarioController();