//Rutas a las que solo tiene permiso el admin
const express = require('express');
const connection = require("../conexion");
const user = require('../model/user');
var router = express.Router();

const middlewareRol = require('./middleware_roles');

const { body, param, validationResult } = require('express-validator');

router.use(middlewareRol.checkRole);

router.post('/sala', (req, res) => {
    let body = req.body;
    req.body.ocupada = 0;
    user.createSala(connection, body, (data => {
        res.json(data);
    }));
});

router.get('/salasDisponibles', [], (req, res) => {
    user.getSalasDisponibles(connection, (data => {
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

router.delete('/sala/:id', [
    param('id').not().isEmpty().isNumeric()
], (req, res) => {
    const errors = validationResult(req);
    let params = req.params;
    if (!errors.isEmpty()) {
        res.json({ success: false, err: JSON.stringify(errors) })
        return
    }
    user.deleteSala(connection, params, (data => {
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

router.put('/sala', [], (req, res) => {
    let body = req.body;
    body.ocupada = 0;
    user.updateSala(connection, body, (data => {
        res.json(data);
    }))
});

module.exports = router;