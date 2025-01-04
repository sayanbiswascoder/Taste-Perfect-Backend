const { default: connectDB } = require("@/lib/mongodb");
const { NextResponse } = require("next/server");

const POST = async (req, res, next) => {
    const { dishes } = await req.json();

    if (!dishes) {
        return NextResponse.json({ error: 'Dishes are required' }, { status: 400 });
    }

    try {
        const db = await connectDB();

        const res = dishes.map(dish => {
            return db.collection('dishes').findOne(dish);
        })

        return NextResponse.json({ data: res }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to connect to the database' }, { status: 500 });
    }
}

export { POST };
