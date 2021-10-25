const mongoose = require('mongoose');
const Joi = require('joi');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        trim: true
    },
    category: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            }
        }),
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    trainer: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["Active", "InActive"]
    },
    fee: {
        type: Number,
        required: true
    }
});

const Course = mongoose.model('Course', courseSchema);

function validateCourse(course) {
    const schema = Joi.object({
        title: Joi.string().required().min(5).max(50),
        categoryId: Joi.string().required(),
        tags: Joi.array().items(Joi.string()),
        status: Joi.string(),
        fee: Joi.number().required()
    });
    const result = schema.validate({
        title: course.title,
        categoryId: course.categoryId,
        tags: course.tags,
        status: course.status,
        fee: course.fee
    });
    return result;
}

module.exports.Course = Course;
module.exports.validateCourse = validateCourse;