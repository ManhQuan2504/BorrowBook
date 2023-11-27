import mailer from "../utils/mailer.js"

const SendMail_register = async (message) => {
    try {
        console.log(message.email);
        const subject = "Hello ✔";
        const html = `Hello ${message.email},
        Register Success!
        `;
        await mailer(message.email, subject, html); // Sửa email thành message.email

        return {
            status: "OK"
        }
    } catch (error) {
        return {
            status: "ERR",
            error: error.message,
        }
    }
};

const SendMail_borrowBook = async (message) => {
    try {
        console.log("123:", message.email);
        const subject = "Hello ✔";
        const html = `Hello ${message.email},
        Borrow Success!
        `;

        await mailer(message.email, subject, html); // Sửa email thành message.email

        return {
            status: "OK"
        }
    } catch (error) {
        return {
            status: "ERR",
            error: error.message,
        }
    }
}

const SendMail_return = async (message) => {
    try {
        console.log(message.email);
        const subject = "Hello ✔";

        const html = `Hello ${message.email},
        Retunr Success!
        `;

        await mailer(message.email, subject, html); // Sửa email thành message.email

        return {
            status: "OK"
        }
    } catch (error) {
        return {
            status: "ERR",
            error: error.message,
        }
    }
}



export default {
    SendMail_register,
    SendMail_borrowBook,
    SendMail_return
}