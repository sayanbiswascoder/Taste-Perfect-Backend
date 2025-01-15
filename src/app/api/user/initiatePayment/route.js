import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const POST = async (req, res, next) => {
    const { amount } = await req.json();
    let instance = new Razorpay({ key_id: 'rzp_test_bDPeFco4rKBEPk', key_secret: 'x5XXSiztT2jZqRMNLoj3mqeM' })

    const order = await instance.orders.create({
        "amount": amount * 100,
        "currency": "INR",
        "receipt": "receipt_" + Math.random().toString(36).substring(7),
        "partial_payment": false,
    })
    console.log("order", order)

    return NextResponse.json(order, { status: order.error ? 500 : 200 })
};

export { POST };
