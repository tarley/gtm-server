const mongoose = require('mongoose')

const pacienteSchema = new mongoose.Schema({
    nome: String,
    cpf: String,
    sexo: String,
    dataNascimento: Date,
    estadoCivil: String,
    anosEstudo: Number,
    telefone: Number,
    profissao: String,
    endereco: String,

    dadosComplementares: {
        profissionalServico: String,
        lugarAtendimento: String,
        ubs: String,
        acessoServico: String,
        motivoConsulta: String
    },

    habitosVida: {
        atividadeFisica: Boolean,
        terapiaAlternativa: String,
        alertas: String,

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
        peso: Number,
        altura: Number,
        imc: Number
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