const mongoose = require("mongoose")
 async function connectDB() {
      try {
        await mongoose.connect(process.env.MONGODB_URI,{
            serverSelectionTimeoutMS: 10000
        });
        console.log('MongoDB Connected!');
      } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1); // Exit process with failure
      }
    }

    module.exports = connectDB

   