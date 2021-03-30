const express = require('express');
const connection = require("./conexion");
const cors = require('cors');
const misrutas = require('./routes/rutas');
const misrutasT = require('./routes/rutasToken');
const misrutasAdmin = require('./routes/rutasAdmin');
const PORT = process.env.PORT || 3000;

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', misrutas);
app.use('/', misrutasT);
app.use('/', misrutasAdmin);

//Check connect
connection.connect((err, res) => {
    if (err) {
        console.log(err)
        console.log('Error de conexion con sql')
        return;
    }
    console.log('Conexion exitosa a la base de datos')
});

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`))