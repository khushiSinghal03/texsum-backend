import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed");
    process.exit(1);
  }
};

export default connectDB;