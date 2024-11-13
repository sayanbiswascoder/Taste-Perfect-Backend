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
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Welcome to [Your Company Name]</title>
              <style>
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
                .temp-password-box {
                    display: inline-block;
                    padding: 10px 15px;
                    background-color: #f1f1f1;
                    color: #333333;
                    font-size: 18px;
                    font-weight: bold;
                    border-radius: 5px;
                    border: 1px solid #ddd;
                    cursor: pointer;
                    margin-top: 10px;
                }
                .temp-password-box:hover {
                    background-color: #e0e0e0;
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
                  <h1>Welcome to Taste Perfect!</h1>
                  <p>Hi ${name.split(' ')[0]},</p>
                  <p>We're excited to have you join us as a new admin at Taste Perfect. To help you get started, we've created a temporary password for you to access your admin account.</p>
                  <strong>Temporary Password:</strong>
                  <div class="temp-password">
                    <p>
                        <span class="temp-password-box" onclick="copyPassword()">${password}</span>
                    </p>
                  </div>
                  <p>For security reasons, please log in and change your temporary password as soon as possible. You can access the admin portal by clicking the button below:</p>
                  <p>
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/auth/login" class="button">Go to Admin Portal</a>
                  </p>
                  <p>If you have any questions or need assistance, please don’t hesitate to reach out to the IT team.</p>
                  <p>Best Regards,<br>The Taste Perfect Team</p>
                  <div class="footer">
                    <p>If you’re having trouble clicking the "Go to Admin Portal" button, copy and paste the URL below into your web browser:</p>
                    <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/auth/login" style="color: #007BFF;">${process.env.NEXT_PUBLIC_BASE_URL}/admin/auth/login</a></p>
                    <p>&copy; ${new Date().getFullYear()} Taste Perfect. All rights reserved.</p>
                  </div>
                </div>
              </div>
            </body>
            <script>
                function copyPassword() {
                  const tempPassword = "${password}";
                  navigator.clipboard.writeText(tempPassword).then(() => {
                    alert("Temporary password copied to clipboard!");
                  }).catch(err => {
                    alert("Failed to copy password, please try again.");
                  });
                }
            </script>
            </html>
        `);

        return NextResponse.json({}, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export { GET, POST };
