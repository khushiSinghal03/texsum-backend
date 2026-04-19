import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Replace with your Gmail
    pass: 'your-app-password'    // Replace with the 16-character App Password
  }
});

export const sendOtpEmail = async (to: string, otp: string) => {
  const mailOptions = {
    from: '"TexSum AI" <no-reply@texsum.com>',
    to,
    subject: 'Your 6-Digit Verification Code',
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #0d9488;">Verification Code</h2>
        <p>Your 6-digit code for <b>TexSum AI</b> is:</p>
        <h1 style="letter-spacing: 5px; color: #111; font-size: 32px;">${otp}</h1>
        <p style="color: #ef4444; font-size: 12px;">This code will expire in 10 minutes.</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};