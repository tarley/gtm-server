const mongoose = require('mongoose');
const { validationResult } = require('express-validator/check');

const Atendimento = require('../models/Atendimento');
const Paciente = require('../models/Paciente');
const mensagens = require('../utils/Mensagens');
const perfilUsuario = require('../utils/PerfilUsuario');
class AtendimentoController {

    async buscaUltimoAtendimentoPorIdPaciente(req, res) {
        try {
            mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

            const query = Atendimento.findOne({ idPaciente: req.params.id }).sort({ dataAtendimento: -1 });
            const atendimento = await query.exec();
            res.json(atendimento);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async contaAtendimentosPaciente(req, res){
        try {
            mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

            const query = Atendimento.count({ idPaciente: req.params.id }, function (err, count){
                if(err)
                    console.log(err, count);
            });
            const totAtendimentos = await query.exec();

            if(totAtendimentos == 1)
                res.json(true);
            else
                res.json(false);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async filtraAtendimentos(req, res) {
        try {
            mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
            const filtroAtendimento = req.body;
            const query = Atendimento.find().sort({ dataAtendimento: -1 });

            if (filtroAtendimento) {
                if (filtroAtendimento.criterioBusca == 'CPF' && filtroAtendimento.cpf) {
                    const queryPaciente = Paciente.findOne({ cpf: filtroAtendimento.cpf });
                        const paciente = await queryPaciente.exec();
                        if (paciente && paciente.nome) {
                            query.where('nomePaciente', paciente.nome);
                        } else {
                            query.where('nomePaciente', '');
                        }
                } else if(filtroAtendimento.criterioBusca == 'Nome' && filtroAtendimento.nomePaciente) {
                    query.where('nomePaciente').regex('.*' + filtroAtendimento.nomePaciente + '.*');
                }
                 
                if (filtroAtendimento.dataInicial) {
                    query.where('dataAtendimento').gte(new Date(filtroAtendimento.dataInicial));
                }
                if (filtroAtendimento.dataFinal) {
                    let dataFinal = new Date(filtroAtendimento.dataFinal);
                    dataFinal = dataFinal.setDate(dataFinal.getDate() + 1);
                    query.where('dataAtendimento').lte(dataFinal);
                }
            }

            const atendimentos = await query.exec();

            res.json(atendimentos);

        } catch (err) {
            res.status(500).json(err);
        }
    }

    async consultar(req, res) {
        try {
            mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

            const query = Atendimento.find().sort({ dataAtendimento: -1 }).limit(50);
            const atendimentos = await query.exec();
            res.json(atendimentos);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async consultarPorId(req, res) {
        try {
            mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

            const query = Atendimento.findById(req.params.id);
            const atendimentos = await query.exec();

            if (atendimentos)
                res.json(atendimentos);
            else
                res.status(404).json({ errors: [{ msg: mensagens.ATENDIMENTO_NAO_ENCONTRADO }] });
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async inserir(req, res) {
        try {
            const erros = validationResult(req);

            const idPaciente = req.body.idPaciente;
            const query = Paciente.findOne({ _id: idPaciente });

            const paciente = await query.exec();
            
            if(!paciente.ativo){
                return res.status(400).json({ errors: [{ msg: mensagens.ATENDIMENTO_PACIENTE_INATIVO }] });
            }   

            if (!erros.isEmpty())
                return res.status(422).json({ errors: erros.array() });

            mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

            let newAtendimento = new Atendimento({
                ...req.body,
                idInstituicao: req.idInstituicao,
                criadoPor: req.idUsuario,
                criadoEm: new Date()
            })
            newAtendimento = await newAtendimento.save();
            res.json(newAtendimento);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    excluir(req, res) {
        try {
            mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

            Atendimento.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }, (err, result) => {
                if (err)
                    return res.status(500).json({ errors: [{ ...err }] });

                if (result.deletedCount == 0)
                    return res.status(404).json(result);

                return res.json(result);
            });
        } catch (err) {
            res.status(500).json(err);
        }
    }

    validaAtributoDoenca(doencas, atributo) {
        doencas.forEach(doenca =>
            doenca.farmacoterapias.forEach(farmacoterapia => {
                if (!farmacoterapia[atributo]) {
                    throw new Error(this.formataNomeAtributo(atributo) + ' deve ser informado');
                }
            })
        )
        return true;
    }

    formataNomeAtributo(titulo) {
        const primeiroCaractere = titulo.substring(0, 1);
        return titulo.replace(primeiroCaractere, primeiroCaractere.toUpperCase());
    }

    async alterar(req, res) {
        try {
            const erros = validationResult(req);

            if (!erros.isEmpty())
                return res.status(422).json({ errors: erros.array() });

            mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

            const id = mongoose.Types.ObjectId(req.params.id);
            const query = Atendimento.findOne({ _id: id });

            const atend = await query.exec();
            
            if(req.perfilUsuario !== perfilUsuario.ADMINISTRADOR && req.idInstituicao !== atend.idInstituicao) {
                res.status(401).json({message: mensagens.ERRO_ALTERAR_INSTITUICAO_DIFERENTE_REGISTRO});
            }

            if (atend && atend.finalizado == true) {
                res.status(400).json({ errors: [{ msg: mensagens.ERRO_ALTERAR_ATENDIMENTO_FINALIZADO }] });
            }

            const atendimento = {
                ...req.body,
                alteradoPor: req.idUsuario,
                alteradoEm: new Date()
            }

            const result = await Atendimento.updateOne({ _id: id }, atendimento);

            if (result.n == 0)
                return res.status(404).json(result);

            res.json(result);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async finalizaAtendimento(req, res) {
        try {
            mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

            const id = mongoose.Types.ObjectId(req.params.id);

            const query = Atendimento.findOne({ _id: id });

            const atend = await query.exec();
            if (atend && atend.finalizado == true) {
                res.status(400).json({ errors: [{ msg: mensagens.ATENDIMENTO_JA_FINALIZADO }] });
            }

            const result = await Atendimento.updateOne({ _id: id }, { finalizado: true });

            if (result.n == 0)
                return res.status(404).json(result);

            res.json(result);
        } catch (err) {
            res.status(500).json(err);
        }
    }

}

module.exports = new AtendimentoController();