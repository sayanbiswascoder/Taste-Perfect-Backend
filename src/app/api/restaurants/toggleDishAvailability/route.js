import { verifyToken } from "@/lib/jwt";
import connectDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const POST = async (req, res, next) => {
    const header = new Headers(req.headers);
    const JWT = header.get('Authorization').split(' ')[1];


    if (!JWT) {
        return NextResponse.json({ error: 'Token is required' }, { status: 401 });
    }

    try {
        const decodedToken = verifyToken(JWT);
        const db = await connectDB();
        const restaurant = await db.collection('restaurants').findOne({ _id: new ObjectId(decodedToken.userId) });

        if (!restaurant) {
            return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
        }

        const { dishId, toggleTo } = await req.json();
        console.log(dishId, toggleTo);

        const dish = await db.collection('dishes').findOneAndUpdate(
            { _id: new ObjectId(dishId) },
            { $set: { available: toggleTo } },
            { returnOriginal: false }
        );

        return NextResponse.json({ dish }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export { POST };
