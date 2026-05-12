import './config.js'
import express from'express';
import cors from'cors';
import dotenv from'dotenv';
import db from'./utils/db.js';
import userRoutes from "./routes/user.route.js"



//dotenv.config();
const app = express()
const port = process.env.PORT || 4000;
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
     origin: "*",
     methods: ['GET', 'POST', 'PUT', 'DELETE'],
     allowedHeaders: ['Content-Type', 'Authorization']
}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/api/v1/users", userRoutes);

dotenv.config();

db();
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)

})
