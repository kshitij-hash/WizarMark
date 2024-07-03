import mongoose, { Schema, Document } from "mongoose";

export interface WaitlistUser extends Document {
    email: string;
}

const WaitlistUserSchema: Schema<WaitlistUser> = new Schema({
    email: { 
        type: String, 
        required: [true, 'Email is required'], 
        unique: true,
        match: [/.+\@.+\..+/, 'Please use a valid email address']
    }
})

const WaitlistUserModel = 
    (mongoose.models.WaitlistUser as mongoose.Model<WaitlistUser>) ||
    mongoose.model<WaitlistUser>('WaitlistUser', WaitlistUserSchema)

export default WaitlistUserModel;