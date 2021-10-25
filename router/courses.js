const express = require('express');
const router = express.Router();
const {Course, validateCourse} = require('../models/course');
const {Category} = require('../models/category');
const auth = require('../middleware/auth');

router.get('/', async(req, res) => {
    const course = await Course.find().sort('title');
    return res.send(course);
});

router.post('/', auth, async(req, res) => {
    const {error} = validateCourse(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    const category = await Category.findById(req.body.categoryId);
    if(!category) {
        return res.status(404).send('Berilgan idli category topilmadi');
    }
    const course = new Course({
        title: req.body.title,
        category: {
            _id: category._id,
            name: category.name
        },
        tags: req.body.tags,
        trainer: req.body.trainer,
        status: req.body.status,
        fee: req.body.fee
    });

    const savedCourse = await course.save();
    res.send(savedCourse);
});

router.put('/:id', auth, async(req, res) => {
    const {error} = validateCourse(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }
    const category = await Category.findById(req.body.categoryId);
    if(!category) {
        return res.status(404).send('Berilgan idli category topilmadi');
    }

    const course = await Course.findByIdAndUpdate({_id: req.params.id}, {
        title: req.body.title,
        category: {
            _id: category._id,
            name: category.name
        },
        trainer: req.body.trainer,
        status: req.body.status,
        tags: req.body.tags,
        fee: req.body.fee
    }, {new: true});
    if(!course) {
        return res.status(404).send('Berilgan idli customer topilmadi');
    }

    res.send(course);
}); 


router.delete('/:id', auth, async(req, res) => {
    const course = await Course.findByIdAndRemove({_id: req.params.id});
    if(!course) {
        return res.status(404).send('Berilgan idli course topilmadi');;
    }
    res.send(course);
})

module.exports = router;