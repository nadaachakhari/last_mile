// emailConfig.js

const nodemailer = require('nodemailer');

// Configurer le transporteur SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    //port: 587,
    port: 465,
    secure: true, // true pour le port 465, false pour les autres ports
    auth: {
        user: 'menyarbenali101@gmail.com', 
        pass: 'owfm mfyk rtqk orto'
    }
});

// Fonction pour envoyer un email
const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: {
                address: process.env.EMAIL,
                name: "Last mile delivery",
            },
            to,
            subject,
            text
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendEmail };
