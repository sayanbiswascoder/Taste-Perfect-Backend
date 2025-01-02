import connectDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const POST = async (req, res) => {
    const { id } = await req.json();

    if (!id) {
        return NextResponse.json({ error: 'Rastaurant ID is required' }, { status: 401 });
    }

    const db = await connectDB();
    const restaurant = await db.collection('restaurants').findOne({ _id: new ObjectId(id) });

    if (!restaurant) {
        return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    let dishes = []

    for (const catagory of Object.keys(restaurant.catagory)){
        let t = {
            catagory: catagory,
        }
        let item = []
        for (const dish of restaurant.catagory[catagory]){
            let d = await db.collection('dishes').findOne({ _id: new ObjectId(dish) });
            item.push(d)
        }
        t.items = item
        dishes.push(t)
    }

    return NextResponse.json({ data: dishes }, { status: 200 });
}



export { POST };
