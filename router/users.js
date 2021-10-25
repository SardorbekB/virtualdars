const express = require('express');
const router = express.Router();
const { User, validateUser } = require('../models/user');
const lodash = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const path = require('path');

router.use("/", express.static(path.join(__dirname, "../public")));

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.get('/', async (req, res) => {
    res.render('register');
});

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send('Bu foydalanuvchi bazada majud');
    }
    user = new User(lodash.pick(req.body, ['userName', 'email', 'password']));
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);

    await user.save()
        .then(() => {
            res.redirect('/api/auth');
        })
        .catch((err) => {
            res.send('Xato yuz berdi...');
        });
});

module.exports = router;