//Verifica los roles para saber si tiene permisos para acceder a las peticiones
const jwt = require('jwt-simple');
const moment = require('moment');

const checkRole = (req, res, next) => {
    if (!req.headers['user_token'])
        return res.json({
            error: 'You must include the header'
        });

    const token = req.headers['user_token'];
    let payload = null;

    try {
        payload = jwt.decode(token, process.env.TOKEN_KEY);
    } catch (err) {
        return res.json({
            error: 'Invalid token'
        });
    }

    if (moment().unix() > payload.expiresAt) {
        return res.json({ error: 'Expired token' });
    }

    if (payload.rol === 'client') {
        return res.json({ error: 'Necesita permisos de admin' });
    }

    req.idUsuario = payload.idUsuario;
    req.rol = payload.rol;

    next();
}

module.exports = {
    checkRole: checkRole
}