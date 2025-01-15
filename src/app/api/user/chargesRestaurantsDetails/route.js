import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getDistance } from 'geolib';
import { ObjectId } from "mongodb";

const POST = async (req, res, next) => {
    const data = await req.json();

    if (!data) {
        return NextResponse.json({ error: 'Data is required' }, { status: 400 });
    }

    // Process data and return response
    const db = await connectDB();
    const restaurantCollection = await db.collection('restaurants');
    const restaurant = await restaurantCollection.findOne({ _id: new ObjectId(data.restaurantId) });
    if (!restaurant) {
        return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    // calculating distance between restaurant and user
    const distance = getDistance(restaurant.location.coordinates, JSON.parse(data.address).coordinates, 1);
    console.log(distance)

    return NextResponse.json({
        restaurant: restaurant,
        charges: 20,
        deliveryFee: (distance / 1000) * 10 < 30 ? 30 : (distance / 1000) * 10
    }, { status: 200 });
};

export { POST };
