import dotenv from'dotenv';
dotenv.config();

import './config.js'
import express from'express';
import cors from'cors';
import cookieParser from 'cookie-parser'
import db from'./utils/db.js';
import userRoutes from "./routes/user.route.js"



//dotenv.config();
const app = express()
const port = process.env.PORT || 4000;
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({
     origin: "http://localhost:3000",
     credentials: true,
     methods: ['GET', 'POST', 'PUT', 'DELETE'],
     allowedHeaders: ['Content-Type', 'Authorization']
}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/api/v1/users", userRoutes);



db();
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)

})
