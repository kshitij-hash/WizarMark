import mongoose from 'mongoose';

import dotenv from 'dotenv';

dotenv.config();


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.o3y0dz5.mongodb.net/WizarMark`
        );

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (e) {
        console.log(`Error: ${e.message}`);
        process.exit(1);
    }
}

export default connectDB;


