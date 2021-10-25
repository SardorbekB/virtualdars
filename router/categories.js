const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const {validateCategory, Category} = require('../models/category');

router.get('/',  async(req, res) => {
    const category = await Category.find().sort('name');
    return res.send(category);
});

router.post('/', auth, async(req, res) => {
    const { error } = validateCategory(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    const category = new Category({
        name: req.body.name
    });
    
    const savedCategory = await category.save();

    res.send(savedCategory);
});

router.put('/:id', auth, async(req, res) => {
    const { error } = validateCategory(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    const category = await Category.findByIdAndUpdate({_id: req.params.id}, {
        name: req.body.name
    }, {new: true});

    if(!category) {
        
        return res.status(404).send('Berilgan idli category topilmadi');
    }

    res.send(category);
});

router.delete('/:id', auth, admin, async(req, res) => {
    const category = await Category.findByIdAndRemove({_id: req.params.id});
    if(!category) {
        return res.status(404).send('Berilgan idli category topilmadi');
    }

    res.send(category);
});

module.exports = router;