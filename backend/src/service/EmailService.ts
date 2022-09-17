import hbs, { NodemailerExpressHandlebarsOptions } from 'nodemailer-express-handlebars'
import nodemailer from 'nodemailer'
import path from 'path'
import Mail from 'nodemailer/lib/mailer'
import { getEmailTemplate } from '../emailViews/email'

const createTransport = () => nodemailer.createTransport(
    {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        }
    }
);
const baseFilePath = './src/emailViews/'
const resolvedFilePath = path.resolve(baseFilePath)
const createHandlebarOptions: () => NodemailerExpressHandlebarsOptions = () => ({
    viewEngine: {
        partialsDir: resolvedFilePath,
        defaultLayout: false,
    },
    viewPath: path.resolve(resolvedFilePath),
})

export const emailService = {
    sendWelcome: async (email: string) => {
        console.debug(`sending welcome email (email=${email})`)
        const transport = createTransport()
        const handlebarOptions = createHandlebarOptions()
        transport.use('compile', hbs(handlebarOptions))
        const mailOptions: Mail.Options = {
            from: `"Shred Crew" <${process.env.EMAIL_USERNAME}>`,
            to: email,
            subject: 'Welcome to the Shred Crew',
            html: getEmailTemplate(),
        };
        const info = await transport.sendMail(mailOptions);
        console.debug(`email sent (response=${info.response})`)
    },
}

function sleep(ms: number) { return new Promise((resolve) => { setTimeout(resolve, ms); }); }
