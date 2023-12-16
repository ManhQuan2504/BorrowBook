import nodemailer from 'nodemailer';

const sendMail = (to, subject, htmlContent) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false, // Bạn đang sử dụng cổng 587 nên không cần secure: true
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        }
    });

    const mailOptions = {
        from: {
            name: process.env.MAIL_FROM_NAME, 
            address: process.env.MAIL_FROM_ADDRESS,
        },
        to,
        subject,
        html: htmlContent,
    };

    return transporter.sendMail(mailOptions);
};

export default sendMail;
