import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
    dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    // We have converted the user to a string in src/app/api/auth/[...nextauth]/options.ts
    //const userId = user._id?.toString(); it will have problem in aggregation pipeline
    if(!session || !session.user){
        return Response.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    
    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            {$unwind: "$messages"},
            {$sort: { "messages.createdAt": -1 }},
            {$group: { _id: "$_id", messages: { $push: "$messages" } }}
        ])

        if(!user || user.length === 0){
            return Response.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        return Response.json({ success: true, messages: user[0].messages }, { status: 200 });
    } catch (error) {

        console.log("An unexpected error occurred while getting messages", error);
        return Response.json({ success: false, message: 'Failed to get messages' }, { status: 500 });
    }


}