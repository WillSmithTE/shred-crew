import hbs, { NodemailerExpressHandlebarsOptions } from 'nodemailer-express-handlebars'
import nodemailer from 'nodemailer'
import path from 'path'

const createTransport = () => nodemailer.createTransport(
    {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        }
    }
);
const createHandlebarOptions: () => NodemailerExpressHandlebarsOptions = () => ({
    viewEngine: {
        partialsDir: path.resolve('./src/emailViews/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./src/emailViews/'),
})

export const emailService = {
    sendWelcome: async (email: string) => {
        console.debug(`sending welcome email (email=${email})`)
        const transport = createTransport()
        const handlebarOptions = createHandlebarOptions()
        transport.use('compile', hbs(handlebarOptions))
        const mailOptions = {
            from: `"Shred Crew" <${process.env.EMAIL_USERNAME}>`,
            to: email,
            subject: 'Welcome to the Shred Crew',
            template: 'email',
            context: {
                // name: "Adebola", // replace {{name}} with Adebola
            },
            // attachments: [{
            //     filename: 'icon.png',
            //     path: `./src/emailViews/icon.png`,
            //     cid: 'icon'
            // }],
        };
        const info = await transport.sendMail(mailOptions);
        console.debug(`email sent (response=${info.response})`)
    },
}

function sleep(ms: number) { return new Promise((resolve) => { setTimeout(resolve, ms); }); }
