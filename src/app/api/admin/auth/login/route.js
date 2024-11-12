const { NextResponse } = require("next/server");
import connectDB from "@/lib/mongodb";
import { verifyPassword } from "@/lib/auth";
import { generateToken } from "@/lib/jwt";

const POST = async (req, res, next) => {
    const { email, password } = await req.json();

    if (!email || !password) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    try {
        const db = await connectDB();

        // Check if user exists
        const user = await db.collection('admins').findOne({ email });
        if (!user) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
        }
        
        // Verify the password
        const isPasswordValid = await verifyPassword(password, user.password);
        console.log(isPasswordValid)
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
        }

        // Generate JWT token
        const token = generateToken(user._id);

        return NextResponse.json({ message: 'Login successful', token }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}

export { POST };
