import dbConnect from "@/lib/dbConnect";
import WaitlistUserModel from "@/model/WaitlistUser";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { email } = await request.json()

        const existingUser = await WaitlistUserModel.findOne({
            email
        })

        if(existingUser) {
            return Response.json({
                success: false,
                message: 'User already registered for waitlist'
            }, { status: 400 })
        } else {
            const newUser = new WaitlistUserModel({email})
            await newUser.save()

            return Response.json({
                success: true,
                message: 'User registered for waitlist'
            }, { status: 201 })
        }
    } catch (error) {
        console.error('Error registering user for waitlist', error);
        return Response.json({
            success: false,
            message: 'Error registering user for waitlist'
        }, { status: 500})
    }
}