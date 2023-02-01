const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const env = process.env;
const nodemailer = require("nodemailer");

const sendEmail = async(email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: env.HOST,
            // service: env.SERVICE,
            port: 2525,
            secure: false,
            auth: {
                user: env.USER,
                pass: env.PASS,
            },
            tls: {
                ciphers: 'SSLv3'
            }
        });

        await transporter.sendMail({
            from: "Mathematical pathshala <mathematicalpathshala@gmail.com>",
            to: 'Mukesh <mkverma541@gmail.com>',
            subject: 'subject',
            text: 'text'
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;