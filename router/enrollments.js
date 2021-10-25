const express = require('express');
const { Enrollment, validateEnrollment } = require('../models/enrollment');
const router = express.Router();
const {Course} = require('../models/course');
const {Customer} = require('../models/customer');
const auth = require('../middleware/auth');

router.get('/', async(req, res) => {
    const enrollment = await Enrollment.find().sort('-dateStart');
    res.send(enrollment);
});

router.post('/', auth, async(req, res) => {
    const { error } = validateEnrollment(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }
    const customer = await Customer.findById(req.body.customerId);
    const course = await Course.findById(req.body.courseId);
    if(!customer) {
        return res.status(404).send('Berilgan idli customer topikmadi');
    }
    if(!course) {
        return res.status(404).send('Berilgan idli course topilmadi');
    }

    const enrollment = new Enrollment({
        customer: {
            _id: customer._id,
            name: customer.name
        },
        course: {
            _id: course._id,
            title: course.title
        },
        courseFee: course.fee
    });

    if(customer.isVip) {
        enrollment.courseFee = 0.8 * enrollment.courseFee
    }
    const savedEnrollment = await enrollment.save();
    customer.bonusPoints++;
    await customer.save();
    res.send(enrollment);

});


module.exports = router;