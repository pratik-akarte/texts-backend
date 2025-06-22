const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `Mongodb connected on port: ${conn.connection.host}`.cyan.underline
    );
  } catch (error) {
    console.error(`Mongodb connection error:  ${error.message}`.red.bold);
    process.exit(1);
  }
};

module.exports = connectDB;
