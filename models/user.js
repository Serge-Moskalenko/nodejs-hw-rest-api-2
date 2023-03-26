const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { mongooseError } = require("../helpers");

const emailRegular = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        match:emailRegular,
        required: true,
        unique:true,
    },
    password: {
        type: String,
        minlength: 6,
        required:true,
    },
    subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
    token: {
        type: String,
        default:null
    },
    avatarURL: {
        type: String,
        required:true,
    },
    verify: {
        type: Boolean,
        default:false,
    },
    verificationCode: {
        type: String,
        default:"",
    }

}, { versionKey: false, timestamps: true });

userSchema.post("save", mongooseError);

const registerShema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().pattern(emailRegular).required(),
    password: Joi.string().min(6).required(),
});

const loginShema = Joi.object({
    email: Joi.string().pattern(emailRegular).required(),
    password: Joi.string().min(6).required(),
});

const repeatedEmail=Joi.object({email: Joi.string().pattern(emailRegular).required(),})

const User = model("user", userSchema);

module.exports = {
    User,
    loginShema,
    registerShema,
    repeatedEmail
};