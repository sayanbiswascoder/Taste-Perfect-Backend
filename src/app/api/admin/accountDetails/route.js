import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyToken } from "@/lib/jwt";

const GET = async (req, res, next) => {
    // Verify the JWT token
    const header = new Headers(req.headers);
    const JWT = header.get('Authorization').split(' ')[1];

    if (!JWT) {
        return NextResponse.json({ error: 'Token is required' }, {status: 401});
    }

    try {
        const decodedToken = verifyToken(JWT);
        const db = await connectDB();
        console.log(decodedToken);
        const user = await db.collection('admins').findOne({ _id: new ObjectId(decodedToken.userId) });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ name: user.name, email: user.email, mobile: user.mobile, superadmin: user.superadmin }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export { GET };
