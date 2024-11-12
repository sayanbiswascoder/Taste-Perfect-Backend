import { NextResponse } from "next/server";

const GET = async (req, res, next) => {
    const header = new Headers(req.headers);
    const JWT = header.get('Authorization').split(' ')[1];

    if (!JWT) {
        return NextResponse.json({ error: 'Token is required' }, { status: 401});
    }

    try {
        const decodedToken = verifyToken(JWT);
        const db = await connectDB();
        const user = await db.collection('admins').findOne({ _id: new ObjectId(decodedToken.userId) });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const orders = await db.collection('orders').find({}).toArray();
        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500});
    }
}

export { GET }