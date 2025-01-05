import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

const POST = async (req, res, next) => {
    const { dishes } = await req.json();
    console.log(dishes);

    if (!dishes) {
        return NextResponse.json({ error: 'Dishes are required' }, { status: 400 });
    }

    try {
        const db = await connectDB();
        const dishesDetails = await Promise.all(dishes.map(async dishId => {
            const dish = await db.collection('dishes').findOne({ _id: new ObjectId(dishId) });
            return dish;
        }));

        return NextResponse.json({ dishes: dishesDetails }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Error connecting to the database' }, { status: 500 });
    }
};

export { POST };
