import mongoose, {Schema, Document} from "mongoose";

export interface Bookmark extends Document {
    faviconUrl: string;
    title: string;
    url: string;
    tags: string[];
    dateAdded: number;
}

const BookmarkSchema: Schema<Bookmark> = new Schema({
    faviconUrl: {
        type: String, 
        required: true
    },
    title: {
        type: String, 
        required: true
    },
    url: {
        type: String, 
        required: true
    },
    tags: {
        type: [String], 
        required: true
    },
    dateAdded: {
        type: Number,
        required: true
    }
})

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiration: Date;
    isVerified: boolean;
    bookmarks: Bookmark[];
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String, 
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String, 
        required: [true, "Email is required"],
        unique: true,
        match: [/.+\@.+\..+/, "Please use a valid email address"]
    },
    password: {
        type: String, 
        required: [true, "Password is required"]
    },
    verifyCode: {
        type: String, 
        required: [true, "Verification code is required"]
    },
    verifyCodeExpiration: {
        type: Date, 
        required: [true, "Verification code expiration date is required"]
    },
    isVerified: {
        type: Boolean, 
        default: false
    },
    bookmarks: [BookmarkSchema]
})

const UserModel = 
    (mongoose.models.User as mongoose.Model<User>) || 
    mongoose.model<User>("User", UserSchema);

export default UserModel;