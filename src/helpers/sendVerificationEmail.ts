import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse"; 

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        console.log("Sending email to:", email);
        await resend.emails.send({
            from: 'Private Message <onboarding@resend.dev>',
            to: [email],
            subject: 'Private Message Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        console.log("Email sent successfully");
        return { success: true, message: "verification email sent successfully" };
    } catch (emailError) {
        console.error("Error sending verification email:", emailError);
        return { success: false, message: "failed to send verification email" };
    }
}
