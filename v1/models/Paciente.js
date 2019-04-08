const mongoose = require('mongoose')

const pacienteSchema = new mongoose.Schema({
    nome: String,
    cpf: String,
    sexo: String,
    dataNascimento: String,
    estadoCivil: String,
    anosEstudo: Number,
    telefone: String,
    profissao: String,

    // dadosComplementares: {
    //     profissionalServico: String,
    //     lugarAtendimento: String,
    // },

    // habitosVida: {
    //     atividadeFisica: String,
    //     terapiaAlternativa: String,
    //     alerta: String,

    //     cigarro: {
    //         fumante: Boolean,
    //         observacao: String
    //     },

    //     bebidasAlcolicas: {
    //         consume: Boolean,
    //         observacao: String
    //     }        
    // }
})

module.exports = mongoose.model('Paciente', pacienteSchema)