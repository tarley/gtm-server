const mongoose = require('mongoose');
const {validationResult} = require('express-validator/check');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const mensagens = require('../utils/Mensagens');

class UsuarioController {

    async login(req, res, next){
        try {
            console.log(req.body)
            const erros = validationResult(req);
            
            if(!erros.isEmpty())
                return res.status(422).json({errors: erros.array()});
            
            mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
            
            // TODO Tarley A senha está em texto plano no banco, devemos mudar para uma criptografia hash
            const query = Usuario.findOne({email: req.body.email, senha: req.body.senha, inativo: false});
            const usuario = await query.exec();
            console.log('Usuário localidado =', usuario);//res.json(usuarios);

            if(usuario) {
                var token = jwt.sign({ id: usuario._id, perfil: usuario.perfil, nome: usuario.nome }, process.env.SECRET, {
                    expiresIn: 60 * 15 // expira em 15 minutos
                });

                res.status(200).send({ auth: true, token: token });
            } else {
                res.status(500).send({ auth: false, msg: 'Login inválido!' });
            }
        } catch(err) {
            res.status(500).json(err);
        }
    }

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

    async inserir(req, res) {
        try {
            const erros = validationResult(req);
            
                if(!erros.isEmpty())
                    return res.status(422).json({errors: erros.array()});
                
                mongoose.connect(process.env.DB_URL, {useNewUrlParser: true});

                const query = Usuario.findOne({email: req.body.email});
                const user = await query.exec();

                // TODO Tarley A senha está em texto plano no banco, devemos mudar para uma criptografia hash
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
                        return res.json(result);
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
        if (value !== "Administrador" && value !== "Normal" && value != "Academico" && value != "Gestor da Instituicao")
            throw new Error(mensagens.PERFIL_INVALIDO_USUARIO);   

        return true;
    } 

}

module.exports = new UsuarioController();