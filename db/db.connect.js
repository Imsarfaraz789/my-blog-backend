import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB = async () => {
  try {
    await mongoose.connect(process.env.DB);
    console.log("Connected");
  } catch (error) {
    console.log("Db connection db");
  }
};

export default DB;
