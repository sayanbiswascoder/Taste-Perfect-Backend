import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { hashPassword } from '@/lib/auth';
import { generateTempPassword } from '@/utils/generateTempPass';
import { verifyToken } from '@/lib/jwt';
import sendEmail from '@/utils/sendEmail';

const GET = async (req, res, next) => {
    const header = new Headers(req.headers);
    const JWT = header.get('Authorization').split(' ')[1];

    if (!JWT) {
        return NextResponse.json({ error: 'Token is required' }, { status: 401 });
    }

    try {
        const decodedToken = verifyToken(JWT);
        const db = await connectDB();
        const user = await db.collection('admins').findOne({ _id: new ObjectId(decodedToken.userId) });
        
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const dishes = await db.collection('admins').find({}).toArray();
        return NextResponse.json(dishes, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}


const POST = async (req, res, next) => {
    const header = new Headers(req.headers);
    const JWT = header.get('Authorization').split(' ')[1];
    const { name, email, mobile, superadmin } = await req.json();

    if (!JWT || !name || !email || !mobile || superadmin === undefined) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 401 });
    }

    try {
        const decodedToken = verifyToken(JWT);
        const db = await connectDB();
        const user = await db.collection('admins').findOne({ _id: new ObjectId(decodedToken.userId) });
        
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const password = generateTempPassword()

        
        db.collection('admins').insertOne({
            name,
            email,
            mobile,
            password: await hashPassword(password),
            superadmin,
        })

        sendEmail(email, 'Welcome to Taste Perfect', `
            <h1></h1>Your Temporary Password is: ${password}</h1>
        `);

        return NextResponse.json({}, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export { GET, POST };
