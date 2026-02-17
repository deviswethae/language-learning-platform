const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string from the environment variable
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // Ensures the parser for MongoDB URLs is set correctly
      useUnifiedTopology: true, // Ensures the new connection management engine is used
    });

    // If connected successfully, log the host of the MongoDB connection
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If there's an error, log the error message and exit the process
    console.error(`❌ Error: ${error.message}`);
    process.exit(1); // Exit the process with failure code
  }
};

module.exports = connectDB;
