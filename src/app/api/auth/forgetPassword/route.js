import connectDB from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { generateResetToken } from '@/utils/generateResetToken';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const POST = async(req, res) => {
  const { type, email } = await req.json();
  console.log(type, email)

  if (!type || !email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const db = await connectDB();

    // Check if user exists
    const user = await db.collection(type).findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User with this email does not exist' }, { status: 404 });
    }

    // Generate a unique reset token
    const resetToken = generateResetToken();
    const resetTokenExpires = Date.now() + 3600000; // 1 hour from now

    // Update user with reset token and expiration
    await db.collection('users').updateOne(
      { _id: new ObjectId(user._id) },
      { $set: { resetToken, resetTokenExpires } }
    );

    // Send email with the reset link
    const transporter = nodemailer.createTransport({
      service: 'Gmail',  // You can use any email provider
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/resetPassword?type=${type}&token=${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset',
      html: `<p>You requested a password reset. Click the link below to set a new password:</p>
             <p><a href="${resetLink}">Reset Password</a></p>`,
    });

    return NextResponse.json({ message: 'Password reset link sent' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error sending reset email' }, { status: 500 });
  }
}

export { POST };
