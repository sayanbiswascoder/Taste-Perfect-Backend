const { default: connectDB } = require("@/lib/mongodb")
const { NextResponse } = require("next/server")

const GET = async(req, res) => {
    const db = await connectDB()
    // await db.collection('restaurants').createIndex({ location: '2dsphere' });
    let lng = -73.85;
    let lat = 40.84
    let maxDistance = 1000;
    const locations = await db.collection('restaurants').find({
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
            $maxDistance: parseInt(maxDistance)  // max distance in meters
          }
        }
      }).toArray();
    console.log(locations)
    return NextResponse.json({'success': true})
}

export { GET}