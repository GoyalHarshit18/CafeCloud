import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: process.env.MAIL_PORT || 587,
    secure: process.env.MAIL_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // Use Gmail App Password
    },
});

export const sendOtpMail = async (to, otp, purpose) => {
    const subject = purpose === 'signup'
        ? 'Verify Your Signup - Odoo Cafe POS'
        : 'Login Verification Code - Odoo Cafe POS';

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h2 style="color: #6366f1; text-align: center;">Odoo Cafe POS</h2>
            <p>Hello,</p>
            <p>Your OTP for <strong>${purpose}</strong> is:</p>
            <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1f2937; border-radius: 5px; margin: 20px 0;">
                ${otp}
            </div>
            <p style="color: #6b7280; font-size: 14px;">This code will expire in 5 minutes. If you did not request this, please ignore this email.</p>
            <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;">
            <p style="text-align: center; color: #9ca3af; font-size: 12px;">&copy; 2026 Odoo Cafe POS. All rights reserved.</p>
        </div>
    `;

    return await sendMail(to, subject, html);
};

export const sendMail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: `"Odoo Cafe POS" <${process.env.MAIL_USER}>`,
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
