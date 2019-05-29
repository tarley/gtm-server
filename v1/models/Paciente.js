const mongoose = require('mongoose')

const pacienteSchema = new mongoose.Schema({
    ativo: {
        type: Boolean,
        default: true
    },
    motivoInativo: String,
    nome: String,
    cpf: {
        type: String,
        unique: true
    },
    sexo: String,
    dataNascimento: Date,
    estadoCivil: String,
    anosEstudo: Number,
    telefone: Number,
    profissao: String,

    dadosComplementares: {
        informacoesGerais: String,
        profissionalServico: String,
        lugarAtendimento: String,
        ubs: String,
        acessoServico: String,
        motivoConsulta: String,
        endereco: String,
    },

    habitosVida: {
        terapiaAlternativa: String,
        alertas: String,

        atividadeFisica: {
            pratica: Boolean,
            observacaoAtividadeFisica: String
        },

        cigarro: {
            fumante: Boolean,
            observacaoCigarro: String
        },

        bebidaAlcoolica: {
            consome: Boolean,
            observacaoBebidaAlcoolica: String
        }
    },

    dadosAntropometricos: {
        peso: {
            type: Number,
            min: 0,
        },
        altura: {
            type: Number,
            min: 0,
        },
        imc: {
            type: Number,
            min: 0,
        }
    },

    rotina: {
        acorda: String,
        cafedaManha: String,
        lanchedaManha: String,
        almoco: String,
        lanchedaTarde: String,
        jantar: String,
        dorme: String,
        observacaoRotina: String
    }

})

module.exports = mongoose.model('Paciente', pacienteSchema)