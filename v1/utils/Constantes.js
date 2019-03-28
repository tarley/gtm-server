const server = '127.0.0.1:27017'; // REPLACE WITH YOUR DB SERVER
const database = 'gtm';      // REPLACE WITH YOUR DB NAME

module.exports = {
    URL_MONGO_DB: `mongodb://${server}/${database}`
}