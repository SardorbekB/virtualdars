const mongoose = require('mongoose');
const Joi = require('joi');

const enrollmentSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlenth: 5,
                maxlength: 50,
                trim: true
            }
        }),
        required: true
    },
    course: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            }
        }),
        required: true
    },
    dataStart: {
        type: Date,
        default: Date.now
    },
    courseFee: {
        type: Number,
        required: true
    }
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

function validateEnrollment(enrollment) {
    const schema = Joi.object({
        customerId: Joi.string().required(),
        courseId: Joi.string().required()
    });
    const result = schema.validate({
        customerId: enrollment.customerId,
        courseId: enrollment.courseId
    });
    return result;
}

module.exports.Enrollment = Enrollment;
module.exports.validateEnrollment = validateEnrollment;