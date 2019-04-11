const mongoose = require('mongoose')

const atendimentoSchema = new mongoose.Schema({
        idPaciente: String,
        dataAtendimento: Date,
        quadroGeral: String,
        doencas: [{
            nome: String,
            descricao: String,
            farmacoterapias: [{
                medicamento: String,
                posologia: String,
                efetividade: String,
                tempoUso: String,
                seguranca: String,
                dificuldadeUso: String,
            }],
        }],
        planoCuidado: {
            objetivoTerapeutico: String,
            prm : String,
            causaPrm: String,
            condutas: {
                medicamento: String,
                conduta: String,
            },
            scf: String,
            dataResultado: Date,
            outrasCondutas: String
        }
})

module.exports = mongoose.model('Atendimento', atendimentoSchema)