//Funciones para las peticiones a la base de datos
module.exports = {

    getAll: (connection, callback) => {
        connection.query('select * from usuario', (err, results) => {
            if (err) {
                callback({ array: null, id: null, success: false, err: JSON.stringify(err) });
                return;
            }
            callback({ array: results, id: null, success: true });
        })
    },

    create: (connection, body, callback) => {
        connection.query('insert into usuario SET  ?', body, (err, results) => {
            if (err) {
                callback({ array: null, id: null, success: false, err: JSON.stringify(err) });
                return;
            }
            callback({ array: results, id: null, success: true });
        });
    },

    getByCorreo: (connection, correo, callback) => {
        connection.query(`select * from usuario where correo = '${correo}'`, (err, results) => {
            if (err) {
                callback({ array: null, id: null, success: false, err: JSON.stringify(err) });
                return;
            }
            callback({ array: null, id: results || null, success: true });
        })
    },

    createSala: (connection, body, callback) => {
        connection.query('insert into salas SET ?', body, (err, results) => {
            if (err) {
                callback({ array: null, id: null, success: false, err: JSON.stringify(err) });
                return;
            }
            callback({ array: null, id: null, success: true });
        });
    },

    deleteSala: (connection, body, callback) => {
        connection.query(`delete from salas where id = '${body.id}'`, (err, results) => {
            if (err) {
                callback({ array: null, id: null, success: false, err: JSON.stringify(err) });
                return;
            }
            callback({ array: null, id: null, success: true });
        })
    },

    updateSalas: (connection, body, callback) => {
        connection.query('update salas set nombre = ?, ocupada = ?, imagen = ? WHERE id = ? ', [body.nombre, body.ocupada, body.imagen, body.id], (err, results) => {
            if (err) {
                callback({ array: null, id: null, success: false, err: JSON.stringify(err) });
                return;
            }
            callback({ array: null, id: null, success: true });
        });
    },

    getSalas: (connection, callback) => {
        connection.query('select * from salas', (err, results) => {
            if (err) {
                callback({ array: null, id: null, success: false, err: JSON.stringify(err) });
                return;
            }
            callback({ array: results, id: null, success: true });
        })
    },

    getSalasDisponibles: (connection, callback) => {
        connection.query('select * from salas where ocupada = 0', (err, results) => {
            if (err) {
                callback({ array: null, id: null, success: false, err: JSON.stringify(err) });
                return;
            }
            callback({ array: results, id: null, success: true });
        })
    },

    getIdSala: (connection, id, callback) => {
        connection.query('select * from salas where id = ' + id, (err, results) => {
            if (err) {
                callback({ array: null, id: null, success: false, err: JSON.stringify(err) });
                return;
            }
            callback({ array: null, id: results || null, success: true });
        })
    },

    getReservacionIdSala: (connection, id, callback) => {
        connection.query('select * from reservacion where idSala = ' + id, (err, results) => {
            if (err) {
                callback({ array: null, id: null, success: false, err: JSON.stringify(err) });
                return;
            }
            callback({ array: null, id: results || null, success: true });
        })
    },
    
    createReservacion: (connection, body, callback) => {
        connection.query('insert into reservacion SET  ?', body, (err, results) => {
            if (err) {
                callback({ array: null, id: null, success: false, err: JSON.stringify(err) });
                return;
            }
            callback({ array: results, id: null, success: true });
        });
    },

    updateSala: (connection, body, callback) => {
        connection.query('update salas set nombre = ?, ocupada = ?, imagen = ? WHERE id = ? ', [body.nombre, body.ocupada, body.imagen, body.id], (err, results) => {
            if (err) {
                callback({ array: null, id: null, success: false, err: JSON.stringify(err) });
                return;
            }
            callback({ array: null, id: null, success: true });
        });
    },

    deleteReservacion: (connection, body, callback) => {
        connection.query(`delete from reservacion where id = '${body.id}'`, (err, results) => {
            if (err) {
                callback({ array: null, id: null, success: false, err: JSON.stringify(err) });
                return;
            }
            callback({ array: null, id: null, success: true });
        })
    },
}