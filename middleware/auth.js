const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next) {
    const token = req.header('x-auth2-token');
    if(!token)
        return res.status(401).send('Token bo`lmaganligi uchun murojaat rad etildi');

    try {
        const decoded = jwt.verify(token, config.get('jwtKey'));
        req.user = decoded;
        next();
    }
    catch(ex) {
        res.status(400).send('Yaroqsiz token');
    }
}

module.exports = auth;