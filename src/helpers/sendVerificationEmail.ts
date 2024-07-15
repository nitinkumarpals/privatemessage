import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse"; 

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            throw new Error("API key not set");
        }
        console.log("Sending email to:", email);

        const emailResponse = await resend.emails.send({
            from: 'Private Message <onboarding@resend.dev>',
            to: [email],
            subject: 'Private Message Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });

        console.log("Email response:", emailResponse);

    // Check if the email response contains an error
    if (emailResponse && emailResponse.error) {
        let errorMessage = typeof emailResponse.error === 'string' ? emailResponse.error : JSON.stringify(emailResponse.error);
        throw new Error(errorMessage);
    }
        console.log("Email sent successfully");
        return { success: true, message: "verification email sent successfully" };
    } catch (emailError) {
        console.error("Error sending verification email:", emailError);
        return { success: false, message: "failed to send verification email" };
    }
}
