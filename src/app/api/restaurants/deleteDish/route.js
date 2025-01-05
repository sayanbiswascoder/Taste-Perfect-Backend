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
        const { dishId, category } = await req.json();

        const dish = await db.collection('dishes').deleteOne({ _id: new ObjectId(dishId) });
        console.log(restaurant.category[category.toLowerCase()], category)
        restaurant.category[category.toLowerCase()].splice(restaurant.category[category.toLowerCase()].indexOf(new ObjectId(dishId)), 1);
        await db.collection('restaurants').updateOne({ _id: new ObjectId(restaurant._id) }, { $set: { category: restaurant.category } });


        return NextResponse.json({ dish }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export { POST };
