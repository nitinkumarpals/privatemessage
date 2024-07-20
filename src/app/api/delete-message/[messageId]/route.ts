import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function DELETE(request: Request, { params }: { params: { messageId: string } }) {
    const messageId = params.messageId;
    dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    // We have converted the user to a string in src/app/api/auth/[...nextauth]/options.ts
    //const userId = user._id?.toString(); it will have problem in aggregation pipeline
    if(!session || !session.user){
        return Response.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }
    
    try {
        const updateResult = await UserModel.updateOne(
            { _id: user._id },
            {$pull : {messages: {_id: messageId}}}
        )
        if(updateResult.modifiedCount === 0){
            return Response.json({ success: false, message: 'Message not found or already deleted' }, { status: 500 });
        }
        return Response.json({ success: true, message: 'Message deleted successfully' }, { status: 200 });
    } catch (error) {
        console.log("Error to delete message:", error);
        
        return Response.json({ success: false, message: 'Failed to delete message' }, { status: 500 });
    }

    
}
