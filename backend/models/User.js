import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
    },
    password: {
        type: String,
        default: ""
    },
    bookmarks: [
        {
            title: {
                type: String,
                default: ""
            },
            link: {
                type: String,
                default: ""
            },
            favicon: {
                type: String,
                default: ""
            },
        }
    ],
    createdAt: {
        type: Number,
        default: Date.now()
    }
});


UserSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};


const User = mongoose.model("User", UserSchema);
export default User;