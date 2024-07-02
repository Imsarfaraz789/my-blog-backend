import express from "express";
import dotenv from "dotenv";
import db from "./db/db.connect.js";
import router from "./routes/router.js";
import cors from "cors";

const app = express();
dotenv.config();
const port = process.env.PORT || 5000;

// app.use(cors())
app.use(
  cors({
    origin: "https://my-blog-backend-0s7a.onrender.com",
    methods: ["GET", "POST", "UPDATE", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

// parse json
app.use(express.json());

// use router file
app.use(router);

// database connection
db();

app.listen(process.env.PORT, () => {
  console.log(`server is running  port ${port}`);
});
