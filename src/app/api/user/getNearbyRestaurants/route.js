import { ObjectId } from 'mongodb';
import { getDistance } from 'geolib';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

const MAX_DISTANCE = 20; // 20 km
const INITIAL_DISTANCE = 10; // 10 km
const DISTANCE_INCREMENT = 5; // 5 km


/**
 * Find nearest restaurants
 */
const POST = async (req, res) => {
    const { latitude, longitude } = await req.json();

    if (!latitude || !longitude) {
        return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 401 });
    }

    const coordinates = [parseFloat(longitude), parseFloat(latitude)];
    let distance = INITIAL_DISTANCE;

    let restaurants = [];

    while (distance <= MAX_DISTANCE) {
        restaurants = await findRestaurantsWithinDistance(coordinates, distance);

        if (restaurants.length > 0) {
            break;
        }

        distance += DISTANCE_INCREMENT;
    }

    if (restaurants.length === 0) {
        return NextResponse.json({ error: 'No restaurants found within 20 km' }, { status: 404 });
    }

    // Calculate distance from user to each restaurant
    restaurants = await calculateDistances(restaurants, coordinates);

    // Sort restaurants by distance
    restaurants.sort((a, b) => a.distance - b.distance);

    return NextResponse.json(restaurants, { status: 200});
};


/**
 * Find restaurants within a given distance
 */
const findRestaurantsWithinDistance = async (coordinates, distance) => {
    const db = await connectDB();
    const collection = db.collection('restaurants');

    const query = {
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates,
                },
                $maxDistance: distance * 1000, // Convert km to meters
            },
        },
    };

    // console.log(await collection.findOne({ _id: new ObjectId('672675733270f4ef789b85d6') }))

    const restaurants = await collection.find(query).toArray();
    console.log(restaurants);

    return restaurants;
};


/**
 * Calculate distance from user to each restaurant
 */
const calculateDistances = async (restaurants, coordinates) => {
    return Promise.all(
        restaurants.map(async (restaurant) => {
            const distance = getDistance(coordinates, restaurant.location.coordinates, 1);
            return { ...restaurant, distance };
        })
    );
};


export { POST };