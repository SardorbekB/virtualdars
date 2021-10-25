const mongoose = require('mongoose');
const Joi = require('joi');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Category = mongoose.model("Category", categorySchema);

function validateCategory(category) {
    const schema = Joi.object({
        name: Joi.string().required().min(5).max(50)
    });

    const result = schema.validate({
        name: category.name
    });

    return result;
}

module.exports.Category = Category;
module.exports.validateCategory = validateCategory;