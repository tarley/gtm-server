const mongoose = require('mongoose');
const { validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const mensagens = require('../utils/Mensagens');
const perfilUsuario = require('../utils/PerfilUsuario');
const bcrypt = require('bcrypt');

class UsuarioController {

    verificarToken(req, res, next) {
        const token = req.headers['x-access-token'];
        if (!token)
            return res.status(401).send({ auth: false, message: mensagens.TOKEN_NAO_INFORMADO });

        jwt.verify(token, process.env.SECRET, function (err, decoded) {
            if (err)
                return res.status(401).send({ auth: false, message: mensagens.TOKEN_INVALIDO });

            req.idUsuario = decoded.id;
            req.perfilUsuario = decoded.perfil;
            req.nomeUsuario = decoded.nome
            req.idInstituicao = decoded.idInstituicao;

            if (req.route.path === '/token')
                res.send({ auth: true });
            else
                next();
        });
    }

    validarPerfilAdministrador(req, res, next) {
        if (req.perfilUsuario === perfilUsuario.ADMINISTRADOR)
            next();
        else
            res.status(401).send({ auth: false, message: mensagens.NAO_AUTORIZADO });
    }

    validarPerfilGestorInstituicao(req, res, next) {
        if (req.perfilUsuario === perfilUsuario.ADMINISTRADOR || req.perfilUsuario === perfilUsuario.GESTOR_INSTITUICAO)
            next();
        else
            res.status(401).send({ auth: false, message: mensagens.NAO_AUTORIZADO });
    }

    validarPerfilProfissionalSaude(req, res, next) {
        if (req.perfilUsuario === perfilUsuario.ADMINISTRADOR || req.perfilUsuario === perfilUsuario.GESTOR_INSTITUICAO || req.perfilUsuario === perfilUsuario.PROFISSIONAL_SAUDE)
            next();
        else
            res.status(401).send({ auth: false, message: mensagens.NAO_AUTORIZADO });
    }

    async login(req, res, next) {
        try {
            const erros = validationResult(req);

            if (!erros.isEmpty())
                return res.status(422).json({ errors: erros.array() });

            const query = Usuario.findOne({ email: req.body.email, inativo: false });
            const usuario = await query.exec();

            if (usuario && await UsuarioController.isSenhaValida(usuario.senha, req.body.senha)) {
                var token = jwt.sign({ id: usuario._id, perfil: usuario.perfil, nome: usuario.nome, idInstituicao: usuario.idInstituicao }, process.env.SECRET, {
                    expiresIn: 60 * 60 * 24
                });

                res.status(200).send({ auth: true, token: token });
            } else {
                res.status(500).send({ auth: false, msg: mensagens.LOGIN_INVALIDO });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async redefinirSenha(req, res) {
        try {
            const erros = validationResult(req);

            if(!erros.isEmpty())
                return res.status(422).json({ errors: erros.array() });
            
            if(req.body.novaSenha !== req.body.confNovaSenha) {
                res.status(422).json({ errors: [{ msg: mensagens.USUARIO_SENHA_CONFIRMACAO_DIFERENTE }] });
                return;
            }

            const usuario = await Usuario.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
            
            if(usuario) {
                if(!await UsuarioController.isSenhaValida(usuario.senha, req.body.senhaAntiga)) {
                    res.status(422).json({ errors: [{ msg: mensagens.USUARIO_SENHA_ANTIGA_DIFERENTE }] });
                    return;
                }
                
                await Usuario.updateOne({_id: mongoose.Types.ObjectId(req.params.id)}, {senha: await UsuarioController.criptografadaSenha(req.body.novaSenha) });
                res.json({msg: mensagens.USUARIO_SENHA_REDEFINIDA})

            } else {
                res.status(404).json({ errors: [{ msg: mensagens.USUARIO_NAO_ENCONTRADO }] });
                return;
            }

        } catch(err) {
            console.log(err);
            res.status(500).json(err);
        }
    }

    async consultar(req, res) {
        try {
            const query = Usuario.find({ inativo: false });

            if(req.perfilUsuario !== perfilUsuario.ADMINISTRADOR) {
                query.where('idInstituicao', req.idInstituicao);
                
                if(req.perfilUsuario === perfilUsuario.GESTOR_INSTITUICAO)
                    query.where('perfil').in([perfilUsuario.PROFISSIONAL_SAUDE, perfilUsuario.ACADEMICO]);
                else if(req.perfilUsuario === perfilUsuario.PROFISSIONAL_SAUDE)
                    query.where('perfil', perfilUsuario.ACADEMICO);
            }

            let usuarios = await query.exec();

            usuarios = UsuarioController.limpaSenhaUsuarios(usuarios);

            res.json(usuarios);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }

    async consultarPorId(req, res) {
        try {
            const query = Usuario.findById(req.params.id);
            let usuario = await query.exec();

            if (usuario) {
                if(req.perfilUsuario !== perfilUsuario.ADMINISTRADOR && usuario.idInstituicao !== req.idInstituicao) {
                    res.status(401).json({message: mensagens.ERRO_CONSULTAR_OUTRA_INSTITUICAO});
                }
                usuario = UsuarioController.limpaSenhaUsuarios(usuario);
                res.json(usuario);
            }
            else
                res.status(404).json({ errors: [{ msg: mensagens.USUARIO_NAO_ENCONTRADO }] });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }

    static limpaSenhaUsuarios(usuarios) {
        if(Array.isArray(usuarios)) {
            for(let usuario of usuarios) {
                usuario.senha = null;
            }
        } else {
            usuarios.senha = null
        }
        
        return usuarios;
    }

    consultarPerfis(req, res) {
        res.json([perfilUsuario.ADMINISTRADOR, perfilUsuario.GESTOR_INSTITUICAO, perfilUsuario.PROFISSIONAL_SAUDE, perfilUsuario.ACADEMICO]);
    }

    async inserir(req, res) {
        try {
            const erros = validationResult(req);

            if (!erros.isEmpty())
                return res.status(422).json({ errors: erros.array() });

            const query = Usuario.findOne({ email: req.body.email });
            const user = await query.exec();

            if (user && user.inativo == true) {
                const result = await Usuario.updateOne(
                    {
                        _id: mongoose.Types.ObjectId(user._id)
                    },
                    {
                        nome: req.body.nome,
                        senha: await UsuarioController.criptografadaSenha(req.body.senha),
                        perfil: req.body.perfil,
                        inativo: false,
                        alteradoPor: req.idUsuario,
                        alteradoEm: new Date()
                    }
                );

                if (result.n == 0) {
                    return res.status(404).json(result);
                }

                return res.json(result);
            } else {
                let newUsuario = new Usuario({
                    ...req.body,
                    senha: await UsuarioController.criptografadaSenha(req.body.senha),
                    criadoPor: req.idUsuario,
                    criadoEm: new Date(),
                })

                newUsuario = await newUsuario.save();
                res.json(newUsuario);
            }
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    }

    async excluir(req, res) {
        try {
            const id = mongoose.Types.ObjectId(req.params.id);

            const query = Usuario.findOne({ _id: id });

            const user = await query.exec();

            if(req.perfilUsuario !== perfilUsuario.ADMINISTRADOR && req.idInstituicao !== user.idInstituicao) {
                res.status(401).json({message: mensagens.ERRO_EXCLUIR_INSTITUICAO_DIFERENTE_REGISTRO})
            }

            if (user && user.inativo == true) {
                res.status(400).json({ errors: [{ msg: mensagens.USUARIO_JA_INATIVO }] });
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

            if (result.n == 0)
                return res.status(404).json(result);

            res.json(result);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async alterar(req, res) {
        try {
            const erros = validationResult(req);

            if (!erros.isEmpty())
                return res.status(422).json({ errors: erros.array() });

            const id = mongoose.Types.ObjectId(req.params.id);
            
            if(req.perfilUsuario !== perfilUsuario.ADMINISTRADOR) {
                const usuarioEncontrado = await Usuario.findOne({ _id: id});
                if(req.idInstituicao !== usuarioEncontrado.idInstituicao) {
                    res.status(401).json({message: mensagens.ERRO_ALTERAR_INSTITUICAO_DIFERENTE_REGISTRO});
                }
            }
            
            const usuario = {
                ...req.body,
                alteradoPor: req.idUsuario,
                alteradoEm: new Date()
            }
            delete usuario.senha;
            const result = await Usuario.updateOne({ _id: id }, usuario);

            if (result.n == 0)
                return res.status(404).json(result);

            res.json(result);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }

    static async criptografadaSenha(senha) {
        return await bcrypt.hash(senha, 10);
    }

    static async isSenhaValida(senhaBanco, senha) {
        return await bcrypt.compare(senha, senhaBanco);
    }

    validarPerfil(value) {
        if (value !== perfilUsuario.ADMINISTRADOR && 
            value !== perfilUsuario.GESTOR_INSTITUICAO && 
            value != perfilUsuario.PROFISSIONAL_SAUDE && 
            value != perfilUsuario.ACADEMICO)
            throw new Error(mensagens.PERFIL_INVALIDO_USUARIO);

        return true;
    }
}

module.exports = new UsuarioController();