import nodemailer from "nodemailer";

async function sendEmail({ to, cc, bcc, subject, html, attachments = [] } = {}) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL, // generated ethereal user
            pass: process.env.GMAILPASS, // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"Route Academy" <${process.env.GMAIL}>`, // sender address
        to,
        cc,
        bcc,
        subject,
        html,
        attachments
    });


    return info.rejected.length ? false : true
}



export default sendEmail