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

        let dishes = []
        let i = 1;

        for (const category of Object.keys(restaurant.category)) {
            let t = {
                id: i++,
                category: category.toUpperCase(),
            }
            let item = []
            for (const dish of restaurant.category[category]) {
                let d = await db.collection('dishes').findOne({ _id: new ObjectId(dish) });
                item.push(d)
            }
            t.items = item
            dishes.push(t)
        }

        return NextResponse.json({ data: dishes }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export { POST };
