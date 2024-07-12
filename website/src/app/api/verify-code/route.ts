import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { verifySchema } from "@/schemas/verifySchema";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { username, code } = await req.json();
        const decodedUsername = decodeURIComponent(username);
        const result = verifySchema.safeParse({ code });

        if(!result.success) {
            const codeErrors = result.error.format().code?._errors || [];
            return Response.json({
                success: false,
                message: codeErrors?.length > 0 ? codeErrors.join(', ') : "Invalid code"
            }, { status: 400 })
        }

        const user = await UserModel.findOne({ username: decodedUsername })

        if(!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiration) > new Date();

        if(isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();

            return Response.json({
                success: true,
                message: "User verified successfully"
            }, { status: 200 })
        } else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Code has expired, please sign up again to get a new code"
            }, { status: 400 })
        } else {
            return Response.json({
                success: false,
                message: "Invalid verification code"
            }, { status: 400 })
        }
    } catch (error) {
        console.error("Error verifying code: ", error);
        return Response.json({
            success: false,
            message: "Error verifying code"
        }, { status: 500 })
    }
}