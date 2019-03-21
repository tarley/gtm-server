const mongoose = require('mongoose');
const server = '127.0.0.1:27017'; // REPLACE WITH YOUR DB SERVER
const database = 'gtm';      // REPLACE WITH YOUR DB NAME

class UsuarioRepository {
    constructor() {
        mongoose.connect(`mongodb://${server}/${database}`).then(() => {
            console.log('Database connection successful')
        })
        .catch(err => {
            console.error('Database connection error')
        })
    }

    
}

module.exports = new UsuarioRepository()