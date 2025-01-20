const mongoose = require('mongoose');

exports.connectDb = async ()=>{
    await mongoose.connect(`${process.env.DB_URL}/hacker-attack`)
    .then(()=>{
        console.log("Database connected successfully");
    })
    .catch((err)=>{
        console.log("Failed to connect db");
    });

}