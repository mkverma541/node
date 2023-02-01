const dotenv = require('dotenv');
dotenv.config({ path: './config.env' })
const mongoose = require('mongoose');
const env = process.env;
const port = process.env.PORT || 3000;

const app = require('./app');

let connection = `${env.DB_CONNECTION}://${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`;

if (env.DB_SRV && env.DB_SRV != '') {
    connection = env.DB_SRV
}

mongoose.connect(connection, {
    useNewUrlParser: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
    useUnifiedTopology: true
})

mongoose.connection.on('error', () => console.log('Connection error !'));
mongoose.connection.on('open', () => console.log('Connected to mongo sever.'))

mongoose.Promise = Promise;

module.exports = {
    mongoose,
    connection
}


app.listen(port, () => {
    console.log(`Server running at port ${port}....`)
})