// insert.js

import { connectDb } from "./db.js";
import fs from 'fs';

const data = 'jsondata.json';

export const Insert = async () => {
  try {
    const {client, collection } = await connectDb();
    await client.connect();
 

    const jsonData = JSON.parse(fs.readFileSync(data, 'utf8'));

    // Extract IDs from jsonData
    const dataIds = jsonData.map(item => item.id);

    // Find existing documents based on the IDs
    const existingData = await collection.find({ id: { $in: dataIds } }).toArray();

    if (existingData.length > 0) {
      console.log('Data already exists, skipping insertion');
    } else {
      const insert = await collection.insertMany(jsonData);
      console.log('Inserted');
    }
  } catch (err) {
    console.error(err);
  } 
};





