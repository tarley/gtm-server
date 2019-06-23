const mongoose = require('mongoose');
const {validationResult} = require('express-validator/check');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const mensagens = require('../utils/Mensagens');

const Administrador = 'Administrador';
const GestorInstituicao = 'Gestor da Instituição';
const ProfissionalSaude = 'Profissional Saúde';
const Academico = 'Acadêmico';

class UsuarioController {

    verificarToken(req, res, next){
        const token = req.headers['x-access-token'];
        if (!token)
            return res.status(401).send({ auth: false, message: mensagens.TOKEN_NAO_INFORMADO });
        
        jwt.verify(token, process.env.SECRET, function(err, decoded) {
            if (err) 
                return res.status(401).send({ auth: false, message: mensagens.TOKEN_INVALIDO });
            
            req.idUsuario = decoded.id;
            req.perfilUsuario = decoded.perfil;
            req.nomeUsuario = decoded.nome
            req.idInstituicao = decoded.idInstituicao;

            if(req.route.path === '/token')
                res.send({ auth: true });
            else
                next();
        });
    }

    validarPerfilAdministrador(req, res, next) {
        if (req.perfilUsuario === Administrador)
            next();
        else
            res.status(401).send({ auth: false, message: mensagens.NAO_AUTORIZADO });
    }

    validarPerfilGestorInstituicao(req, res, next) {
        if (req.perfilUsuario === Administrador || req.perfilUsuario === GestorInstituicao)
            next();
        else
            res.status(401).send({ auth: false, message: mensagens.NAO_AUTORIZADO });
    }

    validarPerfilProfissionalSaude(req, res, next) {
        if (req.perfilUsuario === Administrador || req.perfilUsuario === GestorInstituicao || req.perfilUsuario === ProfissionalSaude)
            next();    
        else
            res.status(401).send({ auth: false, message: mensagens.NAO_AUTORIZADO });
    }

    async login(req, res, next){
        try {
            const erros = validationResult(req);
            
            if(!erros.isEmpty())
                return res.status(422).json({errors: erros.array()});
            
            mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
            
            // TODO Tarley A senha está em texto plano no banco, devemos mudar para uma criptografia hash
            const query = Usuario.findOne({email: req.body.email, senha: req.body.senha, inativo: false});
            const usuario = await query.exec();
            
            if(usuario) {
                var token = jwt.sign({ id: usuario._id, perfil: usuario.perfil, nome: usuario.nome, idInstituicao: usuario.idInstituicao }, process.env.SECRET, {
                    expiresIn: 60 * 60 * 24 // expira em 15 minutos
                });

                res.status(200).send({ auth: true, token: token });
            } else {
                res.status(500).send({ auth: false, msg: mensagens.LOGIN_INVALIDO });
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

    consultarPerfis(req, res) {
        res.json([Administrador, GestorInstituicao, ProfissionalSaude, Academico]);
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
                        {
                            _id: mongoose.Types.ObjectId(user._id)
                        },
                        {
                            nome: req.body.nome,
                            senha: req.body.senha,
                            perfil: req.body.perfil,
                            inativo: false,
                            alteradoPor: req.idUsuario,
                            alteradoEm: new Date()
                        }
                    );

                    if(result.n == 0){
                        return res.status(404).json(result);
                    }

                    return res.json(result);
                }else{
                    let newUsuario = new Usuario({
                        ...req.body,
                        criadoPor: req.idUsuario,
                        criadoEm: new Date(),
                        idInstituicao: req.idInstituicao
                    })
        
                    newUsuario = await newUsuario.save();
                    res.json(newUsuario);
                }
        } catch(err) {
            console.log(err)
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

            const result = await Usuario.updateOne(
                {
                    _id: id
                }, 
                {
                    inativo: true,
                    alteradoPor: req.idUsuario,
                    alteradoEm: new Date()
                }
            );

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
                ...req.body,
                alteradoPor: req.idUsuario,
                alteradoEm: new Date()
            }

            const id = mongoose.Types.ObjectId(req.params.id);

            const result = await Usuario.updateOne({_id: id}, usuario);

            if(result.n == 0)
                return res.status(404).json(result); 

            res.json(result);
        } catch(err) {
            console.log(err);
            res.status(500).json(err);
        }
    }

    validarPerfil(value) {
        if (value !== "Administrador" && value !== "Profissional Saude" && value != "Academico" && value != "Gestor da Instituicao")
            throw new Error(mensagens.PERFIL_INVALIDO_USUARIO);   

        return true;
    }
}

module.exports = new UsuarioController();