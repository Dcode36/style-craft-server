const mongoose = require('mongoose');

const connectDB = async () =>{
    try {   
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`connected to MONGODB data base ${conn.connection.host}`)
    } catch (error) {
        console.log(`ERROR in MONGODB ${error}`);
    }
};


module.exports = connectDB;