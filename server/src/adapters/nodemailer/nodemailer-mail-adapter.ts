import { MailAdapter, SendMailData } from '../mail-adapter'
import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '6e05178b537d8d',
      pass: 'd4dcf93bd89390'
    }
})

export class NodemailerMailAdapter implements MailAdapter {
    async sendMail({ subject, body }: SendMailData) {
        await transport.sendMail({
            from: 'Equipe Feedget <oi@feedget.com>',
            to: 'Paulo Fellipe <flipe27paulo@gmail.com>',
            subject,
            html: body
        })
    }
}
