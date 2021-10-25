const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { Customer, validateCustomer } = require('../models/customer');

router.get('/', async(req, res) => {
    const customer = await Customer.find().sort('name');
    return res.send(customer);
});

router.post('/', auth, async(req, res) => {
    const {error} = validateCustomer(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }
    const customer = new Customer({
        name: req.body.name,
        isVip: req.body.isVip,
        phone: req.body.phone,
        bonusPoints: 0
    });

    const savedCustomer = await customer.save();
    res.send(savedCustomer);
});

router.put('/:id', auth, async(req, res) => {
    const {error} = validateCustomer(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    const customer = await Customer.findByIdAndUpdate({_id: req.params.id}, {
        name: req.body.name,
        isVip: req.body.isVip,
        phone: req.body.phone
    }, {new: true});

    if(!customer) {
        return res.status(404).send('Berilgan idli customer topilmadi');
    }

    res.send(customer);
});

router.delete('/:id', auth, async(req, res) => {
    const customer = await Customer.findByIdAndRemove({_id: req.params.id});
    if(!customer) {
        return res.status(404).send('Berilgan idli customer topilmadi');
    }
    res.send(customer);
})

module.exports = router;