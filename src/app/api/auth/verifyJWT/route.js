import connectDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

const POST = async(req, res) => {
    const { type, token } = await req.json();

    if (!token) {
        return NextResponse.json({ error: 'Token is required' }, { status: 401 });
    }
    try {
        const decodedToken = await verifyToken(token);
        console.log(token, decodedToken);
        const db = await connectDB();
        const user = await db.collection(type).findOne({ _id: new ObjectId(decodedToken.userId) });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ user });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export { POST };