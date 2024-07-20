import nodemailer from 'nodemailer';
import { ApiResponse } from "@/types/ApiResponse";
import { render } from '@react-email/components';
import VerificationEmail from '../../emails/VerificationEmail';
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",// Replace with your SMTP server details
    port: 465,
    secure: true, // Use `true` for port 465, `false` for other ports
    auth: {
        user: process.env.EMAIL_USER, // Replace with your SMTP user
        pass: process.env.EMAIL_PASS, // Replace with your SMTP password
    },
});

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        console.log("Sending email to:", email);

        // Generate the HTML content for the email
        const emailHtml = render(VerificationEmail({ username, otp: verifyCode }));

        // Send mail with defined transport object
        const info = await transporter.sendMail({
            from: "Private Message", // Replace with your sender address
            to: email,
            subject: 'Private Message Verification Code',
            html: emailHtml,
        });

        console.log("Email sent successfully:", email);
        return { success: true, message: "Verification email sent successfully" };
    } catch (emailError) {
        console.error("Error sending verification email:", emailError);
        return { success: false, message: "Failed to send verification email" };
    }
}
