const mongoose = require('mongoose')

const atendimentoSchema = new mongoose.Schema({
        idPaciente: String,
        nomePaciente: String,
        dataAtendimento: Date,
        quadroGeral: String,
        dataResultado: Date,
        doencas: [{
            nome: String,
            descricao: String,
            planoCuidado: {
                objetivoTerapeutico: String,
                condutas: {
                    medicamento: String,
                    conduta: String,
                },
                scf: String,
                outrasCondutas: String
            },
            farmacoterapias: [{
                medicamento: String,
                posologia: String,
                efetividade: String,
                tempoUso: String,
                seguranca: String,
                dificuldadeUso: String,
                prm : String,
                causaPrm: String,
                conduta: String,
            }],
        }],
})

module.exports = mongoose.model('Atendimento', atendimentoSchema)