const express = require('express');
const router = express.Router();
const Joi = require('joi');
const {User} = require('../models/user');
const bcrypt = require('bcrypt');
const { application } = require('express');
const path = require('path');


router.use("/",express.static(path.join(__dirname, "../public")));

router.get('/', async(req, res) => {
    res.render('login');
});

router.post('/', async(req, res) => {
    const {error} = validateAuth(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    const user = await User.findOne({email: req.body.email});
    if(!user) {
        return res.status(400).send('Email yoki parol xato');
    }
    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if(!isValidPassword) {
        return res.status(400).send('Email yoki parol xato');
    }
    const token = user.generateToken();
    res.header('x-auth2-token', token).send(true);
});


function validateAuth(auth) {
    const schema = Joi.object({
        email: Joi.string().required().min(5).max(50).email(),
        password: Joi.string().required().min(5).max(1024)
    });
    const result = schema.validate(auth);
    return result;
}


module.exports = router;