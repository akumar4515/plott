import { connectDb } from "./db.js";


export const GetData=async(req,res)=>{
    const { client,collection}=await connectDb();
    try{

        const find=await collection.find({}).toArray();
        res.json(find);


    }
    catch(err){
        console.log(err);
    }
    finally{
        await client.close();
    }
   
};

