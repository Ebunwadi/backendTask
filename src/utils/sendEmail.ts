import nodemailer from 'nodemailer'

export default async (email: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
  })
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject,
    text
  }

  await transporter.sendMail(mailOptions)
}
