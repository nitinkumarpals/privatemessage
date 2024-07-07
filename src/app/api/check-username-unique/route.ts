import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { userNameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: userNameValidation
});

export async function POST (request: Request) {
    await dbConnect();

}