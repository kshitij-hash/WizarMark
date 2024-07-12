import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { identifier, password } = await req.json();

        const user = await UserModel.findOne({
            $or: [
                { email: identifier },
                { username: identifier }
            ]
        })

        if(!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if(!validPassword) {
            return Response.json({
                success: false,
                message: "Invalid credentials"
            }, { status: 400 })
        }

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }

        const token = jwt.sign(
            tokenData, 
            process.env.JWT_SECRET!,
            {
                expiresIn: '5m'
            }
        )

        const response = NextResponse.json({
            success: true,
            message: "Logged in successfully"
        })

        response.cookies.set("token", token , {
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + 1000 * 60 * 5)
        })

        return response;
    } catch (error) {
        console.error("Error logging in: ", error);
        return Response.json({
            success: false,
            message: "Error logging in"
        }, { status: 500 })
    }
}