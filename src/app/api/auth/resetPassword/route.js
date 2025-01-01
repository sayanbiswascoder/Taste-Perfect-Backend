import connectDB from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { hashPassword } from '@/lib/auth';
import { verifyToken } from '@/lib/jwt';
import { NextResponse } from 'next/server';

const POST = async(req, res) => {
    const body = await req.json();
    const { type, newPassword } = body;


    if ((body.jwtToken == undefined && !body.token) || (!body.jwtToken == undefined && !body.token) || !newPassword) {
        return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    try {
        const db = await connectDB();

        let searchQuery = {}
        if (body.jwtToken) {
            let user = verifyToken(body.jwtToken)
            searchQuery = { _id: new ObjectId(user.userId) };
        } else {
            searchQuery = { resetToken: body.token };
        }

        // Find user by reset token and check expiration
        const user = await db.collection(type).findOne(searchQuery);
        console.log(user);
        if (!user || user.resetTokenExpires < Date.now()) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
        }

        // Hash the new password and update the user's password
        const hashedNewPassword = await hashPassword(newPassword);
        await db.collection(type).updateOne(
            { _id: new ObjectId(user._id) },
            { $set: { password: hashedNewPassword }, $unset: { resetToken: "", resetTokenExpires: "" } }
        );

        return NextResponse.json({ message: 'Password reset successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}

export { POST };
