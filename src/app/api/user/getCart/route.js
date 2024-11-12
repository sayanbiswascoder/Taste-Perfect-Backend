import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import connectDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const GET = async (req, res, next) => {
    const header = new Headers(req.headers);
    const JWT = header.get('Authorization').split(' ')[1];

    if (!JWT) {
        return NextResponse.json({ error: 'Token is required' }, { status: 401 });
    }

    try {
        const decodedToken = verifyToken(JWT);
        const db = await connectDB();
        const user = await db.collection('users').findOne({ _id: new ObjectId(decodedToken.userId) });

        if (!user || !user.cart) {
            return NextResponse.json({ error: 'User not found or cart is empty' }, { status: 404 });
        }
        const dishColloction = await db.collection('dishes');

        console.log(user.cart)
        
        const cart = user.cart.map(async (item) => {
            let dish = await dishColloction.findOne({ _id: item[0] })
            dish.quantity = item[1];
            return dish;
        });
        const result = await Promise.all(cart).then((cart) =>{
            return cart;
        })
        
        return NextResponse.json(result , { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
};

export { GET };
