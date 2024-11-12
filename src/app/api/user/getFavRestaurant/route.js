import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import connectDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const GET = async(req, res, next) => {
    // console.log(new Headers(req.headers))
    const header = new Headers(req.headers);
    const JWT = header.get('Authorization').split(' ')[1];

    if (!JWT) {
        return res.status(401).json({ error: 'Token is required' });
    }

    try {
        const decodedToken = verifyToken(JWT);
        const db = await connectDB();
        const user = await db.collection('users').findOne({ _id: new ObjectId(decodedToken.userId) });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ favorite: user.favorite }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export { GET };
