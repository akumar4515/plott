import  express  from "express";
import cors from 'cors';

import { GetData } from "./find.js";
import { connectDb } from "./db.js";



const app=express();
app.use(cors());
app.use (express.json());
app.get('/get',GetData);
connectDb();




app.listen(5000);