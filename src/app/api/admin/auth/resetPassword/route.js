import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import connectDB from "@/lib/mongodb";
import { verifyPassword } from "@/lib/auth";
import { hashPassword } from "@/lib/auth";
import { generateResetToken } from "@/utils/generateResetToken";
import nodemailer from 'nodemailer';
import sendEmail from "@/utils/sendEmail";


const POST = async (req, res, next) => {
    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    try {
        const db = await connectDB();

        // Check if user exists
        const user = await db.collection('admins').findOne({ email });
        if (!user) {
            return NextResponse.json({ error: 'User with this email does not exists' }, { status: 400 });
        }

        // Generate a unique reset token
        const resetToken = generateResetToken();
        const resetTokenExpires = Date.now() + 3600000; // 1 hour from now

        // Update user with reset token and expiration
        await db.collection('admins').updateOne(
            { _id: new ObjectId(user._id) },
            { $set: { resetToken, resetTokenExpires } }
        );

        const transporter = nodemailer.createTransport({
            service: 'Gmail',  // You can use any email provider
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/resetPassword?token=${resetToken}`;

        await sendEmail(user.email, 'Password Reset',`<!DOCTYPE html>
                    <html lang="en">
                    <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <title>Reset Your Password</title>
                      <style>
                        /* General reset */
                        * {
                          box-sizing: border-box;
                        }
                        body {
                          margin: 0;
                          padding: 0;
                          background-color: #f4f4f7;
                          font-family: Arial, sans-serif;
                          color: #51545E;
                        }
                        .email-container {
                          width: 100%;
                          padding: 20px;
                          background-color: #f4f4f7;
                        }
                        .email-content {
                          max-width: 600px;
                          margin: 0 auto;
                          background-color: #ffffff;
                          padding: 40px;
                          border-radius: 8px;
                          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                        }
                        h1 {
                          color: #333333;
                          font-size: 24px;
                          margin-bottom: 20px;
                        }
                        p {
                          font-size: 16px;
                          line-height: 1.6;
                          margin: 0 0 20px;
                          color: #51545E;
                        }
                        .button {
                          display: inline-block;
                          padding: 12px 24px;
                          background-color: #007BFF;
                          color: #ffffff;
                          font-size: 16px;
                          font-weight: bold;
                          text-decoration: none;
                          border-radius: 4px;
                          margin-top: 10px;
                        }
                        .button:hover {
                          background-color: #0056b3;
                        }
                        .footer {
                          text-align: center;
                          font-size: 14px;
                          color: #999999;
                          margin-top: 30px;
                        }
                      </style>
                    </head>
                    <body>
                      <div class="email-container">
                        <div class="email-content">
                          <h1>Password Reset Request</h1>
                          <p>Hi ${user.name.split(' ')[0]},</p>
                          <p>We received a request to reset your password. Click the button below to reset your password:</p>
                          <p>
                            <a href="${resetLink}" class="button">Reset Password</a>
                          </p>
                          <p>If you didn't request a password reset, please ignore this email or let us know. This link is valid for the next 1 hour.</p>
                          <p>Thanks,<br>The Taste Perfect Team</p>
                          <div class="footer">
                            <p>If you’re having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:</p>
                            <p><a href="${resetLink}" style="color: #007BFF;">${resetLink}</a></p>
                            <p>&copy; ${new Date().getFullYear()} Taste Perfect. All rights reserved.</p>
                          </div>
                        </div>
                      </div>
                    </body>
                    </html>
                    `,);

        return NextResponse.json({ message: 'Password reset link sent' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error sending reset email' }, { status: 500 });
    }
}

const UPDATE = async (req, res, next) => {
    const body = await req.json();
    const { newPassword } = body;


    if ((body.jwtToken && !body.token) || (!body.jwtToken && !body.token) || !newPassword) {
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
        const user = await db.collection('admins').findOne(searchQuery);
        if (!user || user.resetTokenExpires < Date.now()) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
        }

        // Hash the new password and update the user's password
        const hashedNewPassword = await hashPassword(newPassword);
        await db.collection('admins').updateOne(
            { _id: new ObjectId(user._id) },
            { $set: { password: hashedNewPassword }, $unset: { resetToken: "", resetTokenExpires: "" } }
        );

        return NextResponse.json({ message: 'Password reset successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
};

export { POST, UPDATE };
