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

router.get('/sala/:id', [
    param('id').not().isEmpty().isNumeric(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.json({ success: false, err: JSON.stringify(errors) })
        return
    }
    let id = req.params.id;
    user.getIdSala(connection, id, (data => {
        res.json(data);
    }))
});

router.get('/verReservaciones/:id', [
    param('id').not().isEmpty().isNumeric(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.json({ success: false, err: JSON.stringify(errors) })
        return
    }
    let id = req.params.id;
    user.getReservacionIdSala(connection, id, (data => {
        res.json(data);
    }))
});

router.post('/reservacion', (req, res) => {
    let body = req.body;
    body.idUsuario = req.idUsuario;
    user.createReservacion(connection, body, (data => {
        res.json(data);
    }));
});

router.put('/updSala', [], (req, res) => {
    let body = req.body;
    user.updateSala(connection, body, (data => {
        res.json(data);
    }))
});

router.delete('/reservacion/:id', [
    param('id').not().isEmpty().isNumeric()
], (req, res) => {
    const errors = validationResult(req);
    let params = req.params;
    console.log(params);
    if (!errors.isEmpty()) {
        res.json({ success: false, err: JSON.stringify(errors) })
        return
    }
    user.deleteReservacion(connection, params, (data => {
        res.json(data);
    }))
});

module.exports = router;