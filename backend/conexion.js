//Conexion a la base de datos
const mysql = require('mysql');
module.exports = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ornelas0299',
    database: 'salasdejuntas'
});