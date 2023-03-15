const { Schema, model } = require("mongoose");
const Joi = require("joi");

const contactShema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
        match:/\(\d{3}\) \d{3}-\d{4}/,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
},
    { versionKey: false, timestamps: true });

const addSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    favorite: Joi.boolean(),
  
});

const favoriteSchema = Joi.object({
     favorite: Joi.boolean().required()
})

 
contactShema.post("save", (error, data, next) => {
    error.status = 400;
    console.log(error.status)
    next()
    })

const Contact = model("contact", contactShema);

module.exports = {
    Contact,
    addSchema,
    favoriteSchema
}