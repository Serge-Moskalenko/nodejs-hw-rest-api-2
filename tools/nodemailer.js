const nodemailer = require("nodemailer");
const { BASE_URL, META_PASSWORD } = process.env;

const nodemailerConfig = {
    host: "smtp.meta.ua",
    port: 465,
    secure: true,
    auth: {
        user: "serhiimoskalenko@meta.ua",
        pass: META_PASSWORD,
    }
};

const transport = nodemailer.createTransport(nodemailerConfig);

const makeVerifyEmail = (email,veryficationCode) => {
    return {
        to: email,
        from: "serhiimoskalenko@meta.ua",
        subject: 'Verify email',
        // html: "<p>test</p>",
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${veryficationCode} >Click Here</a>`
    };
};

const transporter = (email,verificationCode) => {
     transport.sendMail(makeVerifyEmail(email,verificationCode))
        .then(() => console.log("success"))
        .catch(err =>console.log(err));
}

module.exports = {
    transporter
}