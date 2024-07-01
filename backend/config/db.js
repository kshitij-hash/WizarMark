const mongoose = require('mongoose');
require('dotenv').config();
//console.log(process.env);

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

module.exports = connectDB;


//mongodb+srv://Wizarmark:<password>@cluster0.o3y0dz5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0