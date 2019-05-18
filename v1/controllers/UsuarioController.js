const mongoose = require('mongoose');
const {validationResult} = require('express-validator/check');
const Usuario = require('../models/Usuario');
const mensagens = require('../utils/Mensagens');

class UsuarioController {

    async consultar(req, res) {
        try {
            mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

            const query = Usuario.find({inativo: false});
            const usuarios = await query.exec();
            res.json(usuarios);
        } catch(err) {
            res.status(500).json(err);
        }
    }

    async consultarPorId(req, res) {
        try {
            mongoose.connect(process.env.DB_URL, {useNewUrlParser: true});
            
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

    async consultarPorEmail(req, res){
        try {                
            mongoose.connect(process.env.DB_URL, {useNewUrlParser: true});

            const query = Usuario.findOne({email: req.params.email});
            const user = await query.exec();

            const alt = mongoose.Types.ObjectId(user._id);
            
            if(user && user.inativo == true){
                res.json(alt);
            }else
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
                
                mongoose.connect(process.env.DB_URL, {useNewUrlParser: true});

                const query = Usuario.findOne({email: req.params.email});
                const user = await query.exec();

                if(user && user.inativo == true){
                    const result = await Usuario.updateOne(
                        {_id: mongoose.Types.ObjectId(user._id)},
                        {nome: req.body.nome,
                         senha: req.body.senha,
                         instituicao: req.body.instituicao,
                         perfil: req.body.perfil,
                         inativo: false});

                        if(result.n == 0){
                            return res.status(404).json(result);
                        }
                        res.json(result);
                }else{
                    let newUsuario = new Usuario({
                        ...req.body
                    })
        
                    newUsuario = await newUsuario.save();
                    res.json(newUsuario);
                }
        } catch(err) {
            res.status(500).json(err);
        }
    }

    async excluir(req, res) {
        try {
            mongoose.connect(process.env.DB_URL, {useNewUrlParser: true});
            const id = mongoose.Types.ObjectId(req.params.id);

            const query = Usuario.findOne({_id: id});
            
            const user = await query.exec();

            if(user && user.inativo == true) {
                res.status(400).json({errors: [{msg: mensagens.USUARIO_JA_INATIVO}]});
            }

            const result = await Usuario.updateOne({_id: id}, {inativo: true});

            if(result.n == 0)
                return res.status(404).json(result); 

            res.json(result);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async alterar(req, res) {
        try {
            const erros = validationResult(req);

            if(!erros.isEmpty())
                return res.status(422).json({errors: erros.array()});

            mongoose.connect(process.env.DB_URL, {useNewUrlParser: true});

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
        if (value !== "Administrador" && value !== "Normal" && value != "Academico")
            throw new Error(mensagens.PERFIL_INVALIDO_USUARIO);   

        return true;
    } 

}

module.exports = new UsuarioController();