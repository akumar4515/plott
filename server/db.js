import { MongoClient } from "mongodb";
import { Insert } from "./insert.js";


const url="mongodb+srv://amankumar22200245:amankumar22200245@cluster0.sfr2htr.mongodb.net/?retryWrites=true&w=majority";
const db="aman1";
const coll="aman1db";

const conn=new MongoClient(url);
export const connectDb=async()=>{
    try{
       const client= await conn.connect();
        console.log('connected to db');
        const dbo=conn.db(db);
        const collection=dbo.collection(coll);
        if (!coll) {
            throw new Error(`Collection '${collection}' not found`);
        }
        console.log('connected to collection');

        return { client,dbo,collection};

    }
    catch(error){
        console.error(error);
    }
 Insert();

};