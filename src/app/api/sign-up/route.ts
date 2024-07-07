import { NextResponse } from 'next/server';
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();
    try {
        console.log("Request received");

        const { username, email, password } = await request.json();
        console.log("Parsed request body:", { username, email, password });

        const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true });
        console.log("Checked for existing username:", existingUserVerifiedByUsername);

        if (existingUserVerifiedByUsername) {
            console.log("Username already exists and is verified");
            return NextResponse.json(
                { success: false, message: "username already exists" }, { status: 400 }
            );
        }

        const existingUserVerifiedByEmail = await UserModel.findOne({ email });
        console.log("Checked for existing email:", existingUserVerifiedByEmail);

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("Generated verification code:", verifyCode);

        if (existingUserVerifiedByEmail) {
            if (existingUserVerifiedByEmail.isVerified) {
                console.log("Email already exists and is verified");
                return NextResponse.json(
                    { success: false, message: "email already exists" }, { status: 400 }
                );
            } else {
                console.log("Email exists but is not verified, updating user with new verification code");
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserVerifiedByEmail.password = hashedPassword;
                existingUserVerifiedByEmail.verifyCode = verifyCode;
                existingUserVerifiedByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserVerifiedByEmail.save();
            }
        } else {
            console.log("Creating new user");
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: []
            });

            await newUser.save();
        }

        console.log("Sending verification email");
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        console.log("Email response:", emailResponse);

        if (!emailResponse.success) {
            console.log("Failed to send verification email");
            return NextResponse.json(
                { success: false, message: "failed to send verification email" }, { status: 500 }
            );
        }

        console.log("User created successfully");
        return NextResponse.json(
            { success: true, message: "user created successfully" }, { status: 200 }
        );

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { success: false, message: "failed to create user" }, { status: 500 }
        );
    }
}
