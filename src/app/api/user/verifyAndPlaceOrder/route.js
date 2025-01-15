const { NextResponse } = require("next/server");

const POST = async (req, res, next) => {
    const { razorpayPaymentDetails } = await req.json();

    if (!razorpayPaymentDetails) {
        return NextResponse.json({ error: 'Razorpay payment details are required' }, { status: 400 });
    }

    try {
        const db = await connectDB();
        const order = await db.collection('orders').insertOne(razorpayPaymentDetails);
        return NextResponse.json({ order: order}, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};

export { POST };
