const express = require('express');
const connection = require("../conexion");
const user = require('../model/user');
var router = express.Router();

const middleware = require('./middleware')

const { body, param, validationResult } = require('express-validator');

router.use(middleware.checkToken);

router.get('/users', [], (req, res) => {
    user.getAll(connection, (data => {
        res.json(data);
    }))
});

router.post('/user', (req, res) => {
    let body = req.body;
    user.create(connection, body, (data => {
        res.json(data);
    }));
});

router.get('/user/:correo', [
    param('correo').not().isEmpty().isString(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.json({ success: false, err: JSON.stringify(errors) })
        return
    }
    let correo = req.params.correo;
    user.getByCorreo(connection, correo, (data => {
        res.json(data);
    }))
});

router.get('/salas', [], (req, res) => {
    user.getSalas(connection, (data => {
        res.json(data);
    }))
});

module.exports = router;