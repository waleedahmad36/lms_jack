import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/db.js";
import cookieParser from "cookie-parser";
import userAuthRoutes from "./routes/userAuthRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import cors from "cors";
dotenv.config();



const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",  // Frontend URL
    credentials: true,  // Allow credentials (cookies)
  })
);
app.use(express.json({limit:"50mb"}));   //will allow us to parse req.body
app.use(cookieParser());

app.use('/api/v1/auth',userAuthRoutes);
app.use('/api/v1/course',courseRoutes);



app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  connectDB();
});

