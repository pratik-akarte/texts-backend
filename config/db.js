import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `Mongodb connected on port: ${conn.connection.host}`.cyan.underline
    );
  } catch (error) {
    console.error(`Mongodb connection error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

export default connectDB;