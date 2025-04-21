import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();
import { PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "./emailTemplate.js";

// create transporter in nodemailer
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

export const sendVerificationEmail = async (email, code) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify your email',
        html: `${VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', code)}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error sending email:", error);
        }
        console.log("Email sent:", info.response);
    });
};
export const sendWelcomeEmail = async (email, name) => {
    const mailOptions = {
        from: 'blogcompany@gmail.com',
        to: email,
        subject: 'Welcome to our platform',
        html: WELCOME_EMAIL_TEMPLATE.replace('{name}', name)
        .replace('{clientUrl}', process.env.CLIENT_URL),
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error sending email:", error);
        }
        console.log("Email sent:", info.response);
    });
}
export const sendResetPasswordEmail = async (email, token) => {
    const mailOptions = {
        from: 'blogcompany@gmail.com',
        to: email,
        subject: 'Reset your password',
        html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', token),
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            console.log("Error sending email:", error);
        }
        console.log("Email sent:", info.response);
    });
};