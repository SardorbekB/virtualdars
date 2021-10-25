const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    isVip: {
        type: Boolean,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    bonusPoints: {
        type: Number
    }
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().required().min(5).max(50),
        isVip: Joi.boolean().required(),
        phone: Joi.string().required()
    });
    const result = schema.validate({
        name: customer.name,
        isVip: customer.isVip,
        phone: customer.phone
    });
    return result;
}

module.exports.Customer = Customer;
module.exports.validateCustomer = validateCustomer;