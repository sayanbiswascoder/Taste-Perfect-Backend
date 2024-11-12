import { MongoClient } from 'mongodb';


const connectDB = async() => {
    let client;
    let clientPromise;
    
    if (!global._mongoClientPromise) {
      client = new MongoClient(process.env.MONGODB_URI);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
    client = await clientPromise;
    console.log(client)
    return client.db('taste-perfect');
}

export default connectDB;