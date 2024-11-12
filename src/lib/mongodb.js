import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';


const connectDB = handler = async(req, res) => {
    // let client;
    // let clientPromise;
    
    // if (!global._mongoClientPromise) {
    //   client = new MongoClient(process.env.MONGODB_URI);
    //   global._mongoClientPromise = client.connect();
    // }
    // clientPromise = global._mongoClientPromise;
    // client = await clientPromise;
    // console.log(client)

    // return client.db('taste-perfect');
    const uri = process.env.MONGODB_URI;
    if(mongoose.connections[0].readyState){
        return handler(req,res)
    }
    await mongoose.connect(uri)
    
    return handler(req,res)
}

export default connectDB;