import nodemailer from 'nodemailer';

const sendEmail = async (email, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',  // You can use any email provider
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mail = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: subject,
        html: text,
    })
    console.log(mail);
    return mail;
}

export default sendEmail;
