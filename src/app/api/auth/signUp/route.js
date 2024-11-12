// pages/api/register.js
import connectDB from '@/lib/mongodb';
import { hashPassword } from '@/lib/auth';
import { generateToken } from '@/lib/jwt';
import { NextResponse } from 'next/server';

const POST = async(req, res) => {
  const { type, name, email, mobile, password } = await req.json();

  if (!name || !email || !mobile || !password) {
    return NextResponse.json({ error: 'All fields are required' }, {status: 400});
  }

  try {
    const db = await connectDB();

    // Check if user already exists
    const existingUser = await db.collection(type).findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, {status: 400})
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const result = await db.collection('users').insertOne({
      name,
      email,
      mobile,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = generateToken(result.insertedId);

    return NextResponse.json({ message: 'User created successfully', token }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 400 });
  }
}

export { POST };
