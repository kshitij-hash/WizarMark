import { getDataFromToken } from "@/helpers/getDataFromToken"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    await dbConnect();
    
    const userId = await getDataFromToken(request);
    const user = await UserModel.findOne({ _id: userId }).select("-password")
    console.log(user)

    if(!user) {
        return Response.json({
            success: false,
            message: "User not found"
        }, { status: 404 })
    }

    return Response.json({
        success: true,
        messsage: "User found",
        data: user
    }, { status: 200 })
}