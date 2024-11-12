const { NextResponse } = require("next/server");
import { verifyToken } from "@/lib/jwt";
import connectDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const GET = async(req, res, next) => {
    // console.log(new Headers(req.headers))
    const header = new Headers(req.headers);
    const JWT = header.get('Authorization').split(' ')[1];

    if (!JWT) {
        return NextResponse.json({ error: 'Token is required' }, { status: 401 });
    }

    try {
        const decodedToken = verifyToken(JWT);
        const db = await connectDB();
        const user = await db.collection('users').findOne({ _id: new ObjectId(decodedToken.userId) });
        
        if (!user || !user.orders) {
            return NextResponse.json({ error: 'User or Orders not found' }, { status: 404 });
        }

        const orders = user.orders.map(order => 
            db.collection('orders').findOne({ _id: new ObjectId(order) })
        )
        return NextResponse.json({ ...orders }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export { GET };
